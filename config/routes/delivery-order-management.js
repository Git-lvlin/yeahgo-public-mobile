export default {
  path: '/delivery-order-management',
  name: 'delivery-order-management',
  routes: [
    {
      path: '/delivery-order-management/delivery-order-management',
      name: 'delivery-order-management',
      component: './delivery-order-management/delivery-order-management'
    },
    {
      path: '/delivery-order-management/delivery-order-management/:id',
      name: 'delivery-order-detail',
      component: './delivery-order-management/detail'
    }
  ]
}
