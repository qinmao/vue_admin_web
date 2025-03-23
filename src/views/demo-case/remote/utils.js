// webrtc 磨平浏览器兼容性差异
import adapter from 'webrtc-adapter'
import { io } from 'socket.io-client'
const { browser, version } = adapter.browserDetails
console.log('browser:', browser, 'version:', version)
adapter.browserDetails.version

export function useMedia() {
  function onloadeddata() {
    const remoteVideo = document.querySelector('#remote-video')

    // // 检查浏览器是否支持自动播放，如果支持则使用 playsinline 或 muted 属性
    // if ('playsInline' in localVideo) {
    //   localVideo.playsInline = true // iOS 10+ Safari 需要这个属性
    //     localVideo.muted = true // 自动播放需要静音
    // }

    // if ('playsInline' in remoteVideo) {
    //   remoteVideo.playsInline = true // iOS 10+ Safari 需要这个属性
    //     remoteVideo.muted = true // 自动播放需要静音
    // }
    remoteVideo.addEventListener(
      'loadedmetadata',
      function () {
        // 当视频的元数据已加载后，再尝试播放
        remoteVideo
          .play()
          .then(() => {
            // 播放成功
          })
          .catch((error) => {
            // 处理播放错误
            console.error('播放失败:', error)
          })
      },
      false
    )
  }

  function handleError(err) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      // 用户拒绝了音视频权限，可以在此处提示用户开启权限
      console.log('用户拒绝了音视频权限,请点击允许')
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      // 没有检测到音视频设备
      console.log('没有检测到音视频设备')
    } else {
      // 其他错误，可以进行相应处理
      console.log('其他错误')
    }
  }

  function getUserMedia(sourceId) {
    // return navigator.mediaDevices
    //   .getDisplayMedia({
    //     video: {
    //       cursor: 'always' // 捕获鼠标光标
    //     },
    //     audio: false // 捕获屏幕通常不需要音频
    //   })
    //   .catch((error) => {
    //     console.error('Error accessing screen capture:', error)
    //   })

    return navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId, // 获取整个桌面不要传
            maxWidth: window.screen.width,
            maxHeight: window.screen.height
            //   minWidth: 1280,
            //   minHeight: 720,
          }
        }
      })
      .catch((e) => {
        handleError(e)
      })
  }

  return {
    onloadeddata,
    getUserMedia
  }
}

