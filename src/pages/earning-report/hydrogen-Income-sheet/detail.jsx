import { useState, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Drawer } from 'antd'

import { amountTransform } from '@/utils/utils'
import { hydrogenCommissionItem, orderTypes } from '@/services/earning-report/earning-report'
import styles from './styles.less'

const Detail = ({id, visible, setVisible, storeName}) => {
  const [ orderType, setOrderType ] = useState(null)

  useEffect(() => {
    orderTypes({}).then(res=> {
      setOrderType(res.data)
    })
    return () => {
      setOrderType(null)
    }
  }, [])

  const columns = [
    {
      title: '订单日期',
      dataIndex: 'createTime',
      align: 'center'
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center'
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: orderType,
      align: 'center'
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      align: 'center',
      render: (_) => `￥${amountTransform(Number(_), '/')}`
    },
    {
      title: '收益',
      dataIndex: 'realAmount',
      align: 'center',
      hideInSearch: true,
      render: (_, records) => (
        <>
          {
            records.orderType === 'hydrogen'?
            <div>销售收益: ￥{amountTransform(Number(_), '/')}</div>:
            <div>租金收益: ￥{amountTransform(Number(_), '/')}</div>
          }
        </>
      )
    }
  ]

  return (
    <Drawer
      title='氢原子收益业绩表'
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
        request={hydrogenCommissionItem}
        params={{inviteStoreNo: id}}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        options={false}
      />
    </Drawer>
  )
}

export default Detail
