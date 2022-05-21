import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'

import { amountTransform } from '@/utils/utils'
import { hydrogenCommission } from '@/services/earning-report/earning-report'
import Detail from "./detail"


const HydrogenIncomeSheet = () => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [storeNo, setStoreNo] = useState()
  const [storeName, setStoreName] = useState()

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'inviteStoreName',
      align: 'center',
      render: (_, records) => <a onClick={() => {setDetailVisible(true); setStoreNo(records?.inviterStoreNo); setStoreName(_)}}>{_}</a>
    },
    {
      title: '设备销售收益',
      dataIndex: 'sumBuyCommission',
      align: 'center',
      hideInSearch: true,
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '设备租金收益',
      dataIndex: 'sumRentCommission',
      align: 'center',
      hideInSearch: true,
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '总收益',
      dataIndex: 'sumRealAmount',
      align: 'center',
      hideInSearch: true,
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '已结算收益',
      dataIndex: 'sumUnfreezeAmount',
      align: 'center',
      hideInSearch: true,
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '待结算收益',
      dataIndex: 'sumFreezeAmount',
      align: 'center',
      hideInSearch: true,
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    }
  ]

  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="inviteStoreName"
        columns={columns}
        request={hydrogenCommission}
        options={false}
        pagination={{
          pageSize: 10,
          showQuickJumper: true
        }}
        search={{
          optionRender: (searchConfig, props, dom) => [
            ...dom.reverse()
          ]
        }}
      />
      {
        detailVisible&&
        <Detail
          visible={detailVisible}
          setVisible={setDetailVisible}
          storeName={storeName}
          id={storeNo}
        />
      }
    </PageContainer>
  )
}

export default HydrogenIncomeSheet
