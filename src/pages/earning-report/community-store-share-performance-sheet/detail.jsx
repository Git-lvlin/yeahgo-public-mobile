import React, { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Drawer } from 'antd'

import { amountTransform } from '@/utils/utils'
import { storeShareCommissionItem } from '@/services/earning-report/earning-report'
import styles from './styles.less'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const Detail = ({id, visible, setVisible, storeName}) => {
  const [visit, setVisit] = useState(false)

  const columns = [
    {
      title: '订单日期',
      dataIndex: 'orderTime',
      align: 'center',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      width: "14%",
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: '订单总金额',
      dataIndex: 'orderAmount',
      align: 'center',
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '收益',
      dataIndex: 'commission',
      align: 'center',
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '结算状态',
      dataIndex: 'statusDesc',
      align: 'center'
    }
  ]

  return (
    <Drawer
      title='社区店分享业绩表'
      visible={visible}
      onClose={()=>{setVisible(false)}}
      width={1200}
    >
      <ProTable
        columns={columns}
        rowKey='orderNo'
        headerTitle={(
          <>
            <span>社区店名称：</span>
            <span className={styles.storeName}>{storeName}</span>
          </>
        )}
        search={false}
        request={storeShareCommissionItem}
        params={{storeNo: id}}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        postData={(v)=>{
          return v
        }}
        options={false}
        toolBarRender={
          () => [
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="financial-operation-storeShare-commission-item-export"
              conditions={{
                operationId: localStorage.getItem('operationId'),
                storeNo: id
              }}
            />,
            <ExportHistory
              key="exportHistory"
              show={visit}
              setShow={setVisit}
              type="financial-operation-storeShare-commission-item-export"
            />
          ]
        }
      />
    </Drawer>
  )
}

export default Detail
