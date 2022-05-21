export default {
  path: '/financial-management',
  name: 'financial-management',
  routes: [
    {
      name: 'account-management',
      path: '/financial-management/account-management',
      component: './financial-management/account-management'
    },
    {
      name: 'transaction-details',
      path: '/financial-management/transaction-details',
      hideInMenu: true,
      component: './financial-management/transaction-details'
    }
  ]
}
