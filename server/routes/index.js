var fs = require('fs')
var path = require('path')
var axios = require('axios')
var dayjs = require('dayjs')
var dotenv = require('dotenv')
var express = require('express')
var jwt = require('jsonwebtoken')
var formidable = require('formidable')
var router = express.Router()
var db = require("../db/db")

var exportExcel = require("../utils/excel")

dotenv.config()

var root = path.resolve(__dirname,'../')
var clone =(e)=> {
  return JSON.parse(JSON.stringify(e))
}


const callSQLProc = (sql, params, res) => {
  return new Promise (resolve => {
    db.procedureSQL(sql,JSON.stringify(params),(err,ret)=>{
      if (err) {
        res.status(500).json({ code: -1, msg: '提交请求失败，请联系管理员！', data: null})
      }else{
        resolve(ret)
      }
    })
  })
}

const callP = async (sql, params, res) => {
  return  await callSQLProc(sql, params, res)
}

const auth =(req, res, next)=> {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, usr) => {
    // console.log(err)

    if (err) return res.sendStatus(403)
    
    req.usr = usr
    // console.log('usr',usr)
    next()
  })
}


const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const HZNU_DOMAIN = `https://uc.hznu.edu.cn:8080`
const appId       = `MSG73454309`
const appPassword = `MTJiZDE5M2U4YTI2N2NkN2U4MTQ3ZDYwMDhmOTYwYzA`
const URL_TOKEN   = `${HZNU_DOMAIN}/msg/getThirdAPIToken?appId=${appId}&appPassword=${appPassword}`
const URL_MSG     = `${HZNU_DOMAIN}/message/sendMessageApi`


/**
   * @swagger
   * /login:
   *   post:
   *     description: 用户登录请求
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               uid:
   *                 type: string
   *                 description: 用户学号或者工号
   *                 example: 20050027
   *               pwd:
   *                 type: string
   *                 description: 用户密码
   *                 example: 20050027
   *     responses:
   *       200:
   *         description: login
   */
router.post('/login',async (req, res, next) =>{
  let params = req.body
  // console.log('params',params)
  let sql = `CALL PROC_LOGIN(?)`
  let r = await callP(sql, params, res)

  // console.log(r)

  if (r.length > 0) {
    let ret = clone(r[0])
    let token = jwt.sign(ret, process.env.TOKEN_SECRET)
    res.status(200).json({code: 200, data: ret, token: token, msg: '登录成功'})
  } else {
    res.status(200).json({code: 301, data: null, msg: '用户名或密码错误'})
  }
})



router.post('/loadProj',auth, async (req, res, next) =>{
  let params = req.usr

  // console.log('params',params)
  let sql1 = `CALL PROC_PROG_H(?)`
  let sql2 = `CALL PROC_PROG_R(?)`
  let sql3 = `CALL PROC_DOCS(?)`
  let r = await callP(sql1, params, res)
  let s = await callP(sql2, params, res)
  let t = await callP(sql3, params, res)

  res.status(200).json({code: 200, projh: r, projr:s, docs: t })

})


/**
   * @swagger
   * /saveStudent:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     description: 保存学生的学业信息
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               skill:
   *                 type: string
   *                 description: 个人特长
   *                 example: 计算机|音乐
   *               cert:
   *                 type: string
   *                 description: 获得证书
   *                 example: 英语四级证书
   *               award:
   *                 type: string
   *                 description: 获奖情况
   *                 example: ACM三等奖|多媒体三等奖
   *               schedule:
   *                 type: string
   *                 description: 学业规划
   *                 example: 学习专业课程|研究前端技术&跟老师做项目|开展社会实习$参加竞赛|找工作$考研究生
   *               img:
   *                 type: string
   *                 description: 个人头像
   *                 example: img/sys_20230114023846.jpeg
   *     responses:
   *       200:
   *         description: login
   */
router.post('/studSave', auth, async (req, res, next) =>{
  let { uid } = req.usr
  let params = { ...req.body, uid }
  
  let sql = `CALL PROC_STUD_SAVE(?)`
  let r = await callP(sql, params, res)

  res.status(200).json({code: 200, data: r[0] })
})




