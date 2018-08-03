<template>
  <div>
    <p>login</p>
    <div>
      <input type="text" v-model.lazy.trim="lname" placeholder="请输入登录账号">
    </div>
    <div>
      <input type="password" v-model.lazy.trim="lpass" placeholder="请输入登录密码" >
    </div>
    <div v-show="validity">账号或密码错误</div>
    <div>
      <input type="button" value="登陆" @click="Login">
    </div>
    <div>
      <router-link :to="{path:'/register'}">还没有账户？去注册</router-link>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import ioClient from 'socket.io-client'
import {setLs} from '@/localstore'
export default {
  name: 'login',
  data () {
    return {
      login: '',
      lname: '',
      lpass: '',
      validity: false
    }
  },
  created () {
    this.initLogin()
  },
  methods: {
    initLogin () {
      // 建立连接通道
      this.login = ioClient.connect('http://localhost:1234/login', {
        transports: ['websocket', 'polling']
      })
      // client连接server成功
      this.login.on('connect', async () => {
        console.log(this.login)
        let str = this.login.id
        str = str.match(/\/login#(\S*)/)[1]
        this.addSid({sid: str})
      })
    },
    Login () {
      this.login.emit('login', {login: this.lname, pass: this.lpass}, (answer) => {
        console.info(answer)
        if (answer.status === 200) {
          this.validity = false
          setLs('usr', answer.result)
          this.addUsr(answer.result)
          this.$router.push({ path: '/home' })
        } else {
          this.validity = true
        }
      })
    },
    ...mapActions({addSid: 'addSid', addUsr: 'addUsr'})
  },
  computed: {
    ...mapState({
      usid: state => state.sid
    })
  },
  destroyed () {
    console.log('销毁')
    this.login.close()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
