import React, { 
  useState
} from 'react'
import {
  Button,
  message,
} from "antd"
import ProTable from '@ant-design/pro-table'
import { DrawerForm } from '@ant-design/pro-form'

import { memberShopPage, binding } from '@/services/community-store/community-store-list'
import Address from './address'

export default ({ 
  visible,
  setVisible,
  actionRef
}) => {

  const [selectItem, setSelectItem] = useState([])
      
  const bind = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const id = localStorage.getItem("operationId")
    binding({
      applyFromId: id,
      applyFromName: user.username,
      storeNo: selectItem?.[0].storeNo,
      operationId: id,
      operationName: user.username
    }).then(res => {
      if(res.success) message.success('您的申请已提交，请等待审核')
      setVisible(false)
      actionRef?.current.reload()
    })
  }

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '社区店地址',
      dataIndex: 'fullAddress',
      align: 'center',
      width: "45%",
      hideInSearch: true
    },
    {
      title: '区域筛选',
      dataIndex: 'area',
      align: 'center',
      hideInTable: true,
      renderFormItem: () => <Address />
    }
  ]

  return (
    <DrawerForm
      title="申请绑定社区店"
      visible={visible}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
      }}
      width="40%"
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none'
          }
        },
        submitButtonProps: {
          style: {
            display: 'none'
          }
        }
      }}
      layout="horizontal"
    >
      <ProTable
        rowKey="storeName"
        bordered
        columns={columns}
        toolBarRender={false}
        pagination={{
          showQuickJumper:true,
          pageSize: 10
        }}
        params={{}}
        rowSelection={{
          type:"radio",
          onChange: (e, v)=> {
            setSelectItem(v)
          }
        }}
        tableAlertRender={false}
        request={memberShopPage}
        search={{
        defaultCollapsed: false,
        labelWidth: 100,
        optionRender: ({ searchText, resetText }, { form }) => [
          <Button
            key="bind"
            type="primary"
            disabled={!selectItem.length}
            onClick={() => {
              bind()
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
    </DrawerForm>
  )
}