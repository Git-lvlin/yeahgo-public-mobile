import React, { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Drawer } from 'antd'

import { amountTransform } from '@/utils/utils'
import { performanceDetail } from '@/services/earning-report/earning-report'
import styles from './styles.less'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const Detail = ({id, visible, setVisible, storeName}) => {
  const [visit, setVisit] = useState(false)
  const [storeNo, setStoreNo] = useState('')

  const columns = [
    {
      title: '订单日期',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '采购单号',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '采购商品',
      dataIndex: 'goodsName',
      align: 'center',
      width: "14%",
      hideInSearch: true
    },
    {
      title: '采购数量',
      dataIndex: 'totalNums',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '采购金额',
      dataIndex: 'totalAmount',
      align: 'center',
      hideInSearch: true,
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '收益',
      dataIndex: 'commission',
      align: 'center',
      hideInSearch: true,
      render: (_, records) => (
        <>
          <div>佣金收益: {amountTransform((Number(_) - Number(records.deliveryFee)), '/')}</div>
          <div>配送费: {amountTransform(Number(records.deliveryFee), '/')}</div>
        </>
      )
    }
  ]

  return (
    <Drawer
      title='社区店采购业绩表'
      visible={visible}
      onClose={()=>{setVisible(false)}}
      width={1200}
    >
      <ProTable
        columns={columns}
        rowKey='id'
        headerTitle={(
          <>
            <span>社区店名称：</span>
            <span className={styles.storeName}>{storeName}</span>
          </>
        )}
        search={false}
        request={performanceDetail}
        params={{storeNo: id}}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        postData={(v)=>{
          setStoreNo(v?.[0].storeNo)
          return v
        }}
        options={false}
        toolBarRender={
          () => [
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="community-purchase-detail-export"
              conditions={() =>({
                operationId: localStorage.getItem('operationId'),
                storeNo: storeNo
              })}
            />,
            <ExportHistory
              key="exportHistory"
              show={visit}
              setShow={setVisit}
              type="community-purchase-detail-export"
            />
          ]
        }
      />
    </Drawer>
  )
}

export default Detail
