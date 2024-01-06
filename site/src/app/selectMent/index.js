import React, { useState, useEffect,useCallback,useRef } from 'react';
import dayjs from 'dayjs'
import jwt from '@/util/token'
import { useNavigate } from 'react-router-dom'
import {isN} from '@/util/fn'
import { toJS } from 'mobx'
import { inject,observer,MobXProviderContext } from 'mobx-react'
import * as urls from '@/constant/urls'
import { API_SERVER } from '@/constant/apis'
import { Form, Input, Button, message,Select,notification,Modal } from 'antd'
import fileToBlob from '@/util/fileToBlob'
import UploadImg from '@/component/UploadImg'
import classnames from 'classnames';
import TechDetail from '@/component/TechDetail'

import s from './index.module.less';
import person from '@/img/person.svg'

const { FIELD_DESC } = urls


const EditS = () => {
  const { store } = React.useContext(MobXProviderContext)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [show,setShow] = useState(false)
  const [list,setList] = useState([])
  const [sel,setSel] = useState(0)
  const [projh,setProjh]= useState([])
  const [projr,setProjr]= useState([])
  const [docs ,setDocs] = useState([])

  const [confirm, setConfirm] = useState(false);
  const [change,  setChange] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const notify = (msg) => {
    api['warning']({
      message: '提示信息',
      description: msg,
    });
  };



  useEffect(() => {
    if (!window.token) {
      navigate('/login')
    }
  }, []);

  const doSelMent = async(i)=>{
    setSel(i)

    let params = { uid: list[i].uid}
    let r = await store.post(urls.API_MENT_DETAIL_LOAD, params)
    if (r.code === 200) {
      setProjh(r.projh)
      setProjr(r.projr)
      setDocs(r.docs)
    }
  }


  const doLoadMent =async()=>{
    let params = {
      field: store.user.field
    }
    let r = await store.post(urls.API_MENT_LOAD, params)
    if (r.code === 200) {
      setList(r.data)
      setShow(true)
      setProjh(r.projh)
      setProjr(r.projr)
      setDocs(r.docs)
    }
  }

  const doSaveMent =async()=>{
    let params = {
      mid: list[sel].uid
    }
    let r = await store.post(urls.API_MENT_SAVE, params)
    if (r.code === 200) {
      store.setUserObj(r.data)
    }else{
      notify(r.msg)
    }
    setConfirm(false)
  }


  const doSaveChg =async()=>{
    let params = {
      uid: store.user.uid
    }
    let r = await store.clearMent(params)
    console.log(r)
    store.user.mid = ''
    store.user.change = 0
    setChange(false)
  }




  const renderSelModal =()=>(
    <Modal title="警告信息" open={confirm} onOk={()=>doSaveMent()} onCancel={()=>setConfirm(false)}>
      <p>确认选择导师吗？</p>
      <p>选择之后无法更换，请慎重考虑！</p>
    </Modal>
  )

  const renderChgModal =()=>(
    <Modal title="警告信息" open={change} onOk={()=>doSaveChg()} onCancel={()=>setChange(false)}>
      <p>确认更换导师吗？</p>
      <p>更换导师只有一次机会，请慎重考虑！</p>
    </Modal>
  )


  const renderFieldDesc = (field,desc='')=>{
    FIELD_DESC.map((item,i)=> {
      if (item.name === field) {
        desc = item.desc
      }
    })
    return (
      <div className={s.field}  dangerouslySetInnerHTML={{__html: desc}} ></div>
    )
  }

  return (
  
    <div className={s.main}>

      {contextHolder}

      {renderSelModal()}

      {renderChgModal()}


      <span className="g-tl">选择学业导师</span>

      {!isN(store.user.mid) &&
      <div className={s.finish}>
        <span>您的学业导师</span>
        <div className={classnames(s.item,'sel') } >
          <img src={`${API_SERVER}/img/tech/${store.user.mid}.jpg`} />
          <span>{store.user.mname}</span>
        </div>

        {store.user.chance>0 &&
        <Button type="primary" danger onClick={()=>setChange(true)}> 重新选择导师</Button>}
      </div>}

      <div className={s.menu}>
        <Button type="primary" onClick={doLoadMent}>刷新导师列表</Button>
        <Button type="primary" onClick={()=>setConfirm(true)}>确定就业导师</Button>
      </div>

      {!show && 
      <div className={s.desc}>
        <p>{store.user?.field}</p>
        {renderFieldDesc(store.user?.field)}
        <div className={s.fun}>
          <Button type="primary" onClick={doLoadMent}>开始选择导师</Button>
        </div>
      </div>}

      {show && 
      <div className={s.ret}>
        <div className={s.list}>
          {list.map((item,i)=>
            <div key={i} className={classnames(s.item,{sel:sel===i}) } onClick={()=>doSelMent(i)}>
              <img src={`${API_SERVER}/img/tech/${item.uid}.jpg`} />
              <span>{item.name}</span>
            </div>
          )}
        </div>

        <div className={s.detail}>
          <div className={s.sect}>导师简介</div>
          <p className={s.desc}>{list[sel].des}</p>
          <TechDetail projh={projh} projr={projr} docs={docs} />
        </div>
      </div>}
    </div>
  )


}

export default observer(EditS)













