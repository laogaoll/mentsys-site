var fs = require('fs')
var dayjs = require('dayjs')
var xlsx = require('node-xlsx')

module.exports = (list, titleList, keyList) => {
  let data = []
  data.push(titleList)
  list.map(o => {
    let item = []
    keyList.forEach(p => item.push(o[p]))
    data.push(item)
  })
  // let sheetOptions = {'!cols': [{wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}]};
  let sheetOptions = { "!cols": [] }
  // 根据 title 数组的长度生成对应数量的 {wch: 20}
  for (let i = 0; i < titleList.length; i++) {
    sheetOptions['!cols'].push({ wch: 20 });
  }
  let buffer = xlsx.build([{ name: 'grade', data: data }], { sheetOptions });

  let file = `export/${dayjs().format('YYYYMMDDhhmmss')}.xlsx`
  fs.writeFileSync(file, buffer, { 'flag': 'w' })

  return file
}