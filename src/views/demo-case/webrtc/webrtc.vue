<template>
  <div class="page-wrapper">
    <div class="chat-content">
      <div class="online-user-wrapper">
        <div class="title">在线用户</div>
        <div class="online-list">
          <div
            class="online-item"
            :class="{ select: item.id === currSelectUser.id }"
            v-for="item in onlineUsers"
            @click="onSelectClick(item)"
          >
            <div class="l-info">
              <!-- <img src="" alt="" /> -->
              <!-- <el-avatar :size="50" shape="square" :src="row.avatarUrl" v-if="row.avatarUrl" /> -->
              <el-avatar :size="50" :icon="useIcon('ep-user-filled')" />
              <span class="name">{{ item.account }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="msg-wrapper">
        <div class="msg-content">聊天内容区</div>
        <div class="btn-send-wrapper">
          <el-icon class="icon-send" size="24" @click="onPhoneBtnClick">
            <i-ep-phone />
          </el-icon>
          <el-icon class="icon-send" size="24" @click="onVideoBtnClick">
            <i-ep-video-camera />
          </el-icon>
        </div>
        <div class="input-wrapper">
          <el-input v-model="msgInput" size="large" placeholder="Please input">
            <template #append
              ><el-button type="primary" @click="onSendBtnClick">发送</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="video-wrapper" v-if="status > connectState.disconnect">
        <div class="invite-tip" v-if="inviteTip">{{ inviteTip }}</div>
        <video class="remote-video" autoplay playsinline></video>
        <video class="local-video" autoplay playsinline :muted="!speakerSwitch"></video>
        <div class="control-wrapper">
          <div class="device-control">
            <div class="control-item" @click="onMicrophoneClick">
              <div class="control-icon" :class="{ stop: !microphoneSwitch }">
                <el-icon :color="microphoneSwitch ? 'black' : 'white'" size="28">
                  <i-ep-microphone />
                </el-icon>
              </div>
              <div class="control-text">{{ microphoneSwitch ? '麦克风已开' : '麦克风已关' }}</div>
            </div>
            <div class="control-item" @click="onSpeakerClick">
              <div class="control-icon" :class="{ stop: !speakerSwitch }">
                <el-icon :color="speakerSwitch ? 'black' : 'white'" size="28">
                  <i-ep-headset />
                </el-icon>
              </div>
              <div class="control-text">{{ speakerSwitch ? '扬声器已开' : '扬声器已关' }}</div>
            </div>
            <div class="control-item" v-if="currChatType === 'video'">
              <div class="control-icon" :class="{ stop: !captrueSwitch }" @click="onCaptrueClick">
                <el-icon :color="captrueSwitch ? 'black' : 'white'" size="28">
                  <i-ep-video-camera />
                </el-icon>
              </div>
              <div class="control-text">{{ captrueSwitch ? '摄像头已开' : '摄像头已关' }}</div>
            </div>
          </div>
          <div class="btn-opt-group">
            <el-button type="primary" v-if="showAnswerBtn" @click="onAnswerBtnClick"
              >接通</el-button
            >
            <el-button type="danger" @click="onHangupClick">挂断</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
import { useIcon } from '@/components/CyIcon/hook'
// webrtc 抹平浏览器兼容性差异
import adapter from 'webrtc-adapter'
const { browser, version } = adapter.browserDetails
console.log('browser:', browser, 'version:', version)
import { io } from 'socket.io-client'
import { useUserStore } from '@/store/user'
const { userInfo } = useUserStore()

const onlineUsers = ref([
  {
    id: 3,
    account: 'qinmao'
  },
  {
    id: 5,
    account: 'admin1'
  }
])

let currSelectUser = ref({})

let socket = null,
  showAnswerBtn = ref(false), // 是否展示接通按钮，接收方：被呼叫时显示
  inviteTip = ref(''), // 邀请通信的文案
  currChatRoom = null, // 接收方收到的房间
  currChatType = ref(''), // 当前通信类型
  remoteVideoEl = null,
  localVideoEl = null,
  localStream = null,
  remoteStream = null,
  pc = null,
  dc = null

let microphoneSwitch = ref(true)
let speakerSwitch = ref(true)
let captrueSwitch = ref(true)

const connectState = {
  // 0 待机(未连接)、1 呼叫中 、3 已接通
  disconnect: 0,
  calling: 1,
  connect: 2
}
const status = ref(0)
const msgInput = ref()
let sendEnabled = false

//   let pcConfig = {
//     // 自建的服务
//     iceServers: [
//       {
//         urls: 'turn:stun.al.learningrtc.cn:3478',
//         credential: 'mypasswd',
//         username: 'lichao'
//       }
//       //   // 这里使用了几个公共的stun协议服务器
//       //   iceServers: [
//       //     { urls: 'stun:stun.services.mozilla.com' },
//       //     { urls: 'stun:stunserver.org' },
//       //     { urls: 'stun:stun.l.google.com:19302' }
//       //   ]
//     ]
//   }

// video|audio
function getUserMedia(type = 'video') {
  let mediaStreamContrains
  if (type === 'video') {
    mediaStreamContrains = {
      video: {
        frameRate: { min: 20 },
        width: { min: 640, ideal: 1280 },
        height: { min: 360, ideal: 720 },
        aspectRatio: 16 / 9
      },
      audio: {
        // 开启回音消除、降噪以及自动增益功能。
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    }
  } else if (type === 'audio') {
    mediaStreamContrains = {
      video: false,
      audio: {
        // 开启回音消除、降噪以及自动增益功能。
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    }
  }
  return navigator.mediaDevices.getUserMedia(mediaStreamContrains)
}

function createPeerConnection() {
  if (!pc) {
    console.log('create RTCPeerConnection!')
    pc = new RTCPeerConnection()
    // 监听收集 ICE Candidate 事件， ICE Candidate 就是收集本地网络信息
    pc.onicecandidate = (e) => {
      // const pc = e.target
      const candidate = e.candidate
      if (candidate) {
        //  每当获得一个新的 Candidate 后，通过信令服务器交换给对端
        console.log('发送 ice Candidate')
        sendMsg(currChatRoom, {
          type: 'candidate',
          label: candidate.sdpMLineIndex,
          id: candidate.sdpMid,
          candidate: candidate.candidate
        })
      } else {
        console.log('this is the end candidate')
      }
    }

    // 监听 track 事件，网络联通后触发
    pc.ontrack = (e) => {
      if (e && e.streams) {
        remoteStream = e.streams[0]
        remoteVideoEl.srcObject = remoteStream
      }
    }

    // 其中一方创建了 RTCDataChannel 且通信双方完成了媒体协商、交换了 SDP 之后，
    // 另一端收到发送端的消息，ondatachannel 事件就会被触发
    pc.ondatachannel = (e) => {
      console.log('接收方：触发 ondatachannel')
      dc = e.channel
      dc.onopen = function (e) {
        console.log('接收方：datachannel open')
        sendEnabled = true
      }
      dc.onmessage = function (e) {
        console.log('接收方:收到信息：', e.data)
      }
    }
  } else {
    console.log('RTCPeerConnection 已创建')
  }
}

function bindTracks() {
  console.log('bind tracks into RTCPeerConnection!')

  if (pc === null || localStream === undefined) {
    console.error('pc is null or undefined!')
    return
  }

  if (localStream === null || localStream === undefined) {
    console.error('localstream is null or undefined!')
    return
  }

  // add all track into peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream)
  })
}

function sendMsg(room, data) {
  if (!socket) {
    console.log('socket is null')
  }
  socket.emit('message', { room, data })
}

// 显示 音视频通信窗体
function showVideoChat(data) {
  const { to, from, type } = data
  // 提示 xx 呼叫你
  if (type == 'video') {
    inviteTip.value = `${from.account} 邀请你视频通话`
  } else {
    inviteTip.value = `${from.account} 邀请你语音通话`
  }
  status.value = connectState.calling
  showAnswerBtn.value = true
  nextTick(() => {
    localVideoEl = document.querySelector('.local-video')
    remoteVideoEl = document.querySelector('.remote-video')
  })
}

function initSignalServer() {
  socket = io()

  socket.on('connect', function () {
    console.log('信令通道创建成功！')
  })
  socket.on('disconnect', function () {
    console.log('Disconnected')
  })

  // 接收方：未建立p2p连接 收到通信请求（服务端广播触发），加入房间并创建连接
  socket.on('called', async (room, data) => {
    const { to, from, type } = data
    if (userInfo.id === to.id) {
      console.log('接收方：called', room, data)
      currChatRoom = room

      if (type === 'video' || type === 'audio') {
        currChatType.value = type
        showVideoChat(data)
      } else {
        createPeerConnection()
        // 消息发送不需要绑定
        socket.emit('join', {
          room
        })
      }
    }
  })

  // 接收方：已建立p2p连接
  socket.on('chatCalled', (data) => {
    const { room, type } = data
    console.log('接收方：chatCalled', data)

    if (type === 'video' || type === 'audio') {
      currChatType.value = type
      showVideoChat(data)
    }
  })

  socket.on('leaved', (room) => {
    hangup()
  })

  // 发送方：创建 offer 并发送
  socket.on('createSendOffer', async (room, from) => {
    console.log('发起方：创建 offer 并发给接收方')

    // 在 pc 连接上开辟一个数据通道  reliable：false 不保证数据可靠
    // RTCDataChannel 对象的创建要在媒体协商（offer/answer） 之前创建
    dc = pc.createDataChannel('chat', { reliable: false })

    dc.onopen = function () {
      console.log('发起方：datachannel open')
      sendEnabled = true
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

    // 如果当前客户端是发送方
    // 获取本地媒体描述信息，即 SDP 信息 发起方的sdp 称作 offer，并与对端进行交换；
    const offer = await pc.createOffer()
    // 触发 pc.onicecandidate 事件，开始收集本机 ICE Candidate
    pc.setLocalDescription(offer)
    // 对等方收到ice信息后，通过调用 addIceCandidate 将接收的候选者信息传递给浏览器的ICE代理
    sendMsg(room, offer)
  })

  // 端到端命令（offer、answer、candidate）
  socket.on('message', async (msgData) => {
    // console.log('receive message!', msgData)
    if (msgData === null || msgData === undefined) {
      console.error('the message is invalid!')
      return
    }
    const { room, data } = msgData

    if (data['type'] && data.type === 'offer') {
      console.log('接收方：收到 offer，设为远程对话描述并创建 answer 发给发起方')
      pc.setRemoteDescription(new RTCSessionDescription(data))
      const answer = await pc.createAnswer()
      pc.setLocalDescription(answer)
      sendMsg(room, answer)
    } else if (data['type'] && data.type === 'answer') {
      console.log('发起方：收到 answer，设为远程对话描述')
      pc.setRemoteDescription(new RTCSessionDescription(data))
    } else if (data['type'] && data.type === 'candidate') {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: data.label,
        candidate: data.candidate
      })
      // addIceCandidate() 方法将收到的 Candidate 保存起来，按照 Candidate 的优先级进行连通性检测
      // 如果 Candidate 连通性检测完成，那么端与端之间就建立了物理连接，这时媒体数据就可能通这个物理连接源源不断地传输了
      pc.addIceCandidate(candidate)
      console.log('收到对方 ice candidate 设为本机 ice 代理')
    } else {
      console.log('the message is invalid!', data)
    }
  })
}

