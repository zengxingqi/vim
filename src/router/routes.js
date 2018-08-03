export default [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/index'),
    beforeEnter: (to, from, next) => {
      console.log('=> room public route before enter')
      next()
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    beforeEnter: (to, from, next) => {
      console.log('=> login route before enter')
      next()
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index'),
    beforeEnter: (to, from, next) => {
      console.log('=> register route before enter')
      next()
    }
  }
]
