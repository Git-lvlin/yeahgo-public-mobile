import React, { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table'
import { 
  Space,
  Popconfirm,
  message,
  Button
} from 'antd'
import { history } from 'umi'

import { 
  list, 
  dispatchOrder, 
  receive 
} from '@/services/delivery-order-management/delivery-order-management'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const TableList = ({status}) => {
  const ref = useRef()
  const formRef = useRef()
  const [visit, setVisit] = useState(false)

  const StateOption = ({type, poNo}) => {
    const [visible, setVisible] = useState(false)
    const [distribution, setDistribution] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [confirmLoad, setConfirmLoad] = useState(false)
  
    const skipToDetail = (id, type) => {
      history.push(`/delivery-order-management/delivery-order-management/${id}?type=${type}`)
    }
  
    const delivery = () => {
      setConfirmLoading(true)
      receive({poNo: poNo}).then(res=> {
        if(res.success) message.success('收货成功')
        setVisible(false)
        setConfirmLoading(false)
        ref.current.reload()
      })
    }
  
    const getGoods = () => {
      setConfirmLoad(true)
      dispatchOrder({poNo: poNo}).then(res=> {
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
      setVisible(false)
      setDistribution(false)
    }
  
    switch(type) {
      case 2:
        return (
          <Space size='middle'>
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
              <a onClick={showPopconfirm}>
                确认收货
              </a>
            </Popconfirm>
            <a onClick={()=>skipToDetail(poNo, type)}>详情</a>
          </Space>
        )
      case 3:
        return (
          <Space size='middle'>
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
              <a onClick={showConfirm}>
                确认配送
              </a>
            </Popconfirm>
            <a onClick={()=>skipToDetail(poNo, type)}>详情</a>
          </Space>
        )
      default:
        return (
          <a onClick={()=>skipToDetail(poNo, type)}>详情</a>
        )
    }
  }

  const getFieldValue = () => {
    const operatorId = JSON.parse(localStorage.getItem('user'))
    const operationId = JSON.parse(localStorage.getItem('operationId'))

    return {
      status,
      ...formRef.current.getFieldsValue(),
      operatorSource: '3',
      operatorName: operatorId.username,
      operatorId: operatorId.id,
      operationId
    }
  }

  const columns = [
    {
      title: '采购单号',
      dataIndex: 'poNo',
      align: 'center'
    },
    {
      title: '采购商品',
      dataIndex: 'goodsName',
      align: 'center'
    },
    {
      title: '待收货数量',
      dataIndex: 'totalNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        1: '待发货',
        2: '待收货',
        3: '待配送',
        4: '配送中',
        5: '已完成',
      },
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, records) => (
        <StateOption type={records?.status} poNo={records?.poNo}/>
      )
    }
  ]

  return (
    <ProTable
      rowKey="poNo"
      actionRef={ref}
      formRef={formRef}
      pagination={{
        showQuickJumper: true,
        pageSize: 10
      }}
      columns={ columns }
      options={ false }
      params={{status}}
      request={list}
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
            type="admin-intensive-delivery-order-export"
            conditions={() => getFieldValue()}
          />,
          <ExportHistory
            key="exportHistory" 
            show={visit}
            setShow={setVisit}
            type="admin-intensive-delivery-order-export"
          />
        ],
      }}
    />
  )
}

export default TableList