/**
   * @swagger
   * /techSave:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     description: 保存教师信息
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               area:
   *                 type: string
   *                 description: 研究领域
   *                 example: 计算机|音乐
   *               field:
   *                 type: string
   *                 description:  指导学生方向
   *                 example: 英语四级证书
   *     responses:
   *       200:
   *         description: login
   */
router.post('/techSave', auth, async (req, res, next) =>{
  let { uid } = req.usr
  let params = { ...req.body, uid }
  
  let sql = `CALL PROC_TECH_SAVE(?)`
  let r = await callP(sql, params, res)

  res.status(200).json({code: 200, data: r })
})


/**
   * @swagger
   * /menuUpdate:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     description: 更新菜单的有效周期
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: int
   *                 description:  菜单编号
   *                 example: 6
   *               fr:
   *                 type: string
   *                 description:  开始日期
   *                 example: 20230205101000
   *               to:
   *                 type: string
   *                 description:  结束日期
   *                 example: 20230205111000
   *     responses:
   *       200:
   *         description: 更新数据成功
   */
router.post('/menuUpdate', auth, async (req, res, next) =>{
  let params = req.body
  
  let sql = `CALL PROC_MENU_UPDATE(?)`
  let r = await callP(sql, params, res)

  res.status(200).json({code: 200, data: r })
})


/**
   * @swagger
   * /menuLoad:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     description: 加载菜单
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: 菜单数据列表
   */
router.post('/menuLoad', auth, async (req, res, next) =>{
  let { role } = req.usr
  let params = { ...req.body, role }
  
  let sql = `CALL PROC_MENU_LOAD(?)`
  let r = await callP(sql, params, res)

  res.status(200).json({code: 200, data: r })
})


const loadMentDetail =async(params,res)=>{
  let sql1 = `CALL PROC_PROG_H(?)`
  let sql2 = `CALL PROC_PROG_R(?)`
  let sql3 = `CALL PROC_DOCS(?)`
  let r = await callP(sql1, params, res)
  let s = await callP(sql2, params, res)
  let t = await callP(sql3, params, res)
  return {r,s,t}
}


router.post('/mentLoad', auth, async (req, res, next) =>{
  let params = req.body


  // console.log('params',params)
  let sql = `CALL PROC_MENT_LOAD(?)`
  let q = await callP(sql, params, res)

  let {r,s,t} = await loadMentDetail({ uid: q[0].uid },res)
  res.status(200).json({code: 200, data: q, projh:r, projr:s, docs:t })
})


router.post('/mentDetailLoad', auth, async (req, res, next) =>{
  let params = req.body

  let { r,s,t } = await loadMentDetail(params,res)
  res.status(200).json({code: 200, projh:r, projr:s, docs:t })
})


router.post('/mentSave', auth, async (req, res, next) =>{
  let params = {
    uid: req.usr.uid,
    mid: req.body.mid,
  }
  let sql = `CALL PROC_MENT_SAVE(?)`
  let r = await callP(sql, params, res)


  if (r !== undefined) {
    res.status(200).json({code: 200, data: r[0] })
  }else{
    res.status(200).json({code: 201, data: null, msg: '该导师已经选满，请刷新重试！' })
  }
})


router.post('/studListForMent', auth, async (req, res, next) =>{
  let params = req.body
  let sql1 = `CALL PROC_STUD_LIST_FOR_MENT(?)`
  let sql2 = `CALL PROC_GUIDE_LIST(?)`

  let r = await callP(sql1, params, res)
  let s = await callP(sql2, params, res)
  res.status(200).json({code: 200, data: r, guide: s })
})


router.post('/mentList', auth, async (req, res, next) =>{
  let params = {}
  let sql = `CALL PROC_MENT_LIST(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r })
})

router.post('/mentClear', auth, async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_MENT_CLEAR(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r })
})

router.post('/studListLoad', auth, async (req, res, next) =>{
  let params = {}
  let sql = `CALL PROC_STUD_LIST(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r })
})






