import { $http } from '@/plugins/axios/index'

export function useDevice() {
  let deviceList = reactive([
    {
      cameraIndexCode: 'local',
      name: '本机摄像头'
    },
    {
      cameraIndexCode: '32128256001320130954',
      name: '人民医院外科大楼北入口'
    }
  ])

  // 分页获取监控点资源
  async function getCamerasPage() {
    const { result } = await $http.post('/haikang/getCameras', {
      pageNo: 1,
      pageSize: 5
    })
    deviceList = result.list
  }

  // 获取监控点预览取流url
  async function getPreviewURLs(cameraIndexCode) {
    const { result } = await $http.post('/api/haikang/getPreviewURLs', {
      // "cameraIndexCode": "32128256001320130954",
      cameraIndexCode,
      protocol: 'rtsp',
      expand: 'streamform=rtp'
    })
    return result.url || ''
  }

  return {
    deviceList,
    getCamerasPage,
    getPreviewURLs
  }
}
