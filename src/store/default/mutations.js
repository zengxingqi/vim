export default {
  addSid (state, {sid}) {
    state.sid = sid
  },
  addUsr (state, usr) {
    state.usr = usr
  },
  removeUsr (state) {
    state.usr = ''
  }
}