router.post('/markSave', auth, async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_MARK_SAVE(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r[0] })
})


router.post('/markLoad', auth, async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_MARK_LOAD(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r[0] })
})


router.post('/guideSave', auth, async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_GUIDE_SAVE(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r })
})

router.post('/guideHistory', auth, async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_GUIDE_HISTORY(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r })
})

router.post('/guideConfirm', auth, async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_GUIDE_CONFIRM(?)`
  let r = await callP(sql, params, res)
  res.status(200).json({code: 200, data: r })
})






router.post('/studExport', async (req, res, next) =>{
  let params = req.body
  let sql = `CALL PROC_STUD_LIST(?)`
  let r = await callP(sql, params, res)

  let title = ['学号','姓名','专业','班级','第1年绩点','第1年排名','第2年绩点','第2年排名','第3年绩点','第3年排名']
  let key = ['uid','name','major','class']
  let path = exportExcel(r,title,key)

  res.status(200).json({code: 200, path: path})
})



router.post('/studImport', async (req, res, next) =>{
  // let params = req.body
  // let sql = `CALL PROC_STUD_LIST(?)`
  // let r = await callP(sql, params, res)

  
  res.status(200).json({code: 200, path: path})
})




router.post('/msg', async (req, res, next) =>{
  let { msgtitle,msgContent,list } =req.body
  let receivers = list.map(o=> ({"type":"User", "userId":o}) )

  let r = await axios({url:URL_TOKEN})
  let {token} = r.data.resultData

  const params = new URLSearchParams()
  params.append('msgtitle', msgtitle)
  params.append('msgContent', msgContent)
  params.append('receivers', JSON.stringify(receivers))
  params.append('token', token)
  params.append('msgType', 1)
  params.append('sendStatus', 1)
  params.append('sendChannel', 'IntelligenceMode')
  params.append('sendMode', 'normal')
  params.append('isReply', 1)

  let s = await axios.post(URL_MSG, params, config )

  if (s.data.rspCode==='000000') {
    res.status(200).json({code: 200, msg: '消息推送成功！' })
  }else{
    res.status(200).json({code: 201, msg: s.rspMsg })
  }
})

router.get('/msg', async (req, res, next) =>{
  const URL_TOKEN = 'https://uc.hznu.edu.cn:8080/msg/getThirdAPIToken?appId=MSG73454309&appPassword=MTJiZDE5M2U4YTI2N2NkN2U4MTQ3ZDYwMDhmOTYwYzA'
  const URL_MSG = 'https://uc.hznu.edu.cn:8080/message/sendMessageApi'


  let r = await axios({url:URL_TOKEN})
  let {token} = r.data.resultData
  
  let msgtitle = '测试接口消息'
  let msgContent = '正在测试定向发送 大家好 我是信息工程学院! 收到请回复 test ......'
  let list = ["20050027","20210192","2019211401012"]
  let receivers = list.map(o=> ({"type":"User", "userId":o}) )

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const params = new URLSearchParams()
  params.append('msgtitle', msgtitle)
  params.append('msgContent', msgContent)
  params.append('receivers', JSON.stringify(receivers))
  params.append('token', token)
  params.append('msgType', 1)
  params.append('sendStatus', 1)
  params.append('sendChannel', 'IntelligenceMode')
  params.append('sendMode', 'normal')
  params.append('isReply', 1)

  let s = await axios.post(URL_MSG, params, config )

  if (s.data.rspCode==='000000') {
    res.status(200).json({code: 200, msg: '消息推送成功！' })
  }else{
    res.status(200).json({code: 201, msg: s.rspMsg })
  }
})




// 上传文件
router.post('/upload', function (req, res) {
  const form = formidable({uploadDir: `${__dirname}/../img`});

  form.on('fileBegin', function (name, file) {
    file.filepath = `img/sys_${dayjs().format('YYYYMMDDhhmmss')}.jpeg`
  })
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({
      code: 200,
      msg: '上传照片成功',
      data: {path: files.file.filepath}
    })
  });
})





module.exports = router