import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Tabs } from 'antd'

import TabList from './tab-list'

const { TabPane } = Tabs

const DeliveryOrderManagement = ()=> {
  return (
    <PageContainer
      title={false}
    >
      <Tabs
        defaultActiveKey="1"
        style={{
          background: '#fff',
          padding: 25
        }}
      >
        <TabPane key="1" tab={"待发货"}>
          <TabList status={1}/>
        </TabPane>
        <TabPane key="2" tab={"待收货"}>
          <TabList status={2}/>
        </TabPane>
        <TabPane key="3" tab={"待配送"}>
          <TabList status={3}/>
        </TabPane>
        <TabPane key="4" tab={"配送中"}>
          <TabList status={4}/>
        </TabPane>
        <TabPane key="5" tab={"已完成"}>
          <TabList status={5}/>
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}

export default DeliveryOrderManagement