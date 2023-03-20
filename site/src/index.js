import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import { ConfigProvider } from 'antd'
import Loadable from '@/component/Loadable'
import zhCN from 'antd/es/locale/zh_CN'

import injects from '@/store'

import '@/less/var.less'
import '@/less/com.less'


configure({enforceActions: 'observed'})


let Login  = Loadable({ loader: () => import('./app/login') })
let Index  = Loadable({ loader: () => import('./app/index')})
let Layout = Loadable({ loader: () => import('./app/layout')})
let EditS  = Loadable({ loader: () => import('./app/editS')})
let EditT  = Loadable({ loader: () => import('./app/editT')})
let SelectMent = Loadable({ loader: () => import('./app/selectMent')})
let ListStud   = Loadable({ loader: () => import('./app/listStud')})
let QueryT     = Loadable({ loader: () => import('./app/queryT')})
let QueryS     = Loadable({ loader: () => import('./app/queryS')})
let EvalTech   = Loadable({ loader: () => import('./app/evalTech')})
let OrderMent  = Loadable({ loader: () => import('./app/orderMent')})
let ConfMent   = Loadable({ loader: () => import('./app/confMent')})
let EvalMent   = Loadable({ loader: () => import('./app/evalMent')})
let Config     = Loadable({ loader: () => import('./app/config')})



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider {...injects}>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route element={<Layout />}>
            <Route path="/"           element={<Index />} />
            <Route path="/editS"      element={<EditS />} />
            <Route path="/evalTech"   element={<EvalTech />} />
            <Route path="/selectMent" element={<SelectMent />} />
            <Route path="/confMent"   element={<ConfMent />} />
            

            <Route path="/editT"      element={<EditT />} />
            <Route path="/listStud"   element={<ListStud />} />
            <Route path="/orderMent"   element={<OrderMent />} />
            <Route path="/evalMent"   element={<EvalMent />} />
              

            <Route path="/queryT"     element={<QueryT />} />
            <Route path="/queryS"     element={<QueryS />} />
            <Route path="/config"     element={<Config />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);
