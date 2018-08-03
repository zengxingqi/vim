export default {
  addSid ({
    state,
    commit,
    rootState
  }, {sid}) {
    commit('addSid', {
      sid
    })
  },
  addUsr ({
    state,
    commit,
    rootState
  }, usr) {
    commit('addUsr', usr)
  },
  removeUsr ({
    state,
    commit,
    rootState
  }) {
    commit('removeUsr')
  }
}
