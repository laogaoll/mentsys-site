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
import TechBasic from '@/component/TechBasic'
import TechDetail from '@/component/TechDetail'

import s from './index.module.less';
import person from '@/img/person.svg'


const SIZE = 15

// 过滤集合
const filterList = (r,str)=> r.filter((item,i)=>{
  if ((item.name.includes(str))||
      (item.uid.includes(str))||
      (item.field.includes(str))||
      (item.area.includes(str))||
      (item.email.includes(str))||
      (item.phone.includes(str))
      ) {
    return item
  }
})

const QueryT = () => {
  const { store } = React.useContext(MobXProviderContext)
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [data,setData]= useState([])
  const [dataFilt,setDataFilt] = useState([])
  const [dataPage,setDataPage]= useState([])
  const [page,setPage]= useState(1)
  const [key, setKey] = useState([])
  const [sel,setSel] = useState(0)

  const [projh,setProjh]= useState([])
  const [projr,setProjr]= useState([])
  const [docs ,setDocs] = useState([])
  const [listStud,setListStud] = useState([])

  const getPageList = (o,p) => o.filter((o,i)=> (i>=SIZE*(p-1))&&(i<=p*SIZE-1))

  useEffect(() => {
    if (!window.token) {
      navigate('/login')
    }else{
      store.loadMentList().then(r=>{
        setData(r.data)
        setDataFilt(r.data)
        setDataPage(getPageList(r.data,1))
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

  // 选择教师
  const doSelMent = async(i)=>{
    let params = { uid: dataPage[i].uid}
    let r = await store.mentDetailLoad(params)
    let s = await store.studListForMent(params)

    setSel(i)
    setProjh(r.projh)
    setProjr(r.projr)
    setDocs(r.docs)
    setListStud(s)
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

   // 导出数据按钮
   const doExport = async(e)=> {
    let path = await store.exportTechAndStud()
    window.open(`${API_SERVER}/${path}`)
    // window.open(`${API_SERVER}/img/tech/20050027.jpg`)
  }
  
  return (
    <div className={s.main}>
      <span className="g-tl">查看导师信息</span>

      <div className={s.menu}>
        <Button type="primary" onClick={doExport}>导出导师选择信息</Button>
        <Button type="primary">导出导师测评数据</Button>
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
              <img src={`${API_SERVER}/img/tech/${item.uid}.jpg`} />
              <span>{item.name}</span>
            </div>
          )}
          <Pagination defaultCurrent={1} pageSize={SIZE} total={dataFilt.length} onChange={(e)=>setPage(e)}/>
        </div>

        <div className={s.detail}>
          <section>
            <TechBasic user={dataPage[sel]} edit={false} />

            <TechDetail projh={projh} projr={projr} docs={docs} />
          </section>

          <br/>

          <section className={s.studlist}>
            {listStud.length>0 && <div className={s.sect}>指导学生</div>}

            {listStud.map((item,i)=>
              <div key={i} className={classnames(s.stud,{sel:sel===i}) } >
                {/*<img src={person} />*/}
                <img src={`${API_SERVER}/img/stud/${item.uid}.jpg`} />
                <span>{item.name}</span>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  )


}

export default  inject('store')(observer(QueryT))