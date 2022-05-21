export default {
    name: 'community-store',
    path: '/community-store',
    routes: [
      {
        name: 'community-store-list',
        path: '/community-store/community-store-list',
        component: './community-store/community-store-list',
      },
      {
        name: 'binding-unbinding',
        path: '/community-store/binding-unbinding',
        component: './community-store/binding-unbinding',
      }
    ]
}