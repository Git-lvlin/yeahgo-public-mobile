import React, { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import moment from 'moment'
import { history } from 'umi'

import { amountTransform } from '@/utils/utils'
import { wholesaleList } from '@/services/Intensive-management/intensive-activitie-list'
import ListSort from './list-sort'

const IntensiveActivitieList = () => {
  const [value, setValue] = useState(1)
  const actionRef = useRef()

  const onChange = (e) => {
    setValue(e) 
  }

  const skipTodetail = (id, anticipatedIncome) => {
    history.push(`/intensive-management/intensive-activity-list/${id}?anticipatedIncome=${anticipatedIncome}`)
  }

  const columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '集约活动名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '集约ID',
      dataIndex: 'wsId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '活动开始时间',
      dataIndex: 'wholesaleStartTime',
      align: 'center',
      hideInSearch: true,
      render: (_) => moment(_*1000).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '活动状态',
      dataIndex: 'wholesaleStatus',
      valueType: 'select',
      valueEnum: {
        1: '待开始',
        2: '进行中',
        3: '已结束'
      },
      align: 'center'
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '集约类型',
      dataIndex: 'fresh',
      valueType: 'select',
      valueEnum: {
        0: '普适品集约',
        1: '精装生鲜集约',
        2: '散装生鲜集约'
      },
      hideInTable: true,
    },
    {
      title: '下单截止时间',
      dataIndex: 'endTimeAdvancePayment',
      hideInSearch: true,
      align: 'center',
      render: (_) => moment(_ * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      hideInSearch: true,
      width: '20%',
      align: 'center'
    },
    {
      title: '集约价（元）',
      dataIndex: 'price',
      hideInSearch: true,
      align: 'center',
      render: (_)=> amountTransform(_, '/')
    },
    {
      title: '预计收益',
      dataIndex: 'commissionForOne',
      hideInSearch: true,
      align: 'center',
      render: (_, records)=> `${amountTransform(_, '/')}元/${records.unit}`
    },
    {
      title: '额外奖励',
      dataIndex: 'ladderSubsidyDesc',
      hideInSearch: true,
      width: '15%',
      align: 'center'
    },
    {
      title: '已集约数量',
      dataIndex: 'saleNum',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, records)=>(
        <a onClick={()=>{skipTodetail(records?.wsId, records?.commissionForOne)}}>详情</a>
      ),
      align: 'center'
    }
  ]

  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='id'
        request={wholesaleList}
        params={{sortType: value}}
        columns={columns}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        search={{
          labelWidth: 100
        }}
        toolbar={{
          settings: false
        }}
        actionRef={actionRef}
        headerTitle={
          <ListSort 
            actRef={actionRef} 
            onChange={onChange}
            value={value}
          />
        }
      />
    </PageContainer>
  )
}

export default IntensiveActivitieList
