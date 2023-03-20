var fs = require('fs')
var dayjs = require('dayjs')
var xlsx = require('node-xlsx')

module.exports = (list,titleList,keyList)=>{
  let data = []
  data.push(titleList)
  list.map(o=>{
    let item = []
    keyList.forEach(p=> item.push(o[p]))
    data.push(item)
  })
  let sheetOptions = {'!cols': [{wch: 20}, {wch: 10}, {wch: 20}, {wch: 20}]};
  let buffer = xlsx.build([{name: 'grade', data: data}], {sheetOptions}); 

  let file = `export/studlist_${dayjs().format('YYYYMMDDhhmmss')}.xlsx`
  fs.writeFileSync(file, buffer, {'flag':'w'})

  return file
}