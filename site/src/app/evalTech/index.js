import React, { useState, useEffect,useCallback,useRef } from 'react';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import {isN} from '@/util/fn'
import { toJS } from 'mobx'
import { inject,observer,MobXProviderContext } from 'mobx-react'
import * as urls from '@/constant/urls'
import { Form, Input, Button, message,Rate } from 'antd'

import s from './index.module.less';


const { FORM_LIST } = urls


const EvalTech = () => {
  const { store } = React.useContext(MobXProviderContext)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [edit,setEdit] = useState(true)
  const [ret,setRet] = useState([-1,-1,-1,-1,-1,-1,-1,-1,-1])
  const [mark,setMark] = useState(0)

  useEffect(() => {
    if (!window.token) {
      navigate('/login')
    }else{
      let params ={
        uid: store.user.uid,
      }
      store.loadMark(params).then(r=>{
        console.log(r)
        setMark(r.mark)
        setRet(JSON.parse(r.ret))
        setEdit(r.mark>0?false:true)
      })
    }
  }, []);


  const doSelMark =(i,j)=>{
    if (!edit) return;

    let sum = 0
    let newRet = [...ret]
    newRet[i] = j
    newRet.map((o,i)=>sum += (o>-1)?FORM_LIST[i].list[o].v:0 )

    setRet(newRet)
    setMark(sum)
  }


  const doSave =async()=>{
    let params ={
      uid: store.user.uid,
      mid: store.user.mid,
      mark,
      ret: JSON.stringify(ret)
    }
    
    let r = await store.saveMark(params)

    setMark(r.mark)
    setRet(JSON.parse(r.ret))
    setEdit(false)
  }


  return (
    <div className={s.main}>
      <span className="g-tl">评价导师</span>
      <div className={s.ret}>{mark}</div>
      <div className={s.frm}>
        {FORM_LIST.map((item,i)=>
          <div className={s.row} key={i}>
            <i>{i+1}</i>
            <label>{item.name}</label>
            <div className={s.sel}>
              {item.list.map((o,j)=>
                <span className={ret[i]===j?"act":""} onClick={()=>doSelMark(i,j)}>{o.m}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {edit && 
      <div className={s.fun}>
        <Button type="primary" onClick={doSave}> 提交评分结果</Button>
      </div>}
    </div>
  )


}

export default observer(EvalTech)



