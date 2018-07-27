export default {
  addSid ({
    state,
    commit,
    rootState
  }, {sid}) {
    commit('addSid', {
      sid
    })
  }
}
