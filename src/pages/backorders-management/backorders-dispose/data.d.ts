export type TableListItem = {
  unit?: string;
  orSn?: string;
  poNo?: string;
  wsId?: number;
  goodsName?: string;
  totalNum?: number;
  returnNum?: number;
  createTime?: string;
  imageUrl?: string;
  operationRefundStatus?: number;
}

export type DrawerProps = {
  drawerVisit: boolean
  setDrawerVisit: React.Dispatch<React.SetStateAction<boolean>>,
  onClose: () => void,
  state?: boolean,
  orSn?: string
}

export type StoreOrderProps = {
	storeNo: string;
	orderId: string;
	totalNum: number;
	returnNum: number;
	storeName: string;
	shopMemberAccount?: string;
	fullAddress: string;
}

export type ArrProps = {
  orderId?: string;
	returnNum?: number;
}