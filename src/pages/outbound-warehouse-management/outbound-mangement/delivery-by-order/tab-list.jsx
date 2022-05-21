import React, { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table'
import { Space, Image, Button, Tag } from 'antd'
import moment from 'moment'

import { storeOrderList } from '@/services/outbound-warehouse-management/outbound-mangement'
import DetailDrawer from './detail-drawer'
import DistributionSingle from './distribution-single'
import Delivery from './delivery'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const TableList = ({ statusGroup }) => {
  const [detail, setDetail] = useState(false)
  const [change, setChange] = useState(0)
  const [id, setId] = useState('')
  const [isDistribution, setDistribution] = useState(false)
  const [printOrder, setPrintOrder] = useState(false)
  const [orderIdList, setOrderIdList] = useState([])
  const [batchDelivery, setBatchDelivery] = useState(false)
  const [deliveryList, setDeliveryList] = useState([])
  const [visit, setVisit] = useState(false)
  const [page, setPage] = useState(0)
  
  const actionRef = useRef()
  const formRef = useRef()
  
  const selectChange = (e) => {
    setOrderIdList(e)
  }

  const objRowSelection = (statusGroup === 1 || statusGroup === 2) ? {
    rowSelection: {
      onChange: selectChange,
      selectedRowKeys: orderIdList,
      getCheckboxProps: (r) => ({disabled: (r.poStatus !== 3 && statusGroup === 1)})
    }
  } : {}

  const showDetail = (v, flag) => {
    setId(v)
    setDetail(true)
    setDistribution(flag)
  }

  const getFieldValue = () => {
    const { createTime, ...rest } = formRef.current.getFieldsValue()
    const operationId = window.localStorage.getItem('operationId')
    return {
      operationId,
      orderIds: orderIdList,
      createTimeBegin: createTime && parseInt(moment(createTime?.[0]).valueOf()/1000),
      createTimeEnd: createTime && parseInt(moment(createTime?.[1]).valueOf()/1000),
      ...rest
    }
  }

  const tagText = {
    0: '未退款',
    1: '部分退款',
    2: '全单退款'
  }

  const columns = [
    {
      title: '店主订单号',
      dataIndex: 'orderId',
      align: 'center',
      render: (_, r) => (
        <>
          <div>{_}</div>
          {
            r.refundStatus !== 0 &&
            <Tag color='#ff4d4f'>{tagText[r?.refundStatus]}</Tag>
          }
        </>
      )
    },
    {
      title: '关联采购单',
      dataIndex: 'poNo',
      align: 'center'
    },
    {
      title: '店铺编号',
      dataIndex: 'shopMemberAccount',
      align: 'center'
    },
    {
      title: '配送点',
      dataIndex: 'storeName',
      align: 'center'
    },
    {
      title: '配送商品',
      dataIndex: 'goodsName',
      hideInSearch: true,
      render: (_, records) => (
        <Space size="middle">
          <Image
            src={records.imageUrl}
            width={80}
            height={80}
          />
          <div>{_}</div>
        </Space>
      ),
      width: 300
    },
    {
      title: '配送数量',
      dataIndex: 'totalNum',
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
      title: '状态',
      dataIndex: 'statusGroupValue',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: '全部',
        1: '待配送',
        2: '配送中',
        3: '已完成',
        4: '已关闭'
      },
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
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
      title: '配送商品',
      dataIndex: 'goodsName',
      hideInTable: true,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, records) => {
        if(records.statusGroupDisplay === '待配送' && records.poStatus === 3) {
          return (
            <a onClick={()=>{showDetail(records?.orderId, true)}}>配送</a>
          )
        } else if(records.poStatus === 1){
          return (
            <a disabled>配送</a>
          )
        } else {
          return (
            <a onClick={()=>{showDetail(records?.orderId, false)}}>明细</a>
          )
        }
      }
    }
  ]

  return (
    <>
      <ProTable
        rowKey="orderId"
        actionRef={actionRef}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          total: page
        }}
        bordered
        columns={columns}
        formRef={formRef}
        options={false}
        params={{statusGroup}}
        request={storeOrderList}
        postData={(v)=>{
          setPage(v.total)
          setDeliveryList(v.records)
          return v.records
        }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            statusGroup === 1 && 
            <Button
              key="btn1" 
              type='primary'
              disabled={!orderIdList.length}
              onClick={()=>{setBatchDelivery(true)}}
            >
              批量配送
            </Button>,
            statusGroup === 2 &&
            <Button 
              key="btn2"
              type='primary'
              disabled={!deliveryList.length}
              onClick={()=>{setPrintOrder(true)}}
            >
              打印配送清单
            </Button>,
            statusGroup === 2 &&
            <Export
              key="3"
              change={(e) => { setVisit(e) }}
              type="good_delivery_d_export"
              conditions={getFieldValue}
              btnName='导出清单'
              disabled={!deliveryList.length}
            />,
            statusGroup === 2 &&
            <ExportHistory key="4" show={visit} setShow={setVisit} type="good_delivery_d_export" />,
            ...dom.reverse()
          ]
        }}
        {...objRowSelection}
      />
      {
       detail &&
       <DetailDrawer
          visible={detail}
          setVisible={setDetail}
          change={change}
          setChange={setChange}
          actionRef={actionRef}
          orderId={id}
          status={isDistribution}
       />
      }
      {
        printOrder&&
        <DistributionSingle
          isModalVisible={printOrder}
          setVisible={setPrintOrder}
          params={getFieldValue()}
        />
      }
      {
        batchDelivery&&
        <Delivery
          Visible={batchDelivery}
          setVisible={setBatchDelivery}
          orderId={orderIdList}
          change={actionRef}
          clearSelect={setOrderIdList}
        />
      }
    </>
  )
}

export default TableList
