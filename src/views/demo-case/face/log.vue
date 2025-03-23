<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="l-log-list">
        <h4 class="title">帧画面采集 共 {{ list.length }} 条</h4>
        <div class="log-item-wrapper">
          <el-scrollbar ref="logScrollbarRef">
            <div
              class="log-item"
              :class="{ select: index === currentIndex }"
              v-for="(item, index) in list"
              @click="onLogClick(item, index)"
            >
              <div class="item-row">
                <span class="name"> 设备名称： </span>
                <span class="value ellipsis">{{ item.deviceName }}</span>
              </div>
              <div class="item-row">
                <span class="name"> 设备地址： </span>
                <span class="value ellipsis">{{ item.deviceAddr }}</span>
              </div>
              <div class="item-row">
                <span class="name">采集时间：</span>
                <span class="value ellipsis">{{ item.captrueTime }}</span>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="c-img-wrapper">
        <h4 class="title">场景图</h4>
        <div
          class="t-big"
          :style="{ backgroundImage: 'url(' + urlFormat(currentItem.sceneUrl) + ')' }"
        ></div>
        <div class="b-face">
          <h4 class="title">未识别的人像</h4>
          <div class="no-reg-avatar">
            <el-scrollbar>
              <div style="display: flex">
                <div
                  class="avatar"
                  :style="{ backgroundImage: 'url(' + urlFormat(item.faceUrl) + ')' }"
                  v-for="item in currentItem.no_reg_results"
                ></div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="r-identity">
        <h4 class="title">已识别的人像</h4>
        <div class="identity-wrapper">
          <el-scrollbar>
            <div class="avatar-item-wrapper" v-for="(item, index) in currentItem.reg_results">
              <div class="img-wrapper">
                <div
                  class="avatar"
                  :style="{ backgroundImage: 'url(' + urlFormat(item.faceUrl) + ')' }"
                ></div>
                <!-- <img class="avatar" :src="'data:image/jpeg;Base64,' + item.faceUrl" alt="" /> -->
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
// import dayjs from 'dayjs'

defineOptions({
  name: 'face-detect-log'
})

const logScrollbarRef = ref(null)

const currentIndex = ref(0)

const currentItem = computed(() => {
  return list.length > 0 ? list[currentIndex.value] : {}
})

const list = reactive([])

let socket

// function avatarFormat(url) {
//   const host = 'http://50.105.1.69:10219'
//   const originHost = 'https://50.105.1.69:10220'
//   return url.replace(originHost, host)
// }

function base64ToUrl(url) {
  if (!url) {
    return ''
  }
  return 'data:image/jpeg;Base64,' + url
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

    socket.emit('startFrameProcess', {
      // from: {
      //   id: '0',
      //   name: 'admin'
      // },
      data: {
        streamUrl: '',
        cameraIndexCode: ''
      }
    })
  })

  socket.on('disconnect', function () {
    console.log('Disconnected')
  })

  // 监听 显示识别结果
  socket.on('onRecognitionResult', (recognition_result) => {
    // console.log('收到:', recognition_result)
    list.push(recognition_result)
    // currentIndex.value = list.length - 1
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (logScrollbarRef.value) {
    const wrap = logScrollbarRef.value.wrapRef
    wrap.scrollTop = wrap.scrollHeight
  }
}

// 日志点击事件
function onLogClick(item, index) {
  currentIndex.value = index
}

onMounted(() => {
  initSignalServer()
})

onUnmounted(() => {
  if (socket) {
    socket.off() // 取消所有事件监听
    console.log('取消所有 Socket.IO 事件监听')
  }
})
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 90vh;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid lightgray;
  .title {
    padding-left: 20px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    border-bottom: 0.5px solid lightgray;
  }

  .l-log-list {
    width: 300px;
    height: 100%;
    border-radius: 4px;
    border: 0.5px solid lightgray;
    .log-item-wrapper {
      height: calc(100% - 40px);
      // padding-bottom: 20px;
    }
    .log-item {
      margin: 0 auto;
      width: 90%;
      margin-bottom: 10px;
      padding: 6px 0;
      padding-left: 4px;
      border: 0.5px solid lightgray;
      border-radius: 4px;
      .item-row {
        display: flex;
        align-items: center;
        .name {
          font-size: 13px;
          color: black;
        }
        .value {
          max-width: 180px;
          font-size: 12px;
          color: rgb(21, 21, 21);
          // border: 1px solid red;
        }
      }
      &:hover {
        cursor: pointer;
      }
    }
    .select {
      color: white;
      background-color: var(--el-color-primary);
      border: none;
      .name,
      .value {
        color: white !important;
      }
    }
  }
  .c-img-wrapper {
    flex: 1;
    margin: 0 20px;
    border-radius: 4px;
    border: 1px solid lightgray;
    width: calc(100vw - 700px - 40px);
    .t-big {
      height: calc(100% - 260px);
      border-bottom: 0.5px solid lightgray;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      //   background-color: red;
    }
    .b-face {
      height: 240px;

      .no-reg-avatar {
        margin-top: 30px;
        height: 140px;
        .avatar {
          flex: 0 0 auto; /* 子元素宽度不会被压缩 */
          margin-left: 10px;
          width: 180px;
          height: 140px;
          border-radius: 4px;
          border: 1px solid lightgray;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }
  }
  .r-identity {
    width: 400px;
    height: 100%;
    border: 1px solid lightgray;
    .identity-wrapper {
      height: calc(100% - 40px);
    }
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
        border: 1px solid lightgray;
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
</style>
