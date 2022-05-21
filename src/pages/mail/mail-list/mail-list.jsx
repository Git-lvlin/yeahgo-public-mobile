import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'

import { messageList } from '@/services/mail/mail-list'

const List = () => {
  const columns = [
    {
      title: '消息编号',
      dataIndex: 'msgId'
    },
    {
      title: '消息名称',
      dataIndex: 'name'
    },
    {
      title: '消息模板-标题',
      dataIndex: 'title'
    },
    {
      title: '消息模板-内容',
      dataIndex: 'copywritingContent',
      width: 600
    },
    {
      title: '接收时间',
      dataIndex: 'sendTime',
      valueType: 'dateTime'
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        columns={columns}
        request={messageList}
        rowKey="msgId"
        search={false}
        toolBarRender={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showQuickJumper: true
        }}
      />
    </PageContainer>
  )
}

export default List
