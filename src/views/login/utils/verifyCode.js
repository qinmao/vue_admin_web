const isDisabled = ref(false)
let timer
const text = ref('')
let time = 60 // 60s 到计时

export const useVerifyCode = () => {
  const startCode = async (formEl, props, sendFn) => {
    if (!formEl) return
    // 验证手机号
    await formEl.validateField(props, (isValid) => {
      if (isValid) {
        if (timer) {
          clearInterval(timer)
        }
        isDisabled.value = true
        text.value = `${time}`

        // 发送验证码接口
        sendFn && sendFn()

        timer = setInterval(() => {
          if (time > 0) {
            time -= 1
            text.value = `${time}`
          } else {
            text.value = ''
            isDisabled.value = false
            clearInterval(timer.value)
            time = 60
          }
        }, 1 * 1000)
      }
    })
  }

  const endCode = () => {
    text.value = ''
    isDisabled.value = false
    clearInterval(timer)
  }

  return {
    isDisabled,
    text,
    startCode,
    endCode
  }
}