export function usePeer() {
  let socket,
    pc,
    dc,
    sendIces = []

  function initSignalServer(currentUserId) {
    socket = io()
    socket.on('connect', function () {
      console.log('信令通道创建成功！')
    })
    socket.on('disconnect', function () {
      console.log('Disconnected')
    })
    socket.on('message', async (receiveData) => {
      if (!window.QueBridge) {
        return
      }
      //   console.log('receiveData:', receiveData)
      const { from, to, data } = receiveData
      // 当前用户就是要发送的用户
      if (currentUserId !== to.id) {
        return
      }
      const { type } = data
      if (type === 'offer') {
        console.log(`收到发起方的 SDP offer,创建连接`)
        // 创建 webrtc 连接,获取 媒体流
        answerLink(receiveData)
      } else if (type === 'answer') {
        console.log(`发起方：收到 answer SDP 设置远端的配置`)
        pc.setRemoteDescription(data)
      } else if (type === 'offer_ice') {
        // 注意顺序：必须先设置远端sdp之后，再设置 ice
        console.log('收到发起方的ice,保存 ice 代理')
        sendIces.push(data.candidate)
      } else if (type === 'answer_ice') {
        pc.addIceCandidate(data.candidate)
          .then(() => {
            console.log('Successed to add ice candidate')
          })
          .catch((err) => {
            console.error(err)
          })
      }
    })
  }

  function onMouseKeyEvt() {
    // 监听鼠标和键盘事件
    window.onkeydown = function (e) {
      const { keyCode, metaKey, altKey, ctrlKey, shiftKey } = e
      const data = {
        keyCode,
        meta: metaKey,
        alt: altKey,
        shift: shiftKey,
        control: ctrlKey
      }
      const sendData = JSON.stringify({
        type: 'key',
        data
      })
      dc.send(sendData)
    }
    window.onmouseup = function (e) {
      const remoteVideo = document.querySelector('#remote-video')
      // data {clientX, clientY, screen: {width, height}, video: {width, height}}
      const { clientX, clientY } = e
      const { width, height } = remoteVideo.getBoundingClientRect()
      const data = {
        clientX,
        clientY,
        video: {
          width,
          height
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        }
      }
      const sendData = JSON.stringify({
        type: 'mouse',
        data
      })
      dc.send(sendData)
    }
  }

  async function startLink(sendUser) {
    const remoteVideo = document.querySelector('#remote-video')

    const { from, to } = sendUser

    // 1. 创建 PeerConnection 公共的stun协议服务器
    const pcConfig = {
      iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stunserver.org' },
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    }
    pc = new RTCPeerConnection(pcConfig)

    // 2. 去主进程获取 sourceId,然后获取当前应用本地媒体流
    const sources = await window.QueBridge.invoke('get-source')
    // console.log('sources:', sources)
    const sourceId = sources[0].id

    // console.log('sourceId:', sourceId)
    const localStream = await useMedia().getUserMedia(sourceId)
    // 将其中所有媒体轨道（MediaStreamTrack）添加到轨道集，这些轨道将被发送到另一对等方
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream))

    pc.ontrack = (e) => {
      if (e && e.streams) {
        console.log('发起方：收到对方音频/视频流数据...')
        remoteVideo.srcObject = e.streams[0]
      }
    }
    // 收集候选 ice 信息，并发送 offer_ice 到对等方
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('发起方：收集并传输的候选ice信息')
        socket.emit('message', {
          from,
          to,
          data: {
            type: 'offer_ice',
            candidate: e.candidate
          }
        })
      }
    }

    // 在 pc 连接上开辟一个数据通道  reliable：false 不保证数据可靠
    dc = pc.createDataChannel('remote', { reliable: false })

    dc.onopen = function () {
      console.log('数据通道成功打开,监听鼠标键盘事件，发送指令到响应端')
      // 表示数据通道成功打开
      onMouseKeyEvt()
    }

    dc.onclose = function () {
      console.log('datachannel close')
    }

    dc.onerror = (e) => {
      console.log(e)
    }

    dc.onmessage = (e) => {
      console.log('数据通道发来的信息：', e.data)
    }

    // 2. 创建本地 SDP 并发送到指定客户端
    const offer = await pc.createOffer()
    socket.emit('message', {
      from,
      to,
      data: offer
    })
    console.log(`发起方：创建传输本地 SDP offer`)

    // 设置本地SDP,触发 onicecandidate 事件 收集 ice 信息，并发送 offer_ice 到对等方
    await pc.setLocalDescription(offer).catch((err) => {
      console.error('Failed to create offer:', err)
    })
  }

  async function answerLink(receiveData) {
    const { invoke, send, onMsgEvt, removeMsgEvt } = window.QueBridge

    const { from, to, data } = receiveData
    // 1. 创建 PeerConnection
    const pcConfig = {
      // 这里使用了几个公共的stun协议服务器
      iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stunserver.org' },
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    }
    pc = new RTCPeerConnection(pcConfig)

    // 2. 去主进程获取 sourceId,然后获取当前应用本地媒体流
    const sources = await invoke('get-source')
    console.log('sources:', sources)
    const remoteWindow = sources.find((item) => item.name === 'remote-control')
    if (!remoteWindow) {
      return
    }
    const sourceId = remoteWindow.id
    const localStream = await useMedia().getUserMedia(sourceId)
    // 将其中所有媒体轨道（MediaStreamTrack）添加到轨道集，这些轨道将被发送到另一对等方
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream))

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('接受方：收集并传输的候选ice信息')

        socket.emit('message', {
          from: to,
          to: from,
          data: {
            type: 'answer_ice',
            candidate: e.candidate
          }
        })
      }
    }

    // 发现数据传输通道
    pc.ondatachannel = (e) => {
      dc = e.channel

      dc.onopen = function (e) {
        console.log('datachannel open')
        // 表示数据通道成功打开
      }
      dc.onmessage = function (e) {
        const msgData = JSON.parse(e.data)
        console.log('数据通道发来的信息：', msgData)

        // 把 数据通道发来的数据发送给 主进程去响应指令操作
        send('robot', msgData)
      }
    }

    pc.setRemoteDescription(data)
    console.log(`接受方：设置远端的 SDP:`)
    const answerOffer = await pc.createAnswer()

    socket.emit('message', {
      from: to,
      to: from,
      data: answerOffer
    })

    console.log(`接受方：创建并传输应答SDP`)

    for (let index = 0; index < sendIces.length; index++) {
      const candidate = sendIces[index]
      pc.addIceCandidate(candidate)
        .then(() => {
          console.log('Successed to add ice candidate')
        })
        .catch((err) => {
          console.error(err)
        })
    }

    pc.setLocalDescription(answerOffer)
    console.log(`接受方：设置本地 SDP`)
  }

  return { socket, pc, dc, startLink, initSignalServer }
}
