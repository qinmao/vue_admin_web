<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="device-wrapper">
        <!-- <h4 class="title">设备点位</h4> -->
        <div class="device-content">
          <div
            class="video-item"
            :class="{ select: item.cameraIndexCode === currentDevicesId }"
            v-for="item in deviceList"
            @click="onCapClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="captrue-wrapper">
        <div class="l-captrue">
          <!-- poster -->
          <video controls preload="auto" muted ref="videoPlayerRef" class="video video-js">
            <!-- https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8 -->
            <!-- http://localhost:5173/dest/video/output.m3u8 -->
            <!-- <source :src="videoUrlFormat(videoUrl)" type="application/x-mpegURL" /> -->
            <!-- 提供 HTML5 video 支持 -->
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div class="r-avatar">
          <el-scrollbar ref="scrollbarRef">
            <div class="avatar-item-wrapper" v-for="(item, index) in list">
              <div class="img-wrapper">
                <div
                  class="avatar"
                  :style="{ backgroundImage: 'url(' + urlFormat(item.faceUrl) + ')' }"
                ></div>
                <!-- <img class="avatar" :src="'data:image/jpeg;Base64,' + item.faceUrl" alt="" /> -->
                <!-- <img class="avatar" :src="avatarFormat(item.avatarUrl)" alt="" /> -->
              </div>
              <div class="profile">
                <p>姓名：{{ item.userName }}</p>
                <p>证件号：{{ item.idNum }}</p>
                <!-- <p>相似度：{{ item.similar }}</p> -->
                <p>标签：盗窃、抢窃、吸毒</p>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { io } from 'socket.io-client'
// import { useIcon } from '@/components/ReIcon/hook'
import { useVideo } from './utils/video-hook'
import { useDevice } from './utils/device-hook'

const { deviceList, getCamerasPage, getPreviewURLs } = useDevice()
const { startPlay, initVideo } = useVideo()

const scrollbarRef = ref(null)
const videoPlayerRef = ref(null)

const currentDevicesId = ref('')

const list = reactive([
  //   {
  //     name: 'qinmao',
  //     idNumber: 3411821993062224817,
  //     similar: 95,
  //     faceUrl: ''
  //   }
])

let socket,
  player = null

// 兼容商汤图片地址
function avatarFormat(url) {
  const host = 'http://50.105.1.69:10219'
  const originHost = 'https://50.105.1.69:10220'
  return url.replace(originHost, host)
}

function urlFormat(url) {
  //   return 'data:image/jpeg;Base64,' + url
  // 'http://127.0.0.1:5001/imgs/2024-10-17/face/1d2bec56-96ca-44ea-af6c-3543e626de9e.png'
  const host = 'http://127.0.0.1:5001'
  return `${host}/${url}`
}

function initSignalServer() {
  socket = io()
  socket.on('connect', function () {
    console.log('信令通道创建成功！')
  })

  socket.on('disconnect', function () {
    console.log('Disconnected')
  })

  // 获取实时流地址
  //   socket.on('onVideoUrlChange', (videoUrl) => {
  //     console.log('收到实时流地址:', videoUrl)
  //     const originHost = 'http://127.0.0.1:5001'
  //     const host = 'http://localhost:5173'
  //     const url = videoUrl.replace(originHost, host)
  //     startPlay(url, player)
  //   })

  // 监听 显示识别结果
  socket.on('onRecognitionResult', (recognition_result) => {
    // console.log(recognition_result)
    const { reg_results } = recognition_result
    list.push(...reg_results)
    scrollToBottom()
  })
}

// 摄像头选中点击事件
async function onCapClick(item) {
  // 正在播放
  const { cameraIndexCode } = item
  currentDevicesId.value = cameraIndexCode

  // const rtspUrl = await getPreviewURLs(cameraIndexCode)
  // 通知后端检测识别服务启动
  socket.emit('startFrameProcess', {
    // from: {
    //   id: '0',
    //   name: 'admin'
    // },
    data: {
      streamUrl: '',
      cameraIndexCode
    }
  })

  setTimeout(() => {
    const url = `http://localhost:5173/hls/${cameraIndexCode}/index.m3u8`
    startPlay(url, player)
  }, 20 * 1000)
}

function scrollToBottom() {
  if (scrollbarRef.value) {
    const wrap = scrollbarRef.value.wrapRef
    wrap.scrollTop = wrap.scrollHeight
  }
}

onMounted(() => {
  initSignalServer()

  player = initVideo(videoPlayerRef.value)

  // getCamerasPage()
})

onUnmounted(() => {
  if (socket) {
    socket.off() // 取消所有事件监听
    console.log('取消所有 Socket.IO 事件监听')
  }
  if (player) {
    player.dispose()
  }
})
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 90vh;
  border: 1px solid lightgrey;
  border-radius: 10px;

  .device-wrapper {
    .title {
      width: 100%;
      padding: 10px 0;
      margin-left: 20px;
      border-bottom: 0.5px solid lightgrey;
    }
    .device-content {
      display: flex;
      align-items: center;
      height: 80px;

      .video-item {
        margin-left: 20px;
        height: 40px;
        border: 1px solid grey;
        border-radius: 10px;
        line-height: 40px;
        font-size: 14px;
        padding: 0 10px;
        cursor: pointer;

        &:hover {
          border-color: blue;
          color: blue;
        }
      }

      .select {
        border-color: blue;
        color: blue;
      }
    }
  }

  .captrue-wrapper {
    display: flex;
    width: 100%;
    height: calc(90vh - 80px);
    border-top: 1px solid lightgray;
    padding: 20px;

    .l-captrue {
      position: relative;
      width: 68%;
      height: 100%;
      border-radius: 10px;
      border: 1px solid lightgray;
    }

    .r-avatar {
      flex: 1;
      border: 1px solid lightgray;
      border-radius: 10px;
      margin-left: 20px;

      .avatar-item-wrapper {
        width: 96%;
        height: 140px;
        margin: 10px auto;
        display: flex;
        align-items: center;
        border: 1px solid lightgray;
        border-radius: 10px;

        .img-wrapper {
          display: flex;
          margin-left: 10px;
          margin-right: 10px;
          //   border: 1px solid red;
        }

        .avatar {
          width: 100px;
          height: 120px;
          border: 1px solid lightgrey;
          border-radius: 10px;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;

          &:first-child {
            margin-right: 6px;
          }
        }

        .profile {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          height: 120px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
