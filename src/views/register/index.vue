<template>
  <div>
    register
    <div>
      <input type="text" v-model.lazy.trim="rnick" placeholder="请输入一个昵称" >
    </div>
    <div>
      <input type="text" v-model.lazy.trim="rname" placeholder="请输入登录账号" v-on:blur="checkName">
    </div>
    <div>
      <input type="password" v-model.lazy.trim="rpass" placeholder="请输入登录密码" >
    </div>
    <div v-show="validity">账号已被注册，换一个吧</div>
    <div>
      <input type="button" value="注册" @click="Register">
    </div>
    <div>
      <router-link :to="{path:'/login'}">已有账号？去登录</router-link>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import ioClient from 'socket.io-client'
import {setLs} from '@/localstore'
export default {
  name: 'register',
  data () {
    return {
      register: '',
      rname: '',
      rpass: '',
      rnick: '',
      rbtn: true,
      validity: false
    }
  },
  created () {
    this.initRegister()
  },
  methods: {
    initRegister () {
      // 建立连接通道
      this.register = ioClient.connect('http://localhost:1234/register', {
        transports: ['websocket', 'polling']
      })
      // client连接server成功
      this.register.on('connect', async () => {
        console.log(this.register)
        let str = this.register.id
        str = str.match(/\/register#(\S*)/)[1]
        this.addSid({sid: str})
      })
    },
    checkName () {
      if (!this.rname) return null
      this.register.emit('check', this.rname, (answer) => {
        console.info(answer)
        if (answer.status === 200) {
          this.validity = false
        } else {
          this.validity = true
        }
      })
    },
    Register () {
      console.log('点了一次按钮')
      if (!this.validity && this.rbtn && this.rpass) {
        this.rbtn = false
        this.register.emit('register', {login: this.rname, pass: this.rpass, uname: this.rnick || 'vim', tid: this.usid}, (answer) => {
          console.info(answer)
          if (answer.status === 200) {
            setLs('usr', answer.result)
            this.addUsr(answer.result)
            this.$router.push({ path: '/home' })
          } else {
            this.rbtn = true
          }
        })
      } else {
        this.rbtn = true
      }
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
    this.register.close()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
