<template>
  <div class="alert">{{ msg }}</div>
</template>

<script setup>
const props = defineProps({
  msg: String
})
</script>

<style lang="scss" scoped>
.alert {
  width: 50vw;
  height: 50vh;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -50%);
  background-color: lightgrey;
}
</style>