function onSelectClick(item) {
  currSelectUser.value = item
}

// type 发起通信类型，msg|video|audio
async function call(type) {
  if (!pc) {
    console.log('首次发起呼叫')
    // 首次发起呼叫
    currChatRoom = await socket.timeout(5000).emitWithAck('createChat', {
      from: userInfo,
      to: currSelectUser.value,
      type
    })
    createPeerConnection()
  } else {
    console.log('已建立连接发起呼叫')
    // 已建立连接发起呼叫
    socket.emit('chatCall', { room: currChatRoom, from: userInfo, type })
  }
}

// 发起方：发起视频通话
async function onVideoBtnClick() {
  if (!currSelectUser.value.id) {
    ElMessage({
      message: '请选择用户',
      type: 'warning'
    })
    return
  }

  if (status.value !== connectState.disconnect) {
    ElMessage({
      message: '视频正在通话中...',
      type: 'success'
    })
    return
  }

  status.value = connectState.calling

  nextTick(() => {
    localVideoEl = document.querySelector('.local-video')
    remoteVideoEl = document.querySelector('.remote-video')
  })

  // 获取授权，拿到本地媒体流,显示
  try {
    localStream = await getUserMedia()
    localVideoEl.srcObject = localStream
  } catch (error) {
    console.log('摄像头/麦克风获取失败！')
    console.log('error:', error)
    return
  }

  await call('video')

  bindTracks()
}

