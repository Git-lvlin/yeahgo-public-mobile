export type TableListItem = {
  goodsName: string
  imageUrl: string
  spuId: number
  businessType: number
  totalNum: number
  unit: string
  orderNum: number
  storeNum: number
}

export type ExpandedListItem = {
  skuId: number
  skuName: string
  containers: number
  totalNum: number
  orderNum: number
  storeNum: number
}
