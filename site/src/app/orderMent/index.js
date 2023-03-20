<<<<<<< HEAD
import React, { useState, useEffect,useCallback,useRef } from 'react';
import dayjs from 'dayjs'
import jwt from '@/util/token'
import { useNavigate } from 'react-router-dom'
import {isN} from '@/util/fn'
import { toJS } from 'mobx'
import { inject,observer,MobXProviderContext } from 'mobx-react'
import * as urls from '@/constant/urls'
import { API_SERVER } from '@/constant/apis'
import { Form, Input, Button, Table, message,Select,notification,Modal,DatePicker,TimePicker } from 'antd'
import classnames from 'classnames';


import s from './index.module.less';


const opts = [{
  value: '教室1', label: '教室1'
},{
  value: '教室2', label: '教室2'
},{
  value: '教室3', label: '教室3'
}]

const columns = [
  {
    title: '指导日期',
    dataIndex: 'guide_date',
    key: 'guide_date',
  },{
    title: '指导时间',
    dataIndex: 'guide_time',
    key: 'guide_time',
  },{
    title: '指导地点',
    dataIndex: 'guide_addr',
    key: 'guide_addr',
  },{
    title: '指导学生',
    dataIndex: 'guide_studs',
    key: 'guide_studs',
  },
];


const formatStud = (list)=>{
  return list.map(item=>{
    item.guide_studs = JSON.parse(item.guide_studs).map(o=> o.name).join(' ')
  })
}

