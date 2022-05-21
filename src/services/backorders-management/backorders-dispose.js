import request from '@/utils/request';

// 缺货单列表
export const getSupplierRefundList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/operationRefund/getSupplierRefundList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}

// 缺货单处理详情
export const getSupplierRefundInfo = async (params = {}, options = {}) => {
  const res = await request('/auth/operationRefund/getSupplierRefundInfo', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    data: res.data,
    success: res.success
  }
}

// 缺货申请处理
export const createBySupplierRefund = async (params = {}, options = {}) => {
  const res = await request('/auth/operationRefund/createBySupplierRefund', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    data: res.data,
    success: res.success
  }
}
