const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server, {
  transports: ['websocket', 'polling']
})

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/vim', {
  bufferMaxEntries: 0,
  keepAlive: 120,
  useNewUrlParser: true
})
// mongoose.set('bufferCommands', false)
const Schema = mongoose.Schema
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // we're connected!
  console.log('open mongo')
})

const usrSchema = new Schema({
  uname: {
    type: String,
    trim: true,
    default: '游客'
  },
  login: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    default: 'abc123'
  },
  pass: {
    type: String,
    trim: true,
    default: 'abc123'
  },
  contact: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    default: null
  },
  sex: {
    type: String,
    trim: true,
    default: '男'
  },
  city: {
    type: String,
    trim: true,
    default: '深圳'
  },
  admin: {
    type: Boolean,
    default: false
  },
  group: [],
  loginDate: {
    type: Date,
    default: Date.now
  }
})

var UserSchema = mongoose.model('UserSchema', usrSchema)
// var felyne = new UserSchema({
//   uname: 'Felyne'
// })
// felyne.save(function (err, felyne) {
//   if (err) return console.error(err)
//   console.log(felyne)
// })
UserSchema.findOne({login: 'abc123'}, function (err, doc) {
  if (err) return console.error(err)
  console.log(doc)
})
server.listen(1234)

io.on('connect', onConnect)

function onConnect (socket) {
  console.info('onConnect', socket.id)
  // 发送给当前客户端
  // socket.emit('hello', 'can you hear me?', 1, 2, 'abc')

  // 发送给所有客户端，除了发送者
  socket.broadcast.emit('incoming', socket.id)
  socket.on('chat', function (data, fn) {
    socket.broadcast.emit('broadcast', data)
    fn('服务端已收到')
  })
  // 私密消息
  socket.on('sendprivate', function (data, fn) {
    console.info(data)
    socket.to(data.toSid).emit('private', data)
    fn('ok')
  })
}
