import request from '@/utils/request'

// 订单列表
export const list = async (params, options = {}) => {
  const { current, pageSize, createTime, ...rest } = params
  const res = await request('/auth/order/list', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      beginTime: createTime?.[0],
      endTime: createTime?.[1],
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

// 订单详情
export const detail = async (params, options = {}) => {
  const res = await request('/auth/order/detail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res.data.records,
    success: res.success
  }
}

// 查询快递信息
export const expressInfo = async (params, options = {}) => {
  const res = await request('/auth/express/express/expressInfo', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res.data.records,
    success: res.success
  }
}

// 订单确认收货
export const receive = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/order/receive', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    data: res.data.records,
    success: res.success
  }
}

// 订单配送
export const dispatchOrder = async (params, options = {}) => {
  const res = await request('/auth/order/dispatchOrder', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res.data?.records,
    success: res.success
  }
}