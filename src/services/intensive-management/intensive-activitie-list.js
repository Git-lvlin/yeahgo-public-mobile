import request from '@/utils/request';

// 集约活动列表
export const wholesaleList = async (params, options = {}) => {
  const { current, pageSize, activityTime, ...rest } = params;
  const res = await request('/auth/wholesale/list', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      wholesaleStartTimeBegin: activityTime?.[0],
      endTimeAdvancePayment: activityTime?.[1],
      ...rest
    },
    ...options
  });
  const skusinfo = res.data.records.map(item=>({orderType: 5, objectId: item.wsId, skuId: item.skuId}))
  const anticipatedIncome = await request('/auth/jump/url', {
    method: 'POST',
    data: { 
      requestUrl:'/java-admin/financial/operation/divide/caculate/operationCommission',
      skusinfo 
    },
    ...options
  })
  const data = res.data.records.map(res => {
    return {
      ...res,
      ...anticipatedIncome.data.records.items.find(item=> (item.skuId == res.skuId))
    }
  })
  return {
    data,
    success: true,
    total: res.data.total
  }
}

// 集约活动商品详情
export const wholesaleDetail = async (params, options = {}) => {
  const { current, pageSize, activityTime, ...rest } = params;
  return await request('/auth/wholesale/detail', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      wholesaleStartTimeBegin: activityTime?.[0],
      wholesaleStartTimeEnd: activityTime?.[1],
      ...rest
    },
    ...options
  })
}
