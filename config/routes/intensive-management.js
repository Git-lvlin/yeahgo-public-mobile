export default {
  path: '/intensive-management',
  name: 'intensive-management',
  routes: [
    {
      name: 'intensive-activity-list',
      path: '/intensive-management/intensive-activity-list',
      component: './intensive-management/intensive-activity-list'
    },
    {
      name: 'intensive-list-detail',
      path: '/intensive-management/intensive-activity-list/:id',
      component: './intensive-management/intensive-activity-list/drawer-detail',
      hideInMenu: true
    },
    {
      name: 'purchase-statistics',
      path: '/intensive-management/purchase-statistics',
      component: './intensive-management/purchase-statistics'
    }
  ]
}
