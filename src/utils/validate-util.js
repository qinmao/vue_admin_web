/**
 * 是否首字母小写
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}
/**
 * 是否符合密码的格式
 * 6-18位数字、字母、符号的任意两种组合
 * @param {string} pwd 
 * @returns {Boolean}
 */
export function validPassword(pwd){
    const reg=/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;
    return reg.test(pwd)
}

/**
 * 是否首字母大写
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}
/**
 * 是否email格式
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * 是否是手机号格式
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
  const reg = /^[1][0-9][0-9]{9}$/
  return reg.test(phone)
}

/**
 * 是否是IMSI格式
 * @param {string} imsi
 * @returns {Boolean}
 */
export function validImsi(imsi) {
  const reg = /^460[0,1,2,3,5,6,7,9]{2}\d{10}$/
  return reg.test(imsi)
}
/**
 * 是否是mac格式
 * @param {string} mac
 * @returns {Boolean}
 */
export function validMac(mac) {
  const reg = /(([a-f0-9]{2}:)|([a-f0-9]{2}-)){5}[a-f0-9]{2}/gi
  return reg.test(mac)
}

/**
 * 是否是身份证格式 只支持18位，15位需要转18
 * @param {string} idCard
 * @returns {Boolean}
 */
export function validIdCard(idCard) {
  const reg =
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  return reg.test(idCard)
}
/**
 * 是否是中文格式
 * @param {string} name
 * @returns {Boolean}
 */
export function validName(name) {
  const reg = /^[\u4e00-\u9fa5]{1,5}$/
  return reg.test(name)
}
/**
 * 是否是车牌格式(包括新能源)
 * @param {string} plateP
 * @returns {Boolean}
 */
export function validPlate(plate) {
  const reg =
    /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]{1})$/
  return reg.test(plate)
}
