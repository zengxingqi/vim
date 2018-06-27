// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueRouter from 'vue-router'
import Vuex from 'vuex'
import creatRouter from './router'
import creatStore from './store'
const isDebug = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebug
Vue.config.devtools = isDebug
Vue.config.productionTip = isDebug
Vue.use(vueRouter)
Vue.use(Vuex)
const router = creatRouter()
const store = creatStore()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
