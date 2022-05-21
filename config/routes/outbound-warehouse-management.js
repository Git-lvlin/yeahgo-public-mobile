export default {
  path: '/outbound-warehouse-management',
  name: 'outbound-warehouse-management',
  routes: [
    {
      name: 'put-storage-mangement',
      path: '/outbound-warehouse-management/put-storage-mangement',
      routes: [
        {
          name: 'receive-goods',
          path: '/outbound-warehouse-management/put-storage-mangement/receive-goods',
          component: './outbound-warehouse-management/put-storage-mangement/receive-goods'
        },
        {
          name: 'GRN',
          path: '/outbound-warehouse-management/put-storage-mangement/GRN',
          component: './outbound-warehouse-management/put-storage-mangement/GRN'
        }
      ]
    },
    {
      name: 'outbound-mangement',
      path: '/outbound-warehouse-management/outbound-mangement',
      routes: [
        {
          name: 'delivery-by-order',
          path: '/outbound-warehouse-management/outbound-mangement/delivery-by-order',
          component: './outbound-warehouse-management/outbound-mangement/delivery-by-order'
        },
        {
          name: 'outbound-list',
          path: '/outbound-warehouse-management/outbound-mangement/outbound-list',
          component: './outbound-warehouse-management/outbound-mangement/outbound-list'
        }
      ]
    }
  ]
}
