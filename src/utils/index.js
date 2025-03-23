export function debounce(func, delay = 200) {
  // last为上一次触发回调的时间, timer是定时器
  let timerId
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function throttle(func, delay = 200) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      func.apply(this, args)
      lastTime = now
    }
  }
}

export { groupBy, keyValArrayToMulTable, equalDiviArray } from './array-util'
export { createUniqueString, macFormat, trimStr, parseIdNum } from './string-util'
export { deepClone } from './object-util'
export { commafy, getRandomNum } from './number-util'

export { scrollTo } from './html-util'
export { getUrlParams } from './url-util'
export { setStore, getStore, removeStore } from './store-util'

export {
  validPhone,
  validIdCard,
  validName,
  validPassword,
  validEmail,
  validImsi,
  validMac,
  validPlate
} from './validate-util'

export {
  findNodeById,
  appendFieldByUniqueId,
  buildTree,
  flatTree,
  getAllPathsFromTree
} from './tree-util'
