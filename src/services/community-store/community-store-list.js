import request from '@/utils/request';

export const meberShopPage = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/meberShop/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}

// 未绑定的社区店分页
export const memberShopPage = async (params = {}, options = {}) => {
  const { current, pageSize, area, ...rest } = params
  const res = await request('/auth/store/bindingMemberShopApply/memberShopPage', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      provinceId: area?.province?.id,
      cityId: area?.city?.id,
      regionId: area?.area?.id,
      ...rest
    },
    ...options
  })

  return {
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}

// 绑定解绑店铺申请分页列表
export const page = async (params = {}, options = {}) => {
  const { current, pageSize, createTime, ...rest } = params
  const res = await request('/auth/store/bindingMemberShopApply/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      applyStart: createTime?.[0],
      applyEnd: createTime?.[1],
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

// 申请解除绑定店铺
export const unbinding = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/bindingMemberShopApply/unbinding', {
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
    success: res.success
  }
}

// 申请绑定店铺
export const binding = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/bindingMemberShopApply/binding', {
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
    success: res.success
  }
}