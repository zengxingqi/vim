<template>
  <div class="home">
    {{usid}}
    <div v-if="incoming">{{incoming.uname}} 进来了</div>
    <div v-if="privateMessage">私密消息：{{privateMessage.message}}</div>
    <div>
      <div v-for="item in content" :key="item.time">
        <div>{{item.time | formatDates}}</div>
        <p>{{item.sid}}说：{{item.message}}</p>
        <p v-if="item.sid === usid">{{loadMessage ? '正在发送中' : '已发送成功'}}</p>
      </div>
    </div>
    <div class="cdsf">
      <div><input type="text" v-model.lazy.trim="message" @keyup.enter="sendMessage"></div>
      <div>
        <a href="javascript: void(0)" @click="sendMessage">点击发送</a>
      </div>
    </div>
    <div class="cdsf">
      <div><input type="text" v-model.lazy.trim="privateInfo" @keyup.enter="privateSend"></div>
      <div>
        <a href="javascript: void(0)" @click="privateSend">私密发送</a>
        <select v-model="selectSid">
          <option v-for="item in sidLists" :key="item" :value="item">{{item}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
import ioClient from 'socket.io-client'
import { getTimeText, formatDate } from '@/utils/beforeTime'
export default {
  name: 'home',
  data () {
    return {
      chat: null,
      content: [],
      message: '',
      incoming: '',
      privateInfo: '',
      selectSid: '',
      sidLists: [],
      privateMessage: '',
      loadMessage: true
    }
  },
  created () {
    this.getIo()
  },
  methods: {
    sendMessage () {
      let message = {
        sid: this.chat.id,
        message: this.message,
        time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }
      this.content.push(message)
      this.chat.emit('chat', message, (answer) => {
        console.info(answer)
        this.loadMessage = false
      })
      this.message = ''
    },
    // 发送私密信息
    privateSend () {
      this.chat.emit('sendprivate', {
        toSid: this.selectSid,
        sid: this.chat.id,
        message: this.privateInfo,
        time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }, (answer) => {
        console.info(answer)
      })
      this.privateInfo = ''
    },
    getIo () {
      // 建立连接通道
      this.chat = ioClient.connect('http://localhost:1234/chatroom', {
        transports: ['websocket', 'polling']
      })
      // client连接server成功
      this.chat.on('connect', async () => {
        console.log(this.chat.id)
        this.addSid({sid: this.chat.id})
      })
      // 个人信息
      this.chat.on('userinfo', async (data) => {
        console.log(data)
        this.addUsr(data)
      })
      // 私密消息
      this.chat.on('private', async (data) => {
        console.info(data)
        this.privateMessage = data
      })
      // 接收广播消息
      this.chat.on('broadcast', async (data) => {
        this.content.push(data)
        if (data.sid && this.chat.id !== data.sid && this.sidLists.indexOf(data.sid) === -1) {
          this.sidLists.push(data.sid)
        }
      })
      // 用户进入房间或上线
      this.chat.on('incoming', async (data) => {
        if (data) this.incoming = data
      })
      // c断开s连接
      this.chat.on('disconnect', async (reason) => {
        console.info('disconnect', reason)
      })
      // 重新尝试连接次数
      this.chat.on('reconnect_attempt', async (attemptNumber) => {
        console.info('reconnect_attempt', attemptNumber)
      })
      this.chat.on('error', async (error) => {
        console.info('chat error', error)
      })
      // c连接s失败
      this.chat.on('connect_error', async (error) => {
        console.info('chat connect_error', error)
      })
    },
    ...mapMutations({}),
    ...mapActions({
      addSid: 'addSid',
      addUsr: 'addUsr'
    })
  },
  computed: {
    ...mapState({
      usid: state => state.sid,
      user: state => state.chat.user
    }),
    ...mapGetters({})
  },
  filters: {
    formatDates (time) {
      return getTimeText(time)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
