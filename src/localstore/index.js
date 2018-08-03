import Vue from 'vue'
import Storage from 'vue-ls'

let options = {
  namespace: 'vim_', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
}

Vue.use(Storage, options)

export const setLs = function (name, value, time = 72000000) {
  Vue.ls.set(name, value, time) // expiry 20 hour
}

export const getLs = function (name) {
  return Vue.ls.get(name)
}

export const moveLs = function (name) {
  Vue.ls.remove(name)
}

export const clearLs = function () {
  Vue.ls.clear()
}
