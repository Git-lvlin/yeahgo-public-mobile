import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Button } from 'antd'

import { amountTransform } from '@/utils/utils'
import { storeShareCommission } from '@/services/earning-report/earning-report'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'
import Detail from "./detail"


const CommunityStoreSharePerformanceSheet = () => {
  const [visit, setVisit] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [storeNo, setStoreNo] = useState()
  const [storeName, setStoreName] = useState()

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center',
      render: (_, records) => <a onClick={() => {setDetailVisible(true); setStoreNo(records?.storeNo); setStoreName(_)}}>{_}</a>
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
        rowKey="storeName"
        columns={columns}
        request={storeShareCommission}
        pagination={{
          pageSize: 10,
          showQuickJumper: true
        }}
        options={false}
        search={{
          optionRender: ({searchText, resetText}, {form}) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit()
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields()
                form?.submit()
              }}
            >
              {resetText}
            </Button>,
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="financial-operation-storeShare-commission-export"
              conditions={() => ({
                operationId: localStorage.getItem('operationId'),
                ...form?.getFieldValue()
              })}
            />,
            <ExportHistory
              key="exportHistory"
              show={visit}
              setShow={setVisit}
              type="financial-operation-storeShare-commission-export"
            />
          ],
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

export default CommunityStoreSharePerformanceSheet
