import { read, utils, writeFile } from 'xlsx'

/**
 * 在浏览器器端解析excel文件成table Html
 * @param {File} file
 * @returns
 */
export function parseExcelToHtml(arrayBuffer) {
  // 解析工作簿
  const workbook = read(arrayBuffer)
  /* get first worksheet */
  const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
  /* generate and display HTML */
  const tableHtml = utils.sheet_to_html(firstWorksheet)
  return tableHtml
}

/**
 * 在浏览器器端解析 excel 文件成json格式数据
 * @param {File} file arrayBuffer
 * @returns
 */
export function parseExcelToJson(file) {
  // 解析工作簿
  const workbook = read(file)
  const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
  // 提取数据
  const raw_data = utils.sheet_to_json(firstWorksheet, { header: 1 })
  return transformOut(raw_data)
  //   return new Promise((resolve) => {
  //     const reader = new FileReader()
  //     reader.onload = function (e) {
  //       const data = e.target.result
  //     }
  //     reader.readAsArrayBuffer(file)
  //   })
}

/**
 * 转换sheetData数组成对象数组
 * @param {*} sheetData 生成工作表的数据 [['序号','名字',],[1,'qinmao']]
 * @returns [{'序号':1,'名字':'qinmao'}]
 */
function transformOut(sheetData) {
  const keys = sheetData.shift()
  const arr = sheetData.map((item) => {
    const obj = {}
    item.forEach((cItem, cIndex) => {
      const key = keys[cIndex]
      const val = cItem
      obj[key] = val
    })
    return obj
  })
  return arr
}

/**
 * 将 json 数据导出 excel 文件
 * @param {Array} jsonData [{'序号':1,'名字':'qinmao'}]
 * @param {string} fileName 生成表格文件的名字 demo.xlsx
 */
export function exportJsonToExcel(jsonData, fileName) {
  // 生成一个工作表
  const worksheet = utils.json_to_sheet(jsonData)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 在浏览器中，它会尝试提示用户下载文件。 在 NodeJS 中，它将写入本地目录。
  writeFile(workbook, fileName, { compression: true })
}

/**
 * 将 table dom 导出成excel 文件
 * @param {*} dom
 * @param {string} fileName 生成表格文件的名字 demo.xlsx
 */
export function exportHtmlToExcel(tableElement, fileName) {
  // 生成一个工作簿
  const workbook = utils.table_to_book(tableElement)
  // 在浏览器中，它会尝试提示用户下载文件。 在 NodeJS 中，它将写入本地目录。
  writeFile(workbook, fileName, { compression: true })
}
