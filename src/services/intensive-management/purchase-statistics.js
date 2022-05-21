import request from '@/utils/request';

// 商品采购数量统计
export const storeOrderSpuStatistic = async (params, options = {}) => {
  const { current, pageSize, time, ...rest } = params;
  const res = await request('/auth/order/storeOrderSpuStatistic', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeBegin: time?.[0],
      createTimeEnd: time?.[1],
      ...rest
    },
    ...options
  })
  return {
    data: res.data.records,
    success: res.succes,
    total: res.data.total
  }
}

// 商品sku采购数量统计
export const storeOrderSkuStatistic = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/order/storeOrderSkuStatistic', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })
  return {
    data: res.data.records,
    success: res.succes,
    total: res.data.total
  }
}