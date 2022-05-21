import React, { 
  useState, 
  useEffect
} from 'react'
import {
  Image,
  Space,
  Button,
  message,
  Tag
} from "antd"
import ProTable from '@ant-design/pro-table'
import { DrawerForm } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'

import styles from './styles.less'
import { storeOrderDetail, dispatchOutAdd } from '@/services/outbound-warehouse-management/outbound-mangement'

export default ({ 
  visible,
  setVisible,
  orderId, 
  change, 
  setChange,
  actionRef,
  status
}) => {
  const [data, setData] = useState({})
  const [goodsData, setGoodsData] = useState([])

  const confirmDelivery = () => {
    const { username, id } = JSON.parse(localStorage.getItem('user'))
    dispatchOutAdd({
      operationId: data?.order?.operationId,
      skuId: goodsData?.[0].skuId,
      orderId,
      operatorInfo: {
        operatorType: 3,
        operatorId: id,
        operatorName: username
      }
    }).then(res => {
      if(res.success) {
        message.success('出库成功')
        setChange(change+1)
      }
      actionRef?.current.reload()
      setVisible(false)
    })
  }

  useEffect(() => {
    storeOrderDetail({
      orderId
    }).then(res=> {
      setData(res.data)
      setGoodsData([res.data.sku])
    })
    return () => {
      setGoodsData([])
      setData({})
    }
  }, [])
  
  const columns = [
    {
      title: '商品编码',
      dataIndex: 'skuId',
      align: 'center'
    },
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      render: (_) => (
        <Image
          src={_}
          width={80}
          height={80}
        />
      ),
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      width: 150,
      render: (_) => <div className={styles.goodsName}>{_}</div>
    },
    {
      title: '商品规格',
      dataIndex: 'skuName',
      align: 'center'
    },
    {
      title: '订单数量',
      dataIndex: 'totalNum',
      align: 'center'
    },
    {
      title: '退款数量',
      dataIndex: 'returnNum',
      align: 'center'
    },
    {
      title: '配送数量',
      dataIndex: 'totalNum',
      align: 'center',
      render: (_, r) => _ - r.returnNum
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center'
    }
  ]

  const orderState = {
    0: ' ',
    1: <Tag color='#ff4d4f'>部分退款</Tag>,
    2: <Tag color='#ff4d4f'>全单退款</Tag>
  }

  const DrawerTitle = () => {
    return (
      <Space size='middle'>
        <span>{data?.order?.poNo}({data?.order?.statusGroupDisplay})</span>
        {
          orderState[data?.order?.refundStatus]
        }
      </Space>
    )
  }

  return (
    <DrawerForm
      title={<DrawerTitle />}
      visible={visible}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true
      }}
      width={1000}
      submitter={{
        render: () => {
          if(status) {
            return (
              <Button type="primary" onClick={()=>{confirmDelivery()}}>
                确认配送
              </Button>
            )
          } else {
            return false
          }
        }
      }}
    >
      <ProCard 
        split="vertical"
        bordered
      >
        <ProCard
          title="单据信息" 
          headerBordered
          wrap
          gutter={[32, 14]}
        >
          <ProCard colSpan={12}>
            <div>来源单号：{data?.order?.orderId}</div>
          </ProCard>
          <ProCard colSpan={12}>
            <div>关联采购单：{data?.order?.poNo}</div>
          </ProCard>
          <ProCard colSpan={12}>
            <div>状态：{data?.order?.statusGroupDisplay}</div>
          </ProCard>
          <ProCard colSpan={12}>
            <div>创建时间：{data?.order?.createTime}</div>
          </ProCard>
          <ProCard colSpan={12}>
            <div>配送点：{data?.order?.storeName}</div>
          </ProCard>
          <ProCard colSpan={12}>
            <div>配送点联系电话：{data?.order?.receiptPhone}</div>
          </ProCard>
          <ProCard colSpan={12}>
            <div>配送点地址：{data?.order?.receiptAddress}</div>
          </ProCard>
          <ProCard colSpan={12}>
            <div>配送收货码：{data?.order?.receiptCode}</div>
          </ProCard>
        </ProCard>
      </ProCard>
      <ProCard
        title="商品列表"
        bordered
        headerBordered
        style={{ marginTop: 20 }}
      >
        <ProTable
          rowKey="skuId"
          columns={columns}
          bordered
          search={false}
          toolBarRender={false}
          dataSource={goodsData}
          pagination={false}
        />
      </ProCard>
    </DrawerForm>
  )
}