// 发起方：发起语音通话
async function onPhoneBtnClick() {
  if (!currSelectUser.value.id) {
    ElMessage({
      message: '请选择用户',
      type: 'warning'
    })
    return
  }

  if (status.value !== connectState.disconnect) {
    ElMessage({
      message: '视频正在通话中...',
      type: 'success'
    })
    return
  }

  status.value = connectState.calling

  nextTick(() => {
    localVideoEl = document.querySelector('.local-video')
    remoteVideoEl = document.querySelector('.remote-video')
  })

  // 获取授权，拿到本地媒体流,显示
  try {
    localStream = await getUserMedia('audio')
    localVideoEl.srcObject = localStream
  } catch (error) {
    console.log('摄像头/麦克风获取失败！')
    console.log('error:', error)
    return
  }

  await call('audio')

  bindTracks()
}

// 接受方：点击开始接通
async function onAnswerBtnClick() {
  status.value = connectState.connect
  inviteTip.value = ''
  showAnswerBtn.value = false

  // 获取授权，拿到本地媒体流,显示
  try {
    localStream = await getUserMedia(currChatType)
    const localVideoEl = document.querySelector('.local-video')
    localVideoEl.srcObject = localStream
  } catch (error) {
    console.log('摄像头/麦克风获取失败！')
    console.log('error:', error)
    return
  }
  createPeerConnection()
  bindTracks()

  // 接收方加入房间 服务端触发 发送方的 createSendOffer 事件
  socket.emit('join', {
    room: currChatRoom
  })
}

