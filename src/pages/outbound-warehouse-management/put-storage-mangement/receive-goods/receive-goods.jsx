import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Tabs } from 'antd'

import TabList from './tab-list'

const { TabPane } = Tabs

const ReceiveGoods = () => {
  return (
    <PageContainer title={false}>
      <Tabs
        defaultActiveKey="1"
        style={{
          background: '#fff',
          padding: 25
        }}
      >
        <TabPane key="1" tab={"全部"}>
          <TabList status={0} />
        </TabPane>
        <TabPane key="4" tab={"待发货"}>
          <TabList status={3} />
        </TabPane>
        <TabPane key="2" tab={"待收货"}>
          <TabList status={1} />
        </TabPane>
        <TabPane key="3" tab={"已完成"}>
          <TabList status={2} />
        </TabPane>
        <TabPane key="5" tab={"已关闭"}>
          <TabList status={4} />
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}

export default ReceiveGoods
