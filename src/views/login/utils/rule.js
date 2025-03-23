import { validPassword, validPhone } from '@/utils'

/** 6位数字验证码正则 */
export const REGEXP_SIX = /^\d{6}$/

/** 用户密码登录校验 */
const pwdRules = reactive({
  userName: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入账号'
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator(rule, value, callback) {
        if (!value) {
          callback(new Error('请输入密码'))
        } else if (!validPassword(value)) {
          callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'))
        } else {
          callback()
        }
      }
    }
  ],
  verifyCode: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入验证码'
    }
  ]
})

/** 手机登录校验 */
const phoneRules = reactive({
  phone: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!validPhone(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
    }
  ],
  verifyCode: [
    {
      trigger: 'blur',
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入短信验证码'))
        } else if (!REGEXP_SIX.test(value)) {
          callback(new Error('短信验证码格式错误'))
        } else {
          callback()
        }
      }
    }
  ]
})

/** 忘记密码校验 */
const updateRules = reactive({
  phone: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!validPhone(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
    }
  ],
  verifyCode: [
    {
      trigger: 'blur',
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入短信验证码'))
        } else if (!REGEXP_SIX.test(value)) {
          callback(new Error('短信验证码格式错误'))
        } else {
          callback()
        }
      }
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator(rule, value, callback) {
        if (!value) {
          callback(new Error('请输入密码'))
        } else if (!validPassword(value)) {
          callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'))
        } else {
          callback()
        }
      }
    }
  ]
})

export { pwdRules, phoneRules, updateRules }
