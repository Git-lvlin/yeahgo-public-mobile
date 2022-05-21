import React, { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Space, Tooltip, Button } from 'antd'

import { page } from '@/services/community-store/community-store-list'
import BindDrawer from './bind-drawer'

const BindingUnbinding = () => {

  const [show, setShow] = useState(false)
  const ref = useRef()

  const columns = [
    {
      title: 'id',
      dataIndex: 'applyId',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center'
    },
    {
      title: '社区店地址',
      dataIndex: 'storeFullAddress',
      align: 'center',
      width: '30%',
      hideInSearch: true
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '申请类型',
      dataIndex: 'applyType',
      valueType: 'select',
      valueEnum: {
        1: '申请解绑',
        2: '申请绑定'
      },
      align: 'center',
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: '待提交',
        1: '审核通过',
        2: '审核驳回',
        3: '审核中'
      },
      hideInTable: true
    },
    {
      title: '状态',
      dataIndex: 'auditStatusDesc',
      align: 'center',
      hideInSearch: true,
      render: (_, records) => {
        return (
          <Space
            direction="vertical"
            size="small"
          >
            <div>{_}</div>
            {
              (records.auditStatus === 2 && records.auditRemark) &&
              <Tooltip title={records.auditRemark}>
                <a>原因</a>
              </Tooltip>
            }
          </Space>
        )
      }
    },
  ]

  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="applyId"
        columns={columns}
        toolBarRender={false}
        params={{}}
        actionRef={ref}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        bordered
        postData={
          (v) => {
            let arr = []
            v.map(item => {
              arr.push({
                applyId: item.applyId,
                storeName: item.storeName,
                createTime: item.createTime,
                applyType: item.applyType?.code,
                auditStatus: item.auditStatus?.code,
                auditStatusDesc: item.auditStatus?.desc,
                auditRemark: item.auditRemark,
                storeFullAddress: item.storeFullAddress
              })
            })
            return arr
          }
        }
        request={page}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="bind"
              type="primary"
              onClick={() => {
                setShow(true)
              }}
            >
              申请绑定
            </Button>,
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
          ],
        }}
      />
      {
        show&&
        <BindDrawer
          visible={show}
          setVisible={setShow}
          actionRef={ref}
        />
      }
    </PageContainer>
  )
}

export default BindingUnbinding
