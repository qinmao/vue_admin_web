/**
 * 返回一个唯一的字符串
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 *格式化 MAC
 * 规则如下：
 * 1. mac 中字符为a-f0-9
 * 2. 小写字母转大写字母
 * 3. 每两个加 '-'
 * @param { name: str, type: String, desc: '待格式化的字符串' }
 * @param { name: conStr, type: String, default: '-', desc: '每两个字符以constr拼接'}
 */
export function macFormat(str, conStr = '-') {
  let mac = str.trim()
  mac = mac.replace(/[^a-f0-9]/gi, '')
  mac = mac.toUpperCase()
  if (mac.length <= 2) {
    return mac
  }

  mac = mac.substr(0, 12)
  let temp = []
  for (let i = 0; i < mac.length; i = i + 2) {
    temp.push(mac.substring(i, i + 2))
  }
  temp = temp.join(conStr)
  return temp
}
/**
 * 去除不可见字符
 * @param {String} string
 * @returns {string}
 */
export function trimStr(str) {
  return str && str.replace(/\s|\W/gi, '')
}

/**
 * 解析身份证号信息,年龄性别
 * @param {Number} idNum
 * @return {Object}
 */
export const parseIdNum = (idNum) => {
  idNum += ''
  // 获取出生日期
  const birthday =
    idNum.substring(6, 10) + '-' + idNum.substring(10, 12) + '-' + idNum.substring(12, 14)
  const gender = parseInt(idNum.substr(16, 1)) % 2 === 1 ? 1 : 0

  //获取年龄
  const myDate = new Date()
  const month = myDate.getMonth() + 1
  const day = myDate.getDate()
  let age = myDate.getFullYear() - idNum.substring(6, 10) - 1

  if (
    idNum.substring(10, 12) < month ||
    (idNum.substring(10, 12) == month && idNum.substring(12, 14) <= day)
  ) {
    age++
  }

  return {
    birthday,
    gender,
    age
  }
}
