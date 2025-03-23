/**
 * 把一个对象数组，按对象中的属性分组
 * @param {Array} array
 * @param {String} prop
 * @returns {Object}
 */
export const groupBy = (array, prop) => {
  const groups = {}
  array.forEach((item) => {
    if (!groups[item[prop]]) {
      groups[item[prop]] = [item]
    } else {
      groups[item[prop]].push(item)
    }
  })
  return groups
}

/**
 * 为了尽可能的展示更多的数据
 * 把一个key val 对象数组，转成多列的表格数据结构
 * @param {Array} array
 * @param {String} groupCount 一行组的数量
 * @returns {Object} { list:[],propList:[]}
 */
export const keyValArrayToMulTable = (array, groupCount = 2) => {
  // 获取分组后的 propList
  let propList = []
  for (let index = 0; index < array.length; index++) {
    const item = array[index]
    if (index < groupCount) {
      Object.keys(item).forEach((key) => {
        const newKey = key + index
        propList.push(newKey)
      })
    } else {
      break
    }
  }

  // 分成 groupCount 组
  let groupList = []
  const len = array.length
  for (let index = 0; index < len; index += groupCount) {
    const item = array.slice(index, index + groupCount)
    groupList.push(item)
  }

  // 每组的字段转成 propItem 字段的值
  let list = []
  groupList.forEach((itemList) => {
    let rowItem = {}
    itemList.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        let prop = key + index
        rowItem[prop] = item[key]
      })
    })
    list.push(rowItem)
  })
  return { propList, list }
}

/**
 * 数据均分
 * @param {Array} list 原始数组
 * @param {Number} group 分配组的数量
 * @returns {Array} 返回分配后的数组
 */
export const equalDiviArray = (list, group) => {
  if (list && list.length === 0) {
    return []
  }
  let newList = []
  const total = list.length

  const groupItemCount = Math.floor(total / group)
  const rest = total % group

  let startIndex = 0
  for (let index = 0; index < group; index++) {
    const itemCount = groupItemCount + (index < rest ? 1 : 0)
    const item = list.slice(startIndex, startIndex + itemCount)
    startIndex += itemCount
    newList.push(item)
  }
  return newList
}