import { useState, useRef } from "react"
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Space, Image } from 'antd'

import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { TableListItem } from './data'

import DetailDrawer from "./detail-drawer"
import { getSupplierRefundList } from "@/services/backorders-management/backorders-dispose"

function BackordersDispose () {
  const [drawerVisit, setDrawerVisit] = useState<boolean>(false)
  const [state, setState] = useState<boolean>()
  const [orSn, setOrSn] = useState<string>()
  const ref = useRef<ActionType>()

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '申请编号',
      dataIndex: 'orSn',
      align: 'center'
    },
    {
      title: '关联集约采购单号',
      dataIndex: 'poNo',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '关联集约活动编号',
      dataIndex: 'wsId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '集约活动编号',
      dataIndex: 'wsId',
      align: 'center',
      hideInTable: true
    },
    {
      title: '供应商ID',
      dataIndex: 'supplierId',
      align: 'center'
    },
    {
      title: '采购商品',
      dataIndex: 'goodsName',
      align: 'center',
      width: '15%',
      render: (_, r) => (
        <Space size="middle">
          <Image
            width={80}
            height={80}
            src={r.imageUrl}
          />
          <span>{r.goodsName}</span>
        </Space>
      )
    },
    {
      title: '库存单位',
      dataIndex: 'unit',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '采购数量',
      dataIndex: 'totalNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '缺货数量',
      dataIndex: 'returnNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '处理状态',
      dataIndex: 'operationRefundStatus',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        1: '待处理',
        2: '已提交',
        3: '已退款完成'
      }
    },
    {
      title: '审核状态',
      dataIndex: 'operationAuditStatus',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        1: '-',
        2: '待审核',
        3: '审核通过',
        4: '审核拒绝'
      },
      hideInSearch: true
    },
    {
      title: '集约采购单号',
      dataIndex: 'poNo',
      align: 'center',
      hideInTable: true
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, r) => (
        <Space size="middle">
          { 
            r?.operationRefundStatus === 1 ?
            <a onClick={() => {setDrawerVisit(true); setState(false); setOrSn(r.orSn)}}>立即处理</a>:
            <a onClick={() => {setDrawerVisit(true); setState(true); setOrSn(r.orSn)}}>立即查看</a>
          }
        </Space>
      )
    }
  ]

  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="orSn"
        columns={columns}
        request={getSupplierRefundList}
        params={{}}
        pagination={{
          pageSize: 10
        }}
        headerTitle="数据列表"
        options={false}
        actionRef={ ref }
        search={{
          labelWidth: 'auto',
          optionRender: (submitter, searchConfig, dom)=> [
            ...dom.reverse()
          ]
        }}
      />
      {
        drawerVisit&&
        <DetailDrawer
          drawerVisit={drawerVisit}
          setDrawerVisit={setDrawerVisit}
          onClose={()=> ref.current?.reload()}
          state={state}
          orSn={orSn}
        />
      }
    </PageContainer>
  )
}

export default BackordersDispose