function hangup() {
  // 控制状态还原
  status.value = connectState.disconnect
  showAnswerBtn.value = false
  sendEnabled = false

  if (!pc) {
    return
  }
  localStream.getTracks().forEach((track) => {
    track.stop()
  })
  localStream = null
  remoteStream = null
  pc.close()
  pc = null
  if (dc) {
    dc.close()
    dc = null
  }
}

// 点击挂断
function onHangupClick() {
  socket.emit('leaved', { room: currChatRoom })
  hangup()
}

// 麦克风开关
function onMicrophoneClick() {
  microphoneSwitch.value = !microphoneSwitch.value
  const audioTracks = localStream.getAudioTracks()
  if (audioTracks.length > 0) {
    const isEnabled = audioTracks[0].enabled
    audioTracks[0].enabled = !isEnabled // 切换麦克风状态
    console.log(`麦克风已${isEnabled ? '关闭' : '开启'}`)
  }
}

// 扬声器开关
function onSpeakerClick() {
  // 控制播放器静音按钮实现
  speakerSwitch.value = !speakerSwitch.value
}

// 摄像头开关
function onCaptrueClick() {
  captrueSwitch.value = !captrueSwitch.value
  const videoTracks = localStream.getVideoTracks()
  if (videoTracks.length > 0) {
    const isEnabled = videoTracks[0].enabled
    videoTracks[0].enabled = !isEnabled // 切换摄像头状态
    console.log(`摄像头已${isEnabled ? '关闭' : '开启'}`)
  }
}

// 发送消息
function onSendBtnClick() {
  if (!currSelectUser.value.id) {
    ElMessage({
      message: '请选择用户',
      type: 'warning'
    })
    return
  }

  if (!sendEnabled) {
    ElMessage({
      message: 'p2p 连接 建立中...',
      type: 'warning'
    })
    call('msg') // 建立p2p通信
    return
  }

  dc.send(msgInput.value)
  msgInput.value = ''
}

onMounted(() => {
  initSignalServer()
})

onUnmounted(() => {
  //   vConsole.destroy()
})
</script>

<style lang="scss" scoped>
.chat-content {
  display: flex;
  justify-content: space-between;
  height: 80vh;
  .online-user-wrapper {
    width: 300px;
    border: 1px solid lightgray;
    padding: 10px;
    .title {
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-bottom: 0.5px solid lightgray;
    }
    .online-list {
      .online-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
        border-bottom: 0.5px solid lightgrey;
        &:hover {
          cursor: pointer;
          background-color: lightgray;
          border-radius: 4px;
        }
        .l-info {
          display: flex;
          align-items: center;
          padding-left: 10px;
          .name {
            margin-left: 20px;
          }
        }
      }
      .select {
        background-color: lightgray;
        border: none;
        border-radius: 4px;
      }
    }
  }
  .msg-wrapper {
    flex: 1;
    margin: 0 20px;
    border: 1px solid lightgray;
    .msg-content {
      height: 88%;
      border-bottom: 1px solid lightgray;
    }
    .btn-send-wrapper {
      padding-right: 10px;
      text-align: right;
      width: 100%;
      height: 40px;
      .icon-send {
        margin-top: 8px;
        margin-right: 20px;
        &:hover {
          cursor: pointer;
          color: var(--el-color-primary);
        }
      }
    }
  }
  .video-wrapper {
    position: relative;
    width: 460px;
    border-radius: 6px;
    background-color: #272727;
    .invite-tip {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }
    .remote-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      /* 水平翻转 */
      transform: scaleX(-1);
    }
    .local-video {
      position: absolute;
      right: 4px;
      top: 4px;
      width: 260px;
      height: 200px;
      border-radius: 4px;
      object-fit: cover;
      /* 水平翻转 */
      transform: scaleX(-1);
    }
    .control-wrapper {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 200px;
      color: #fff;
      //   border: 1px solid red;
    }
    .device-control {
      display: flex;
      .control-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        &:hover {
          cursor: pointer;
        }
        .control-icon {
          width: 60px;
          height: 60px;
          line-height: 70px;
          border-radius: 50%;
          background-color: #eee;
          text-align: center;
        }
        .stop {
          background-color: lightgrey;
        }
        .control-text {
          margin-top: 10px;
        }
      }
    }
    .btn-opt-group {
      text-align: center;
      margin-top: 46px;
    }
  }
}
</style>
