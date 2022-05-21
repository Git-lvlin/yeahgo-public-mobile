import request from '@/utils/request'
import moment from 'moment'

// 采购订单库存列表
export const orderStockList = async (params, options = {}) => {
  const { current = 1, pageSize = 10, createTime , ...rest } = params
  const createTimeBegin = createTime&&parseInt(moment(createTime?.[0]).valueOf()/1000)
  const createTimeEnd = createTime&&parseInt(moment(createTime?.[1]).valueOf()/1000)
  return await request('/auth/order/orderStockList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeBegin,
      createTimeEnd,
      ...rest
    },
    ...options
  });
}

// 采购订单库存详情
export const orderStockDetail = async (params, options = {}) => {
  const res = await request('/auth/order/orderStockDetail', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    success: res.success,
    data: res.data.records
  }
}

// 采购入库单列表
export const purchaseInList = async (params, options = {}) => {
  const { current = 1, pageSize = 10, createTime , ...rest } = params
  const createTimeBegin = createTime&&parseInt(moment(createTime?.[0]).valueOf()/1000)
  const createTimeEnd = createTime&&parseInt(moment(createTime?.[1]).valueOf()/1000)
  const res = await request('/auth/order/purchaseInList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeBegin,
      createTimeEnd,
      ...rest
    },
    ...options
  });

  return {
    success: res.success,
    data: res.data.records.records,
    total: res.data.records.total
  }
}

// 采购入库单新增
export const purchaseInAdd = async (params, options = {}) => {
  const res = await request('/auth/order/purchaseInAdd', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    success: res.success,
    data: res.records,
    total: res.total
  }
}

// 打印收货清单
export const opPendReceiptOrder = async (params, options = {}) => {
  const res = await request('/auth/order/opPendReceiptOrder', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    success: res.success,
    data: res.data,
    total: res.total
  }
}

// 采购入库单批量新增
export const purchaseInMultiAdd = async (params = {}, options = {}) => {
  return await request('/auth/order/purchaseInMultiAdd', {
    method: 'POST',
    data: params,
    ...options
  })
}

// 订单批量确认收货
export const multiReceive = async (params = {}, options = {}) => {
  return await request('/auth/order/multiReceive', {
    method: 'POST',
    data: params,
    ...options
  })
}