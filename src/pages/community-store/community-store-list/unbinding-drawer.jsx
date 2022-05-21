import React from 'react'
import ProTable from '@ant-design/pro-table'
import { DrawerForm, ProFormTextArea } from '@ant-design/pro-form'
import { unbinding } from '@/services/community-store/community-store-list'
import { message } from 'antd'

const UnbindingDrawer = ({ 
  visit, 
  setVisit,
  dataSource,
  actionRef,
  id
}) => {
  const user = JSON.parse(localStorage.getItem('user'))

  const submitApply = ({applyRemark}) => {
    unbinding({
      applyFromId: id,
      applyFromName: user.username,
      storeNo: dataSource.storeNo,
      operationId: id,
      operationName: user.username,
      applyRemark
    }).then(res => {
      if(res.success)  message.success('申请解绑成功')
      setVisit(false)
      actionRef?.current.reload()
    })
  }

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center'
    },
    {
      title: '社区店地址',
      dataIndex: 'address',
      align: 'center',
      render: (_, records) => {
        return (
          <pre style={{ margin: 0, fontFamily: 'none' }}>
            {records?.areaInfo?.[records?.provinceId]} {records?.areaInfo?.[records?.cityId]} {records?.areaInfo?.[records?.regionId]} {_} {records?.communityName} {records?.houseNumber}
          </pre>
        )
      }
    }
  ]

  return (
    <DrawerForm
      title="解绑社区店"
      visible={visit}
      onVisibleChange={setVisit}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
      }}
      width={1000}
      layout="horizontal"
      submitter={{
        searchConfig: {
          resetText: '取消'
        }
      }}
      onFinish={(v)=>{
        submitApply(v)
      }}
    >
      <ProTable
        rowKey="storeName"
        columns={columns}
        bordered
        search={false}
        toolBarRender={false}
        dataSource={[dataSource]}
        pagination={false}
      />
      <div style={{ marginTop: 50 }}>
        <ProFormTextArea
          name="applyRemark"
          label="备注原因"
          placeholder="请输入备注原因"
          rules={[{ required: true, message: '请输入备注原因' }]}
          fieldProps={{
            showCount: true,
            maxLength: 100
          }}
        />
      </div>
    </DrawerForm>
  )
}

export default UnbindingDrawer
