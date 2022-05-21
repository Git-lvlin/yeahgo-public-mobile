import request from '@/utils/request'

// 社区店采购业绩表
export const performance = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/order/performance', {
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
    success: true,
    total: res.data.total
  }
}

// 社区店采购明细
export const performanceDetail = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/order/performanceDetail', {
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
    success: true,
    total: res.data.total
  }
}

// 氢原子收益业绩表
export const hydrogenCommission = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/operation/commission/hydrogenCommission',
      page: current,
      size: pageSize,
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

// 氢原子收益业绩表明细
export const hydrogenCommissionItem = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/operation/commission/hydrogenCommissionItem',
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total,
  }
}

// 订单类型
export const orderTypes = async (params={}, options= {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/common/orderTypes',
      ...params
    },
    ...options
  })

  return {
    data: res.data.records
  }
}

// 分享订单运营中心收益
export const storeShareCommission = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/operation/commission/storeShareCommission',
      page: current,
      size: pageSize,
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

// 分享订单运营中心收益明细
export const storeShareCommissionItem = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/operation/commission/storeShareCommissionItem',
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    total: res.data.total,
    success: true
  }
}