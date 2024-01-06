import React, { useState, useEffect,useCallback,useRef } from 'react';
import dayjs from 'dayjs'
import jwt from '@/util/token'
import { useNavigate } from 'react-router-dom'
import {isN} from '@/util/fn'
import * as urls from '@/constant/urls'
import classnames from 'classnames';
import { inject,observer,MobXProviderContext } from 'mobx-react'
import { API_SERVER } from '@/constant/apis'
import { API_LOGIN,SKILL_OPT,AREA_OPT,FIELD_OPT,API_TECH_SAVE } from '@/constant/urls'
import { Form, Input, Button, message,Select, List, Pagination } from 'antd'

import StudBasic from '@/component/StudBasic'

import s from './index.module.less';
import person from '@/img/person.svg'


const SIZE = 15

// 过滤集合
const filterList = (r,str)=> r.filter((item,i)=>{
  // console.log(item)
  if ((item.name?.includes(str))||
      (item.uid?.includes(str))||
      (item.field?.includes(str))||
      (item.major?.includes(str))||
      (item.email?.includes(str))||
      (item.phone?.includes(str))
      ) {
    return item
  }
})

const QueryS = () => {
  const { store } = React.useContext(MobXProviderContext)
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [data,setData]= useState([])
  const [dataFilt,setDataFilt] = useState([])
  const [dataPage,setDataPage]= useState([])
  const [page,setPage]= useState(1)
  const [key, setKey] = useState([])
  const [sel,setSel] = useState(0)


  const getPageList = (o,p) => o.filter((o,i)=> (i>=SIZE*(p-1))&&(i<=p*SIZE-1))

  useEffect(() => {
    if (!window.token) {
      navigate('/login')
    }else{
      store.loadStudList().then(r=>{
        setData(r.data)
        setDataFilt(r.data)
        setDataPage(getPageList(r.data,1))

        // console.log(r.data)
      })
    }
  }, []);

  //  查询条件变化
  useEffect(() => {
    let list = data
    key.map((item,i)=>{
      list = filterList(data,item)
    })
    setDataFilt(list)
    setDataPage(getPageList(list,1))
    setPage(1)
    setSel(0)
  }, [key]);

  // 页面变化
  useEffect(() => {
    setDataPage(getPageList(dataFilt,page))
  }, [page]);

  // 选择学生
  const doSelMent = async(i)=>{
    setSel(i)
  }

  // 输入框数据变化
  const doChgKey=(e)=>{
    let list = data
    e.map((item,i)=>{
      list = filterList(list,item)
    })

    setDataFilt(list)
    setDataPage(getPageList(list,1))
    setPage(1)
    setSel(0)
    setKey(e)
  }

  const doExport=async(e)=>{
    let path = await store.exportStud()
    window.open(`${API_SERVER}/${path}`)
    console.log(path)
  }

  const doEvlExport = async(e) => {
    let path = await store.exportMark()
    window.open(`${API_SERVER}/${path}`)
    console.log(path)
  }
  return (
    <div className={s.main}>
      <span className="g-tl">查看学生信息</span>

      <div className={s.menu}>
        <Button type="primary" onClick={doExport}> 导出名单模板</Button>
        <Button type="primary" onClick={doEvlExport}> 导出评价导师信息</Button>
      </div>

      <div className={s.wrap}>
        <div className={s.list}>
          <div className={s.menu}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="请选择查询条件"
              onChange={doChgKey}
            />
          </div>
          {dataPage.map((item,i)=>
            <div key={i} className={classnames(s.item,{sel:sel===i}) } onClick={()=>doSelMent(i)}>
              <img src={`${API_SERVER}/img/stud/${item.uid}.jpg`} />
              <span>{item.name}</span>
            </div>
          )}
          <Pagination defaultCurrent={1} pageSize={SIZE} total={dataFilt.length} onChange={(e)=>setPage(e)}/>
        </div>

        <div className={s.detail}>
          <section>
            <StudBasic stud={dataPage[sel]} />
          </section>
        </div>
      </div>
    </div>
  )


}

export default  inject('store')(observer(QueryS))