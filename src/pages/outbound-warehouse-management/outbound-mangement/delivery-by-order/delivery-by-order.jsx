import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Tabs } from 'antd'

import TabList from './tab-list'

const { TabPane } = Tabs

const DeliveryByOrder = () => {
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
          <TabList statusGroup={0} />
        </TabPane>
        <TabPane key="2" tab={"待配送"}>
          <TabList statusGroup={1} />
        </TabPane>
        <TabPane key="3" tab={"配送中"}>
          <TabList statusGroup={2} />
        </TabPane>
        <TabPane key="4" tab={"已完成"}>
          <TabList statusGroup={3} />
        </TabPane>
        <TabPane key="5" tab={"已关闭"}>
          <TabList statusGroup={4} />
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}

export default DeliveryByOrder
