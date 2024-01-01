import { observable, action, makeAutoObservable } from 'mobx'
import BaseActions from '@/component/BaseActions'
import { message } from 'antd'
import { toJS } from 'mobx'
import { isN } from '@/util/fn.js'
import { get, post } from '@/util/net.js'
import req from '@/util/request.js'
import { saveToken } from '@/util/token'
import * as urls from '@/constant/urls'


class Store {
  constructor() {
    makeAutoObservable(this);
  }
  // 可观察属性
  @observable user = null
  projr = []
  projh = []
  docs = []
  menu = []
  rpa = []
  his = []


   // 更新信息的方法
   @action
   setUser(area,desc,field) {
     this.user.des = desc
     this.user.area = area.split("|")
     this.user.field = field
   }



  // 获取用户信息
  setUserObj(o) {
    this.user = o

    if (o.role === 1) {
      let schedule = isN(o.schedule) ? [] : o.schedule.split('|')
      schedule.map((item, i) => { schedule[i] = item.split('&') })
      this.user.skill = isN(o.skill) ? [] : o.skill.split('|')
      this.user.cert = isN(o.cert) ? [] : o.cert.split('|')
      this.user.award = isN(o.award) ? [] : o.award.split('|')
      this.user.schedule = isN(o.schedule) ? [[], [], [], []] : schedule
    } else if (o.role === 0) {
      this.user.area = isN(o.area) ? [] : o.area.split('|')
    }

    // 设置可观察属性的值
    this.des = this.user.des || " "
    // console.log(toJS(this.user))
  }

  setUserVal(v, attr) {
    this.user[attr] = v
  }

  setUserSchedule(v, attr) {
    this.user.schedule[attr] = v
  }

  async post(url, params) {
    return await post(url, params)
  }

  async get(url, params) {
    return await get(url, params)
  }

  async login(url, params) {
    const r = await this.post(url, params)
    if (r.code === 200) {
      message.info('登录成功！')
      window.token = r.token
      this.setUserObj(r.data)
      return true
    } else {
      message.error(r.msg)
      return false
    }

  }

  async loadProj() {
    const r = await this.post(urls.API_LOAD_PROJ)
    return r
  }

  async menuLoad() {
    const r = await this.post(urls.API_MENU_LOAD)
    // console.log(r)
    this.menu = r.data
    return r
  }

  async loadMentList() {
    return await this.post(urls.API_MENT_LIST_LOAD)
  }

  async loadStudList() {
    return await this.post(urls.API_STUD_LIST_LOAD)
  }





  async mentDetailLoad(params) {
    const r = await this.post(urls.API_MENT_DETAIL_LOAD, params)
    if (r.code === 200) {
      console.log(r, 'rrr')
      return r
    } else {
      message.error('加载数据出错!')
    }
  }


  async studListForMent(params) {
    const r = await this.post(urls.API_STUD_LIST_FOR_MENT, params)
    if (r.code === 200) {
      return r
    } else {
      message.error('加载数据出错!')
    }
  }



  async clearMent(params) {
    const r = await this.post(urls.API_MENT_CLEAR, params)
    if (r.code === 200) {
      return r.data
    } else {
      message.error('加载数据出错!')
    }
  }


  async saveMark(params) {
    const r = await this.post(urls.API_MARK_SAVE, params)
    if (r.code === 200) {
      return r.data
    } else {
      message.error('加载数据出错!')
    }
  }

  async loadMark(params) {
    const r = await this.post(urls.API_MARK_LOAD, params)
    if (r.code === 200) {
      return r.data
    } else {
      message.error('加载数据出错!')
    }
  }


  async saveGuide(params) {
    const r = await this.post(urls.API_GUIDE_SAVE, params)
    if (r.code === 200) {
      return r.data
    } else {
      message.error('加载数据出错!')
    }
  }


  async guideHistory(params) {
    const r = await this.post(urls.API_GUIDE_HISTORY, params)
    if (r.code === 200) {
      return r.data
    } else {
      message.error('加载数据出错!')
    }
  }


  async guideConfirm(params) {
    const r = await this.post(urls.API_GUIDE_CONFIRM, params)
    if (r.code === 200) {
      return r.data
    } else {
      message.error('加载数据出错!')
    }
  }



  async exportStud(params) {
    const r = await this.post(urls.API_STUD_LIST_EXPORT, params)
    if (r.code === 200) {
      return r.path
    } else {
      message.error('加载数据出错!')
    }
  }

  // 导出学生选择导师情况
  async exportTechAndStud(params) {
    const r = await this.post(urls.API_STUDANDTECH_LIST_EXPORT, params)
    if (r.code === 200) {
      return r.path
    } else {
      message.error("加载数据出错")
    }
  }






}

export default new Store()