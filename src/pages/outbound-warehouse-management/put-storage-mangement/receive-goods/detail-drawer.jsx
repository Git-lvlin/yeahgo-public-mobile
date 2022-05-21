import React, { 
  useState, 
  useEffect, 
  useRef 
} from 'react'
import {
  Timeline,
  Spin,
  Empty,
  message,
  Image,
  Space,
  Typography,
  Button,
  InputNumber,
  Tag,
  Row,
  Col
} from "antd"
import ProTable, { EditableProTable } from '@ant-design/pro-table'
import { DrawerForm, ModalForm } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'

import styles from './styles.less'
import { 
  orderStockDetail,
  purchaseInList,
  purchaseInAdd
} from '@/services/outbound-warehouse-management/put-storage-mangement'
import { expressInfo } from '@/services/delivery-order-management/delivery-order-management'
import { receive } from '@/services/delivery-order-management/delivery-order-management'

const { Item } = Timeline
const { Paragraph, Title } = Typography

export default ({ 
  visible,
  setVisible,
  poNo, 
  status, 
  change, 
  setChange,
  actionRef,
  isHide
}) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [goodsData, setGoodsData] = useState([])
  const [dynamic, setDynamic] = useState([])
  const [express, setExpress] = useState([])
  const formRef = useRef()
  const [editableKeys, setEditableKeys] = useState([])

  useEffect(()=> {
    setLoading(true)
    orderStockDetail({
      poNo
    }).then(res => {
      const obj = {
        ...res.data.sku,
        num: ''
      }
      setGoodsData([obj])
      setData(res.data)
      setEditableKeys([obj].map(item => item.skuId))
    }).finally(()=>{
      setLoading(false)
    })
    return ()=> {
      setData({})
      setGoodsData([])
    }
  }, [change])

  useEffect(()=> {
    purchaseInList({
      poNo
    }).then(res => {
      setDynamic(res.data)
    })
    return ()=> {
      setDynamic([])
    }
  },[change])

  const getExpress = (e) => {
    setLoading(true)
    expressInfo({
      shippingCode: e?.expressNo,
      expressType: e?.expressId,
      mobile: data?.order.supplierPhone,
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

  const expressLastStatus = lastStatus => {
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

  const showLastStatus = (lastStatus) => {
    if(lastStatus.length){
      return lastStatus?.map((item)=>(
        <Item key={item.piNo}>
          <Paragraph>
            <Title level={5}>入库</Title>
          </Paragraph>
          <div className={styles.dynamicTxt}>操作人：{item.operateName}</div>
          <div className={styles.dynamicTxt}>操作时间：{item.createTime}</div>
          <div className={styles.dynamicTxt}>入库数量：{item.realNum}</div>
        </Item>
      ))
    } else {
      return <Empty/>
    }
  }
  
  const columns = [
    {
      title: '商品编码',
      dataIndex: 'skuId',
      align: 'center',
      editable:false
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
      align: 'center',
      editable:false
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      width: 150,
      render: (_) => <div className={styles.goodsName}>{_}</div>,
      editable:false
    },
    {
      title: '规格',
      dataIndex: 'skuName',
      align: 'center',
      editable:false
    },
    {
      title: '商品总数',
      dataIndex: 'totalNum',
      align: 'center',
      editable:false,
      render: (_, r) => (
        <>
          <div>{_}</div>
          {
            r.lessNum > 0 &&
            <div>缺货总数：{r.lessNum}</div>
          }
        </>
      )
    },
    {
      title: '已入库数量',
      dataIndex: 'realNum',
      align: 'center',
      editable:false,
      hideInTable: isHide === 3
    },
    {
      title: '待入库数量',
      dataIndex: 'needInNum',
      align: 'center',
      editable:false
    },
    {
      title: '差异数量',
      dataIndex: 'diffNum',
      align: 'center',
      editable:false,
      hideInTable: status
    },
    {
      title: '入库数量',
      dataIndex: 'num',
      align: 'center',
      hideInTable: status,
      width: '15%',
      renderFormItem: () => (
        <InputNumber
          min="0"
          max={data?.sku?.diffNum}
        />
      ),
      render: (_) => <p>{_}</p>
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      editable:false
    }
  ]

  const expressTable = [
    {
      title: '包裹',
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
      dataIndex: 'expressTime',
      align: 'center'
    },
    {
      title: '操作',
      valueType: 'option',
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
              {expressLastStatus(express)}
            </Spin>
          </Timeline>
        </ModalForm>
      )
    },
  ]

  const getGoods = () => {
    const { username, id } = JSON.parse(localStorage.getItem('user'))
    if(!status) {
      purchaseInAdd({
        operationId: data?.order?.operationId,
        poNo,
        skuId: goodsData?.[0].skuId,
        num: goodsData?.[0].num,
        operatorInfo: {
          operatorType: 3,
          operatorId: id,
          operatorName: username
        }
      }).then(res => {
        if(res.success) {
          message.success('入库成功')
          setChange(change+1)
        }
        setVisible(false)
        actionRef?.current.reload()
      })
    } else {
      receive({poNo}).then(res=> {
        if(res.success) message.success('收货成功')
        setChange(change+1)
        setVisible(false)
        actionRef?.current.reload()
      })
    }
  }

  const DrawerTitle = () => {
    return (
      <>
        <span>{data?.order?.poNo}({data?.order?.statusGroupDisplay}) </span>
        {
          data?.sku?.lessNum > 0 &&
          <Tag color='#ff4d4f'>缺货</Tag>
        }
      </>
    )
  }

  return (
    <DrawerForm
      title={<DrawerTitle />}
      visible={visible}
      onVisibleChange={setVisible}
      formRef={formRef}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
      }}
      width={1000}
      submitter={{
        render: () => {
          if(data?.order?.statusGroupDisplay !== '已完成' && isHide !== 3 && data?.order?.statusGroupDisplay !== '待发货') {
            return (
              <Button type="primary" onClick={()=>{getGoods()}}>
                {
                  status? '确认收货':'确认入库'
                }
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
        {
          status&&
          <ProCard 
            title="动态"
            colSpan="30%"
            headerBordered
          >
            <Timeline>
              <Spin spinning={loading}>
                {showLastStatus(dynamic)}
              </Spin>
            </Timeline>
          </ProCard>
        }
        <ProCard title="单据信息" headerBordered wrap gutter={[12, 4]}>
          <ProCard colSpan={12}>来源单号：{data?.order?.poNo}</ProCard>
          <ProCard colSpan={12}>状态：{data?.order?.statusGroupDisplay}</ProCard>
          <ProCard colSpan={12}>创建时间：{data?.order?.createTime}</ProCard>
          <ProCard colSpan={12}>发货方：{data?.order?.supplierName}</ProCard>
          <ProCard colSpan={12}>发货方联系电话：{data?.order?.supplierPhone}</ProCard>
        </ProCard>
      </ProCard>
      <ProCard
        title="商品列表"
        bordered
        headerBordered
        style={{ marginTop: 20 }}
      >
        <EditableProTable
          name="table"
          rowKey="skuId"
          recordCreatorProps={false}
          columns={columns}
          bordered
          scroll={{x: 'max-content'}}
          search={false}
          toolBarRender={false}
          value={goodsData}
          pagination={false}
          editable={{
            editableKeys,
            onValuesChange: (_, records) => {
              setGoodsData(records)
            }
          }}
        />
      </ProCard>
      <ProCard
        title="物流信息"
        bordered
        headerBordered
        style={{ marginTop: 20 }}
      >
        <ProTable
          rowKey="expressNo"
          columns={expressTable}
          bordered
          search={false}
          toolBarRender={false}
          dataSource={data?.expressList}
          pagination={false}
        />
      </ProCard>

    </DrawerForm>
  )
}