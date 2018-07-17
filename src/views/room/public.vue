<template>
  <div class="home">
    <p>这是一段测试文本</p>
    <div v-if="incoming">{{incoming}} 进来了</div>
    <div v-if="privateMessage">私密消息：{{privateMessage.message}}</div>
    <div>
      <div v-for="item in content" :key="item.message">
        <p>{{item.sid}}说：{{item.message}}</p>
        <p v-if="item.oneself">{{loadMessage ? '正在发送中' : '已发送成功'}}</p>
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
      this.content.push({
        oneself: true,
        sid: this.chat.id,
        message: this.message
      })
      this.chat.emit('chat', {
        sid: this.chat.id,
        message: this.message
      }, (answer) => {
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
        message: this.privateInfo
      }, (answer) => {
        console.info(answer)
      })
      this.privateInfo = ''
    },
    getIo () {
      // 建立连接通道
      this.chat = ioClient.connect('http://localhost:1234', {
        transports: ['websocket', 'polling']
      })
      // client连接server成功
      this.chat.on('connect', async () => {
        console.log(await this.chat.id)
      })
      // 私密消息
      this.chat.on('private', (data) => {
        console.info(data)
        this.privateMessage = data
      })
      // 接收广播消息
      this.chat.on('broadcast', (data) => {
        this.content.push(data)
        if (data.sid) {
          this.sidLists.push(data.sid)
        }
      })
      // 用户进入房间或上线
      this.chat.on('incoming', (data) => {
        if (data) this.incoming = data
      })
      // c断开s连接
      this.chat.on('disconnect', (reason) => {
        console.info('disconnect', reason)
      })
      // 重新尝试连接次数
      this.chat.on('reconnect_attempt', (attemptNumber) => {
        console.info('reconnect_attempt', attemptNumber)
      })
      this.chat.on('error', (error) => {
        console.info('chat error', error)
      })
      // c连接s失败
      this.chat.on('connect_error', (error) => {
        console.info('chat connect_error', error)
      })
    },
    ...mapMutations({}),
    ...mapActions({})
  },
  computed: {
    ...mapState({
      name: state => state.name,
      user: state => state.chat.user
    }),
    ...mapGetters({})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
