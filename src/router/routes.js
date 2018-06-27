export default [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/components/HelloWorld'),
    beforeEnter: (to, from, next) => {
      console.log('=> helloworld route before enter')
      next()
    }
  }
]
