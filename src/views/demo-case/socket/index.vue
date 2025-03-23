<template></template>

<script setup>
import { io } from 'socket.io-client'

function initSignalServer() {
  const socket = io()
  socket.on('connect', async function () {
    console.log('信令通道创建成功！')

    socket.emit('events', 'hello world', (response1) => {
      console.log('response1:', response1)
    })

    // 请求回调的方式， 使用 Promise
    try {
      const params = 'hello world'
      const response2 = await socket.timeout(5000).emitWithAck('events', params)
      console.log('response2:', response2)
    } catch (e) {
      // the server did not acknowledge the event in the given delay
      console.log('请求异常:', e)
    }

    // 客户端：相关发消息方式
    // 1. 给本次连接发消息
    //   可以发送任意数量的参数，并且支持所有可序列化的数据结构，包括二进制对象
    // socket.emit('hello', 1, '2', { 3: '4', 5: Uint8Array.from([6]) });
    //   socket.emit('chat message', 'hello world')

    // 2. 某个房间内所有人发消息

    // 3. 除本连接外，给某个房间内所有人发消息

    // 4. 本连接外，给所有人发消息
  })

  socket.on('disconnect', function () {
    console.log('信令通道连接中断')
  })
}
onMounted(() => {
  initSignalServer()
})
</script>

<style lang="scss" scoped></style>
