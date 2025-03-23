<template>
  <div class="page-wrapper">
    <div class="control-wrapper" v-if="status === 0">
      <el-row>
        <el-col :span="18">
          本机控制码: <span> {{ localCode }} </span></el-col
        >
        <el-col :span="6"> <el-button @click="onCopyBtnClick"> 复制控制码 </el-button></el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <el-input v-model="remoteCode" placeholder="请输入控制码" clearable size="large">
            <template #append>
              <el-button
                :disabled="status === 1 || !remoteCode"
                @click="onStartBtnClick"
                type="primary"
              >
                远程连接
              </el-button>
            </template>
          </el-input></el-col
        >
      </el-row>
    </div>
    <video src="" id="remote-video" v-show="status === 1"></video>
    <el-button v-if="false" @click="onOutBtnClick" type="primary"> 退出控制 </el-button>
  </div>
</template>

<script setup>
defineOptions({
  name: 'RemoteControl'
})

const remoteCode = ref('')
const localCode = ref('')

const status = ref(0) // 0 待机  1 控制中

import { useUserStore } from '@/store/user'
import { useMedia, usePeer } from './utils'

const { userInfo } = useUserStore()
const { onloadeddata } = useMedia()
const { socket, pc, dc, initSignalServer, startLink } = usePeer()

localCode.value = userInfo.account
// console.log('userInfo:', userInfo)

onMounted(() => {
  if (!window.QueBridge) {
    ElMessage({ message: '请在客户端APP中打开', type: 'warning' })
  }

  onloadeddata()

  // TODO 测试 使用id 来做唯一表示
  initSignalServer(userInfo.account)
})

onUnmounted(() => {
  //   if (window.QueBridge) {
  //     QueBridge.removeMsgEvt('control-state-change', handleControlState)
  //   }
})

function onOutBtnClick() {}

function onStartBtnClick() {
  if (!window.QueBridge) {
    ElMessage({ message: '请在客户端APP中打开', type: 'warning' })
    return
  }
  console.log('点击开始控制')
  status.value = 1
  const data = {
    from: {
      id: userInfo.account
      //   name: userInfo.account
    },
    to: {
      id: remoteCode.value
    }
  }
  startLink(data)
}
function onCopyBtnClick() {}
</script>

<style lang="scss" scoped>
.page-wrapper {
  margin: 0;
  position: relative;
}
.control-wrapper {
  margin: 0 auto;
  margin-top: 60px;
  width: 40%;
}
#remote-video {
  width: 100%;
  height: 100vh;
  object-fit: fill;
  /* border: 1px solid red; */
  /* 水平翻转 */
  /* transform: scaleX(-1); */
}
</style>
