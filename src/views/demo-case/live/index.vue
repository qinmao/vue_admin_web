<template>
  <div class="page-wrapper">
    <div class="device-wrapper">
      <el-button @click="onCapClick" type="primary"> 本机摄像头 </el-button>
      <el-button @click="onCapClick" type="primary"> 监控摄像头 </el-button>
    </div>

    <!-- autoplay poster -->
    <video controls preload="auto" muted ref="videoPlayerRef" class="video video-js">
      <!-- https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8 -->
      Your browser does not support HTML5 video.
    </video>
  </div>
</template>

<script setup>
defineOptions({
  name: 'VideoJs'
})

import videojs from 'video.js'
import 'video.js/dist/video-js.css'

function initVideo(videoEl) {
  const videoOptions = {
    language: 'zh-CN',
    liveui: true, // 新的live用户界面
    fluid: true // 自适应宽高,
    // plugins: {}
    //   sources: [
    //     {
    //       src: '/dest/video/1/output.m3u8',
    //       type: 'application/x-mpegURL'
    //     }
    //   ]
  }
  const player = videojs(videoEl, videoOptions)

  player.on('ready', function () {
    console.log('播放器已准备就绪')
    // exitFullscreen();
    // this.requestFullscreen();

    // 在具有源的播放器上开始播放
    // this.play();
  })
  player.on('ended', function () {
    this.dispose()
  })
  return player
}

function startPlay(player, url) {
  const source = {
    src: url,
    type: 'application/x-mpegURL'

    // type: 'video/mp4',
    // src: 'http://www.example.com/path/to/video.mp4'

    // src:'rtsp://your_rtsp_stream'
    // type:'video/rtsp'
  }
  player.pause()
  player.src([])

  player.src(source)
  player.load()
  player.play()
}

function onCapClick() {}

onMounted(() => {
  //   initVideo(videoPlayerRef.value)
  // getCamerasPage()
})
</script>

<style lang="scss" scoped>
.device-wrapper {
  margin-bottom: 10px;
}
.video {
  width: 80%;
  height: 70%;
}
</style>
