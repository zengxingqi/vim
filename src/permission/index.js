import {
  getLs, setLs, clearLs
} from '@/localstore'
import routePath from './routePath'
export default (router, store) => {
  router.beforeEach((to, from, next) => {
    console.log('=> beforeEach route invoked')
    console.log(to)
    console.log(from)
    // debugger
    console.log(getLs('usr'))
    console.log(store.getters['usr'])
    if (getLs('usr') || store.getters['usr']) {
      if (routePath(to.path)) {
        next({path: '/home'})
      } else {
        if (getLs('usr') && !store.getters['usr']) {
          store.dispatch('addUsr', getLs('usr'))
        } else if (!getLs('usr') && store.getters['usr']) {
          setLs('usr', store.getters['usr'])
        }
        next()
      }
    } else if (routePath(to.path)) {
      next()
    } else {
      store.dispatch('removeUsr')
      clearLs()
      next({path: '/login'})
    }
  })
  // 路由守卫
  router.beforeResolve((to, from, next) => {
    console.log('=> beforeResolve route invoked')
    next()
  })
  // 路由守卫 导航全部完成钩子，包含父子层级组件
  router.afterEach((to, from) => {
    console.log('=> afterEach route invoked')
  })
}
