export default {
  path: '/earning-report',
  name: 'earning-report',
  routes: [
    {
      path: '/earning-report/community-store-purchase-performance-sheet',
      name: 'community-store-purchase-performance-sheet',
      component: './earning-report/community-store-purchase-performance-sheet'
    },
    {
      path: '/earning-report/hydrogen-Income-sheet',
      name: 'hydrogen-Income-sheet',
      component: './earning-report/hydrogen-Income-sheet'
    },
    {
      path: '/earning-report/community-store-share-performance-sheet',
      name: 'community-store-share-performance-sheet',
      component: './earning-report/community-store-share-performance-sheet'
    }
  ]
}
