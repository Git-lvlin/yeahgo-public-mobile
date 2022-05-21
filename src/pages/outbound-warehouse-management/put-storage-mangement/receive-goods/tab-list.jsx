import React, { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table'
import { Space, Image, Button, Tag } from 'antd'
import moment from 'moment'
import { ModalForm } from '@ant-design/pro-form'

import { orderStockList, purchaseInMultiAdd, multiReceive } from '@/services/outbound-warehouse-management/put-storage-mangement'
import DetailDrawer from './detail-drawer'
import styles from './styles.less'
import DistributionSingle from './distribution-single'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const TableList = ({ status }) => {
  const [detail, setDetail] = useState(false)
  const [data, setData] = useState('')
  const [dataItem, setDataItem] = useState([])
  const [dynamic, setDynamic] = useState('')
  const [change, setChange] = useState(0)
  const [orderIdList, setOrderIdList] = useState([])
  const [visit, setVisit] = useState(false)
  const [printOrder, setPrintOrder] = useState(false)
  const [page, setPage] = useState(0)
  const [modalVisit, setModalVisit] = useState(false)

  const actionRef = useRef()
  const formRef = useRef()

  const showDetail = (v, isDynamic) => {
    setData(v)
    setDetail(true)
    setDynamic(isDynamic)
  }

  const SelectChange = (e) => {
    setOrderIdList(e)
  }

  const objRowSelection = status === 1 ? {
    rowSelection: {
      onChange: SelectChange,
      selectedRowKeys: orderIdList
    }
  } : {}

  const getFieldValue = () => {
    const { createTime, ...rest } = formRef.current?.getFieldsValue()
    const operationId = window.localStorage.getItem('operationId')
    return {
      operationId,
      poNos: orderIdList,
      createTimeBegin: createTime && parseInt(moment(createTime?.[0]).valueOf()/1000),
      createTimeEnd: createTime && parseInt(moment(createTime?.[1]).valueOf()/1000),
      ...rest
    }
  }

  const columns = [
    {
      title: '来源单号',
      dataIndex: 'poNo',
      align: 'center',
      render: (_, r)=> (
        <>
          <div>{_}</div>
          {
            r.lessNum > 0 &&
            <Tag color='#ff4d4f'>缺货</Tag>
          }
        </>
      )
    },
    {
      title: '发货方',
      dataIndex: 'supplierName',
      align: 'center'
    },
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      align: 'center',
      hideInSearch: true,
      render: (_) => {
        return (
          <Image
            src={_}
            width={80}
            height={80}
          />
        )
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',  
      hideInSearch: true,
      width: 260,
      render: (_) => <div className={styles.goodsName}>{_}</div>
    },
    {
      title: '商品总数',
      dataIndex: 'totalNum',
      align: 'center',
      hideInSearch: true,
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
      title: '待入库数量',
      dataIndex: 'needInNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '已入库数量',
      dataIndex: 'realNum',
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
      dataIndex: 'statusGroupDisplay',
      align: 'center',
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, records) => (
        <Space size='middle'>
          {
            (records.statusGroupDisplay !== '已完成' && records.diffNum !== 0 && records.statusGroupValue !== 3)&&
            <a onClick={() => { showDetail(records.poNo, false) }}>入库</a>
          }
          <a onClick={() => { showDetail(records.poNo, true) }}>明细</a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable
        rowKey="poNo"
        actionRef={actionRef}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          total: page
        }}
        bordered
        formRef={formRef}
        columns={columns}
        options={false}
        params={{statusGroup: status}}
        request={orderStockList}
        postData= {(v)=> {
          setPage(v.total)
          setDataItem(v.records)
          return v.records
        }}
        search={{
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            status === 1 &&
            <Export
              key="3"
              change={(e) => { setVisit(e) }}
              type="take_good_d_export"
              conditions={getFieldValue}
              btnName='导出清单'
              disabled={!dataItem.length}
            />,
            status === 1 &&
            <ExportHistory key="4" show={visit} setShow={setVisit} type="take_good_d_export" />,
            ...dom.reverse()
          ]
        }}
        toolBarRender={() => [
          status === 1 &&
          <ModalForm
            title={false}
            width={330}
            modalProps={{
              closable: false,
              centered: true,
              destroyOnClose: true
            }}
            onFinish={async () => {
              await purchaseInMultiAdd(getFieldValue(), {showSuccess: true, showError: true})
              setOrderIdList([])
              await actionRef.current?.reload()
              return true
            }}
            trigger={
              <Button type="primary" disabled={!dataItem.length}>批量入库</Button>
            }
          >
            <p>选中商品将都按总量入库，是否确认入库？</p>
          </ModalForm>,
          status === 1 &&
          <ModalForm
            title={false}
            width={330}
            modalProps={{
              closable: false,
              centered: true,
              destroyOnClose: true
            }}
            onFinish={async () => {
              await multiReceive(getFieldValue(), {showSuccess: true, showError: true})
              setOrderIdList([])
              await actionRef.current?.reload()
              return true
            }}
            trigger={
              <Button type="primary" disabled={!dataItem.length}>批量确认收货</Button>
            }
          >
            <p>确认收货后不可更改，是否确认收货？</p>
          </ModalForm>,
          status === 1 &&
          <Button 
            key="btn2"
            type='primary'
            onClick={()=>{setPrintOrder(true)}}
            disabled={!dataItem.length}
          >
            打印收货清单
          </Button>
        ]}
        {...objRowSelection}
      />
      {
        detail &&
        <DetailDrawer
          visible={detail}
          setVisible={setDetail}
          poNo={data}
          status={dynamic}
          setChange={setChange}
          change={change}
          actionRef={actionRef}
          isHide={status}
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
    </>
  )
}

export default TableList