export default [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/room/public'),
    beforeEnter: (to, from, next) => {
      console.log('=> room public route before enter')
      next()
    }
  }
]
