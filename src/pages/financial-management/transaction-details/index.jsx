import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { useLocation, history } from "umi"
import { Button } from 'antd'

import { logPage } from '@/services/financial-management/account-management'
import { amountTransform } from '@/utils/utils'

const Index = ()=> {

  const {query} = useLocation()

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'indexBorder'
    },
    {
      title: '交易类型',
      dataIndex: 'tradeType',
      valueType: 'select',
      valueEnum: {
        'agentCompanyCommission': '运营中心收益',
        'agentCompanyCommissionReturn': '运营中心收益回退',  
        'unfreeze': '解冻',
        'freeze': '冻结',
        'withdraw': '提现',
        'chargeFeeCommission': '服务费收益',
        'chargeFeeCommissionReturn': '服务费收益回退'
      },
      hideInTable: true
    },
    {
      title: '交易类型',
      dataIndex: 'tradeTypeDesc',
      hideInSearch: true
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: {
        'commandSalesOrder': '集约批发订单',
        'settleChargeFee': '入驻服务费订单',
        'hydrogenRent': '氢原子租金订单',
        'wholesaleFresh': '集约批发-生鲜订单',
        'hydrogen': '氢原子销售'
      },
      hideInTable: true
    },
    {
      title: '订单类型',
      dataIndex: 'orderTypeDesc',
      hideInSearch: true
    },
    {
      title: '订单号',
      dataIndex: 'billNo'
    },
    {
      title: '支付单号',
      dataIndex: 'payNo'
    },
    {
      title: '资金流水号',
      dataIndex: 'transactionId'
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      hideInSearch: true
    },
    {
      title: '交易金额',
      dataIndex: 'changeAmount',
      render: (_)=> amountTransform(_, '/'),
      hideInSearch: true
    },
    {
      title: '交易后余额',
      dataIndex: 'balanceAmount',
      render: (_)=> amountTransform(_, '/'),
      hideInSearch: true
    },
    {
      title: '交易描述',
      dataIndex: 'description',
      hideInSearch: true
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="id"
        columns={columns}
        request={logPage}
        params={{...query}}
        options={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showQuickJumper: true
        }}
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
            </Button>
          ]
        }}
      />
    </PageContainer>
  )
}

export default Index
