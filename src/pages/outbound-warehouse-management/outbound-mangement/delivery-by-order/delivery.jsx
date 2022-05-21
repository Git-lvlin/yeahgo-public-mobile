import React from 'react'
import { ModalForm } from '@ant-design/pro-form'

import { multiDispatchOutAdd } from '@/services/outbound-warehouse-management/outbound-mangement'

const Delivery = ({
  orderId,
  Visible,
  setVisible,
  change,
  clearSelect
}) => {

  const submitOrder = () => {
    multiDispatchOutAdd(
      {
        operationId: window.localStorage.getItem('operationId'),
        orderIds: orderId
      },
      {
        showSuccess: true,
        showError: true
      }
    ).then(res => {
      clearSelect([])
      if(res.success) change.current.reload()
    })
  }

  return (
    <ModalForm
      title="操作确认"
      visible={Visible}
      onFinish={async () => {
        await submitOrder()
        return true
      }}
      onVisibleChange={setVisible}
      width={300}
    >
      <p>确定要对所选店铺进行出库配送吗？</p>
    </ModalForm>
  )
}

export default Delivery
