// 视频相关
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export function useVideo() {
  function initVideo(videoEl) {
    const videoOptions = {
      language: 'zh-CN',
      liveui: true, // 新的live用户界面
      fluid: true // 自适应宽高
      //   sources: [
      //     {
      //       src: 'http://127.0.0.1:8082/hls/111/index.m3u8',
      //       type: 'application/x-mpegURL'
      //     }
      //   ]
    }
    const player = videojs(videoEl, videoOptions)
    return player
  }

  function startPlay(url, player) {
    const source = {
      src: url,
      type: 'application/x-mpegURL'
    }
    player.pause()
    player.src([])

    player.src(source)
    player.load()
    player.play()
  }

  return {
    initVideo,
    startPlay
    // videoUrl
  }
}
