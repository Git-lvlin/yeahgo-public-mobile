import request from '@/utils/request'
import moment from 'moment'

// 配货出库单列表
export const dispatchOutList = async (params, options = {}) => {
  const { current = 1, pageSize = 10, createTime , ...rest } = params
  const createTimeBegin = createTime&&parseInt(moment(createTime?.[0]).valueOf()/1000)
  const createTimeEnd = createTime&&parseInt(moment(createTime?.[1]).valueOf()/1000)
  const res = await request('/auth/order/dispatchOutList', {
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

// 配货出库单新增
export const dispatchOutAdd = async (params, options = {}) => {
  const res = await request('/auth/order/dispatchOutAdd', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    success: res.success
  }
}


// 按单配送列表
export const storeOrderList = async (params, options = {}) => {
  const { current = 1, pageSize = 10, createTime , ...rest } = params
  const createTimeBegin = createTime&&parseInt(moment(createTime?.[0]).valueOf()/1000)
  const createTimeEnd = createTime&&parseInt(moment(createTime?.[1]).valueOf()/1000)
  return await request('/auth/order/storeOrderList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeBegin,
      createTimeEnd,
      ...rest
    },
    ...options
  })
}

// 按单配送详情
export const storeOrderDetail = async (params, options = {}) => {
  const res = await request('/auth/order/storeOrderDetail', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    success: res.success,
    data: res.data.records
  }
}

// 按单配送列表数据打印
export const printStoreOrderList = async (params, options = {}) => {
  return await request('/auth/order/printStoreOrderList', {
    method: 'POST',
    data: params,
    ...options
  })
}

// 批量配货出库单
export const multiDispatchOutAdd = async (params, options = {}) => {
  return await request('/auth/order/multiDispatchOutAdd', {
    method: 'POST',
    data: params,
    ...options
  })
}

