// 注意：全局调用，需设置{root: true}
export default {
  add ({state, commit, rootState}, usr) {
    commit('updateUser', usr)
  }
}