const OrderMent = () => {
  const { store } = React.useContext(MobXProviderContext)
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const [list,setList] = useState([])
  const [dataSource,setDataSource] = useState([])
  const [show,setShow] = useState(false)



  useEffect(() => {
    if (!window.token) {
      navigate('/login')
    }else{
      let params = { uid: store.user.uid }
      store.studListForMent(params).then(r=>{
        let {data,guide} = r //学生信息和预约指导信息
        data.map((item,i)=> item.sel = true)//在学生信息中添加标识确认是否被选中
        setList(data)
        formatStud(guide)
        setDataSource(guide)
      })
    }
  }, []);


  const doSel =(i)=>{
    let newList = [...list]
    newList[i].sel = !newList[i].sel
    setList(newList)
  }



  const doSave=async(i)=>{
    try {
      
      const r = await form.validateFields()
      const _list = []
      list.map(o=>{
        const {uid,name,sel} = o
        if (sel) {
          _list.push({uid,name}) 
        }
      })

      let params = {
        uid: store.user.uid,
        guide_date: r.date.format('YYYY-MM-DD'),
        guide_time: r.time.format('HH:mm'),
        guide_addr: r.addr,
        guide_studs: JSON.stringify(_list),
      }

      let {data} = await store.post(urls.API_GUIDE_SAVE, params)

      message.info('保存信息成功！')
      formatStud(data)
      setDataSource(data)
      setShow(false)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  return (
  
    <div className={s.main}>
      <span className="g-tl">预约交流指导</span>

      <div className={s.menu}>
        <Button type="primary" onClick={()=>setShow(true)}>预约指导</Button>
      </div>

      <div className={s.ret}>
        <Table dataSource={dataSource} columns={columns} />
      </div>

      {show &&
      <div className={s.wrap}>    
        <Form form={form} className={s.frm} layout="vertical">
          <Form.Item 
            name="date" 
            label="指导日期"  
            initialValue= {dayjs()}
            rules={[{ required: true, message: '请选择指导日期'}]}
            >
            <DatePicker style={{width:'100%'}}/>
          </Form.Item>

          <Form.Item 
            name="time" 
            label="指导时间" 
            initialValue= {dayjs()}
            rules={[{ required: true, message: '请选择指导时间'}]}
            >
            <TimePicker style={{width:'100%'}} format='HH:mm' />
          </Form.Item>

          <Form.Item 
            name="addr" 
            label="指导地点" 
            initialValue= {opts[0].value}
            rules={[{ required: true, message: '请选择指导时间'}]}
            >
            <Select
              // mode="tags"
              style={{ width: '100%' }}
              options={opts}
              />
          </Form.Item>

          {list.length>0 &&
          <div className={s.list}>
            {list.map((item,i)=>
              <div key={i} className={classnames(s.item,{sel:list[i].sel}) } onClick={()=>doSel(i)}>
                <img src={`${API_SERVER}/img/stud/${item.uid}.jpg`} />
                <span>{item.name}</span>
              </div>
            )}
          </div>}

          {list.length==0 &&
           <div className={s.none}>暂无学生</div>
          }

          <div className={s.fun}>
            <Button type="default" size="large" block onClick={()=>setShow(false)}>取消</Button>
            <Button type="primary" size="large" block onClick={doSave}>保 存</Button>
          </div>
        </Form>
      </div>}
    </div>
  )


}

export default observer(OrderMent)













=======
import React, { useState, useEffect,useCallback,useRef } from 'react';import dayjs from 'dayjs'import jwt from '@/util/token'import { useNavigate } from 'react-router-dom'import {isN} from '@/util/fn'import { toJS } from 'mobx'import { inject,observer,MobXProviderContext } from 'mobx-react'import * as urls from '@/constant/urls'import { API_SERVER } from '@/constant/apis'import { Form, Input, Button, Table, message,Select,notification,Modal,DatePicker,TimePicker } from 'antd'import classnames from 'classnames';import s from './index.module.less';const opts = [{  value: '教室1', label: '教室1'},{  value: '教室2', label: '教室2'},{  value: '教室3', label: '教室3'}]const columns = [  {    title: '指导日期',    dataIndex: 'guide_date',    key: 'guide_date',  },{    title: '指导时间',    dataIndex: 'guide_time',    key: 'guide_time',  },{    title: '指导地点',    dataIndex: 'guide_addr',    key: 'guide_addr',  },{    title: '指导学生',    dataIndex: 'guide_studs',    key: 'guide_studs',  },];const formatStud = (list)=>{  return list.map(item=>{    item.guide_studs = JSON.parse(item.guide_studs).map(o=> o.name).join(' ')  })}const OrderMent = () => {  const { store } = React.useContext(MobXProviderContext)  const [form] = Form.useForm()  const navigate = useNavigate();  const [list,setList] = useState([])  const [dataSource,setDataSource] = useState([])  const [show,setShow] = useState(false)  useEffect(() => {    if (!window.token) {      navigate('/login')    }else{      let params = { uid: store.user.uid }      store.studListForMent(params).then(r=>{                let {data,guide} = r        data.map((item,i)=> item.sel = true)        setList(data)        formatStud(guide)        setDataSource(guide)      })    }  }, []);  const doSel =(i)=>{    let newList = [...list]    newList[i].sel = !newList[i].sel    setList(newList)  }  const doSave=async(i)=>{    try {            const r = await form.validateFields()      const _list = []      list.map(o=>{        const {uid,name,sel} = o        if (sel) {          _list.push({uid,name})         }      })      let params = {        uid: store.user.uid,        guide_date: r.date.format('YYYY-MM-DD'),        guide_time: r.time.format('HH:mm'),        guide_addr: r.addr,        guide_studs: JSON.stringify(_list),      }      console.log(params)      let {data} = await store.post(urls.API_GUIDE_SAVE, params)      message.info('保存信息成功！')      formatStud(data)      setDataSource(data)      setShow(false)    } catch (errorInfo) {      console.log('Failed:', errorInfo);    }  }  return (      <div className={s.main}>      <span className="g-tl">预约交流指导</span>      <div className={s.menu}>        <Button type="primary" onClick={()=>setShow(true)}>预约指导</Button>      </div>      <div className={s.ret}>        <Table dataSource={dataSource} columns={columns} />      </div>      {show &&      <div className={s.wrap}>            <Form form={form} className={s.frm} layout="vertical">          <Form.Item             name="date"             label="指导日期"              initialValue= {dayjs()}            rules={[{ required: true, message: '请选择指导日期'}]}            >            <DatePicker style={{width:'100%'}}/>          </Form.Item>          <Form.Item             name="time"             label="指导时间"             initialValue= {dayjs()}            rules={[{ required: true, message: '请选择指导时间'}]}            >            <TimePicker style={{width:'100%'}} format='HH:mm' />          </Form.Item>          <Form.Item             name="addr"             label="指导地点"             initialValue= {opts[0].value}            rules={[{ required: true, message: '请选择指导时间'}]}            >            <Select              // mode="tags"              style={{ width: '100%' }}              options={opts}              />          </Form.Item>          {list.length>0 &&          <div className={s.list}>            {list.map((item,i)=>              <div key={i} className={classnames(s.item,{sel:list[i].sel}) } onClick={()=>doSel(i)}>                <img src={`${API_SERVER}/img/stud/${item.uid}.jpg`} />                <span>{item.name}</span>              </div>            )}          </div>}          {list.length==0 &&           <div className={s.none}>暂无学生</div>          }          <div className={s.fun}>            <Button type="default" size="large" block onClick={()=>setShow(false)}>取消</Button>            <Button type="primary" size="large" block onClick={doSave}>保 存</Button>          </div>        </Form>      </div>}    </div>  )}export default observer(OrderMent)
>>>>>>> fc72fee4990df39962b51807c8608c599a8c3e02
