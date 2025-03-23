<template>
  <div class="login-container">
    <h1 class="sys-title">
      <CyTypeIt strings="DEMO-WEB" :cursor="false" :speed="120" />
    </h1>
    <div class="login-content">
      <LoginPwd v-if="currentLogin === 'pwd'"></LoginPwd>
      <!-- <LoginPhone v-else-if="currentLogin === 'phone'"></LoginPhone> -->
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'Login'
})
import CyTypeIt from '@/components/CyTypeit'
import LoginPwd from './components/pwd.vue'
// import LoginPhone from './components/phone.vue'
// import LoginRegist from "./components/LoginRegist.vue";
// import LoginUpdate from "./components/LoginUpdate.vue";
// import LoginQrCode from "./components/LoginQrCode.vue";

const currentLogin = ref('pwd')
</script>
<style lang="scss" scoped>
:deep(.el-form-item__error) {
  left: 46px;
}
.login-container {
  width: 100vw;
  height: 100vh;
  background: url(./imgs/login-bg.png) no-repeat;
  background-size: 100% 100%;
}
.sys-title {
  width: 100%;
  font-size: 44px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  color: #7dfcfe;
  height: 94px;
  line-height: 94px;
  text-align: center;
}
.login-content {
  margin-top: 10%;
  display: flex;
  justify-content: center;
}
</style>
