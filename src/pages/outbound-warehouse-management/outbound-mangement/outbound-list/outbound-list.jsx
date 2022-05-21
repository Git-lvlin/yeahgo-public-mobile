import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Image } from 'antd'

import { dispatchOutList } from '@/services/outbound-warehouse-management/outbound-mangement'

const OutboundList = () => {

  const columns = [
    {
      title: '出库单号',
      dataIndex: 'doNo',
      align: 'center'
    },
    {
      title: '来源单号',
      dataIndex: 'orderId',
      align: 'center'
    },
    {
      title: '商品编码',
      dataIndex: 'skuId',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      hideInSearch: true,
      align: 'center',
      render: (_) => (
        <Image
          src={_}
          width={80}
          height={80}
        />
      )
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      with: 260
    },
    {
      title: '商品规格',
      dataIndex: 'skuName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '已出库数量',
      dataIndex: 'realNum',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
      align: 'center'
    },
    {
      title: '操作人',
      dataIndex: 'operateName',
      align: 'center',
      hideInSearch: true,
    }
  ]

  return (
    <PageContainer title={false}>
      <ProTable
        columns={columns}
        bordered
        rowKey="doNo"
        request={dispatchOutList}
        params={{}}
        toolBarRender={false}
        pagination={{
          showQuickJumper: true,
          hideOnSinglePage: true,
          pageSize: 10
        }}
      />
    </PageContainer>
  )  
}

export default OutboundList
