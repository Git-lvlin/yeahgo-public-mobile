import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { useParams, history } from 'umi'
import ProTable from '@ant-design/pro-table'
import { 
  Typography,
  Divider,
  Space, 
  Image,
  Timeline,
  Button,
  Popconfirm,
  message,
  Spin
} from 'antd'
import{ ModalForm } from '@ant-design/pro-form'

import { 
  detail, 
  expressInfo, 
  receive, 
  dispatchOrder 
} from '@/services/delivery-order-management/delivery-order-management'
import styles from './styles.less'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const { Title, Paragraph, Text } = Typography
const { Item } = Timeline

const goBack = () => {
  history.goBack()
}

const Detail = () => {
  const [visible, setVisible] = useState(false)
  const [distribution, setDistribution] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [confirmLoad, setConfirmLoad] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [express, setExpress] = useState([])
  const [change, setChange] = useState(1)
  const [visit, setVisit] = useState(false)
  const { id } = useParams()
  const dataSource = Array.isArray(data) ? data : [data]

  const showLastStatus = lastStatus => {
    if(lastStatus){
      return lastStatus?.deliveryList?.map((item)=>(
        <Item key={item.time}>
          <span className={styles.time}>{item.time}</span>
          {item.content}
        </Item>
      ))
    } else {
      return <Empty className={styles.empty}/>
    }
  }

  const CommunityStoreOption = () => {
    switch(data?.status) {
      case 3:
        return (
          <Popconfirm
            title={
              <div style={{textAlign: 'center'}}>
                <h3>操作确认</h3>
                <p>此操作将会提醒社区店，即将进行货品配送</p>
              </div>
            }
            visible={distribution}
            onConfirm={getGoods}
            okButtonProps={{ loading: confirmLoad }}
            onCancel={handleCancel}
            icon={false}
          >
            <Button type='primary' onClick={showConfirm}>
              确认配送
            </Button>
          </Popconfirm>
        )
      case 4:
        return(
          <Space size="small">
            <Export 
              change={(e)=> setVisit(e)}
              type="community-delivery-order-export"
              conditions={() => ({poNo: data?.poNo})}
            />
            <ExportHistory 
              show={visit}
              setShow={setVisit}
              type="community-delivery-order-export"
            />
          </Space>
        )
      default:
        return ''
    }
  }

  const CommunityStoreTitle = () => {
    if(data?.status === 2) {
      return '社区店采购订单列表'
    } else {
      return '社区店配送列表'
    }
  }

  const delivery = () => {
    setConfirmLoading(true)
    receive({poNo: data?.poNo}).then(res=> {
      if(res.success) message.success('收货成功')
      setVisible(false)
      setConfirmLoading(false)
      setChange(change+1)
    })
  }

  const getGoods = () => {
    setConfirmLoad(true)
    dispatchOrder({poNo: data?.poNo}).then(res=> {
      if(res.success) message.success('配送成功')
      setDistribution(false)
      setConfirmLoad(false)
      ref.current.reload()
    })
  }

  const showPopconfirm = () => {
    setVisible(true)
  }

  const showConfirm = () => {
    setDistribution(true)
  }

  const handleCancel = () => {
    setDistribution(false)
    setVisible(false)
  }

  useEffect(() => {
    detail({poNo: id}).then(res => {
      setData(res.data)
    })
    return () => {
      setData({})
    }
  }, [change])

  const state = (type) => {
    switch(type) {
      case 1:
        return '待发货'
      case 2:
        return '待收货'
      case 3:
        return '待配送'
      case 4:
        return '配送中'
      case 5:
        return '已完成'
    }
  }

  const getExpress = (e) => {
    setLoading(true)
    data.status === 2&&
    expressInfo({
      shippingCode: e?.expressNo,
      expressType: e?.expressId,
      mobile: data?.operationReceiptPhone,
      deliveryTime: e?.expressTime
    }).then(res => {
      setExpress(res.data)
    }).finally(()=>{
      setLoading(false)
    })
    return () => {
      setExpress([])
    }
  }

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'goodsInfo',
      align: 'center',
      width: '60%',
      render: (_, records) => (
        <div className={styles.goodsInfo}>
          <Image
            width={80}
            height={80}
            src={records?.goodsImageUrl}
          />
          <div className={styles.goodsContent}>
            <div>{records?.goodsName}</div>
            <div className={styles.skuName}>{records?.goodsSkuName}</div>
          </div>
        </div>
      )
    },
    {
      title: '采购数量',
      dataIndex: 'goodsSkuNums',
      align: 'center',
    }
  ]

  const orderList = [
    {
      title: '采购订单号',
      dataIndex: 'poNo',
      align: 'center'
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      align: 'center'
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center'
    },
    {
      title: '采购商品数量',
      dataIndex: 'totalNum',
      align: 'center'
    },
    {
      title: '收货码',
      dataIndex: 'receiptCode',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInTable: data?.status === 2 ? true : false
    }
  ]

  const logistics = [
    {
      title: '包裹',
      dataIndex: 'id',
      valueType: 'indexBorder'
    },
    {
      title: '物流公司',
      dataIndex: 'expressName',
      align: 'center'
    },
    {
      title: '物流单号',
      dataIndex: 'expressNo',
      align: 'center'
    },
    {
      title: '发货时间',
      dataIndex: 'createTime',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (_, records) => (
        <ModalForm
          title='快递消息'
          width={700}
          modalProps={{
            closable: true,
            destroyOnClose: true
          }}
          trigger={
            <a onClick={()=> {getExpress(records)}}>查看进度</a>
          }
          onFinish={()=> true}
        >
          <Timeline className={styles.timelineWarp}>
            <Spin spinning={loading}>
              {showLastStatus(express)}
            </Spin>
          </Timeline>
        </ModalForm>
      )
    }
  ]

  return (
    <PageContainer title={false}>
      <Typography>
        <Paragraph style={{background: '#fff', padding: 30}}>
          <Title level={4}>基本信息</Title>
          <Divider/>
          <Space size={100}>
            <Text>采购单号：{data?.poNo}</Text>
            <Text>创建时间：{data?.createTime}</Text>
            <Text>订单状态：{state(data?.status)}</Text>
          </Space>
        </Paragraph>
        <Paragraph style={{background: '#fff', padding: 30}}>
          <Title level={4}>商品信息</Title>
          <Divider/>
          <ProTable
            rowKey='goodsSkuNums'
            pagination={false}
            columns={columns}
            bordered
            options={false}
            search={false}
            dataSource={dataSource}
          />
        </Paragraph>
        <Paragraph style={{background: '#fff', padding: 30}}>
          <Title level={4} className={styles.communityStore}>
            <CommunityStoreTitle />
            <CommunityStoreOption />
          </Title>
          <Divider/>
          <ProTable
            rowKey='orderNo'
            pagination={false}
            columns={orderList}
            bordered
            options={false}
            search={false}
            dataSource={data?.purchaseOrderList}
          />
        </Paragraph>
        {
          data.status === 2&&
          <Paragraph style={{background: '#fff', padding: 30}}>
            <Title level={4}>物流信息</Title>
            <Divider/>
            <ProTable
              rowKey='expressNo'
              pagination={false}
              columns={logistics}
              bordered
              options={false}
              search={false}
              dataSource={data?.expressList}
            />
          </Paragraph>
        }
        <Space size='large'>
          {
            data.status === 2&&
            <Popconfirm
              title={
                <div style={{textAlign: 'center'}}>
                  <h3>确认收到货了吗？</h3>
                  <p>请收到商品检查无误后，再确认收货</p>
                </div>
              }
              visible={visible}
              onConfirm={delivery}
              okButtonProps={{ loading: confirmLoading }}
              onCancel={handleCancel}
              icon={false}
            >
              <Button type='primary' onClick={showPopconfirm}>
                确认收货
              </Button>
            </Popconfirm>
          }
          <Button type='primary' onClick={()=>goBack()}>返回</Button>
        </Space>
      </Typography>
    </PageContainer>
  )
}

export default Detail
