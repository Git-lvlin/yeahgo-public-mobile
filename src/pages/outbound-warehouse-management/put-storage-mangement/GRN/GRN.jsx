import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Image } from 'antd'

import { purchaseInList } from '@/services/outbound-warehouse-management/put-storage-mangement'

const GRN = () => {

  const columns = [
    {
      title: '入库单号',
      dataIndex: 'piNo',
      align: 'center'
    },
    {
      title: '来源单号',
      dataIndex: 'poNo',
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
      width: 260
    },
    {
      title: '商品规格',
      dataIndex: 'skuName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '已入库数量',
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
      align: 'center',
      hideInSearch: true  
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateTimeRange',
      hideInTable: true
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
        rowKey="piNo"
        request={purchaseInList}
        params={{}}
        toolBarRender={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
      />
    </PageContainer>
  )  
}

export default GRN
