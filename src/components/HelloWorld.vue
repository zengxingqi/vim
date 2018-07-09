<template>
  <div class="home">
    <h1 class="ignore">{{name}}</h1>
    <a href="javascript:void(0)">{{user}}</a>
    <h1 class="ignore">测试</h1>
    <p>这是一段测试文本</p>
    <p>{{content}}</p>
    <a href="javascript: void(0)" @click="sendMessage">点击发送</a>
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
      socket: null,
      chat: null,
      news: null,
      content: ''
    }
  },
  created () {
    this.getIo()
  },
  methods: {
    sendMessage () {
      console.info('发送', this.chat.id)
      this.news.emit('chat', '发送给自己')
    },
    getIo () {
      // this.socket = ioClient.connect('http://localhost:1234')
      // this.socket.on('news', (data) => {
      //   console.log(data)
      //   this.socket.emit('event', { my: 'data' })
      // })

      this.chat = ioClient.connect('http://localhost:1234', {
        transports: ['websocket', 'polling']
      })

      this.chat.on('connect', async () => {
        let uname = await parseInt(Math.random() * 1000)
        console.log(this.chat.id)
        this.chat.emit('name', {name: uname})
        this.news = ioClient.connect(`http://localhost:1234/${uname}`, {
          transports: ['websocket', 'polling']
        })
        this.news.on('message', (data) => {
          console.info(this.chat.id)
          console.info(data)
          this.content = data
        })
      })
      this.chat.on('message', (data) => {
        console.info(this.chat.id)
        console.info(data)
        this.content = data
      })
      // setTimeout(() => {
      //   this.chat.emit('message', {a: 'woot'})
      // }, 5000)
      // this.news.on('connect', function () {
      //   // news.emit('woot', {a: 'woot'})
      //   // news.on('item', (data) => {
      //   //   console.info(data)
      //   // })
      // })
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
      // // c连接s超时
      // chat.on('connect_timeout', (timeout) => {
      //   console.info('chat connect_timeout', timeout)
      // })
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
.hello {
  width: 750px;
}
h1.ignore, h2.ignore {
  font-size: 14px;
  font-weight: normal;
}
a {
  color: #555;
  text-decoration: none;
  &:hover {
    color: red;
  }
  &:active {
    color: #444;
  }
}
p {
  font-size: 18px;
  width: 300px;
  margin: 0 auto;
}
</style>
