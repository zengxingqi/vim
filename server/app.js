const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server, {
  transports: ['websocket', 'polling']
})

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/vim', {
  bufferMaxEntries: 0,
  keepAlive: 120,
  useNewUrlParser: true
})
// mongoose.set('bufferCommands', false)
const Schema = mongoose.Schema
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // we're connected!
  console.log('open mongo')
})

const usrSchema = new Schema({
  uname: {
    type: String,
    trim: true,
    default: 'vim'
  },
  tid: {
    type: String,
    trim: true,
    default: ''
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
    default: 'me@zengxingqi.com'
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
  createDate: {
    type: Date,
    default: Date.now
  },
  loginDate: {
    type: Date,
    default: Date.now
  }
})
const UserSchema = mongoose.model('UserSchema', usrSchema)
// UserSchema.remove({}, function (err) {
//   if (err) return console.log(err)
//   // removed!
// })
server.listen(1234)
// io主线连接
// io.on('connection', function (socket) {
//   console.log('io connect', socket.id)
//   console.log(new Date().toLocaleString())
// })
// 登陆
io.of('/login').on('connection', function (socket) {
  // 登陆和密码查询验证
  socket.on('login', function (from, fn) {
    UserSchema.findOne(from, function (err, doc) {
      if (err) {
        fn({
          status: 500,
          message: 'fail',
          result: err
        })
      } else if (doc) {
        // 更新tid，做token验证一类的事情
        doc.loginDate = new Date().toLocaleString()
        fn({
          status: 200,
          message: 'success',
          result: doc
        })
        // })
      } else {
        fn({
          status: 201,
          message: '账号或密码错误',
          result: ''
        })
      }
    })
  })
  // 客户端断开连接
  socket.on('disconnect', function (data) {
    console.info('login disconnect', data)
  })
})
// 注册
io.of('/register').on('connection', function (socket) {
  // 查询登录名是否已被占用
  socket.on('check', function (name, fn) {
    UserSchema.findOne({
      login: name
    }, function (err, doc) {
      if (err) {
        fn({
          status: 500,
          message: 'fail',
          result: err
        })
      } else if (doc) {
        fn({
          status: 201,
          message: '该用户名已存在',
          result: ''
        })
      } else {
        fn({
          status: 200,
          message: '该用户名不存在',
          result: ''
        })
      }
    })
  })
  // 注册
  socket.on('register', function (from, fn) {
    let rfrom = new UserSchema(from)
    rfrom.save(function (err, doc) {
      if (err) {
        fn({
          status: 500,
          message: 'fail',
          result: err
        })
      } else {
        fn({
          status: 200,
          message: 'success',
          result: doc
        })
      }
    })
  })
  // 客户端断开连接
  socket.on('disconnect', function (data) {
    console.info('register disconnect', data)
  })
})
// 群聊 - 公共聊天室
io.of('/chatroom').on('connection', function (socket) {
  // 更新tid，做token验证一类的事情
  socket.on('update', function (data, fn) {
    updataChat(socket, data, fn)
  })
  // 发送给所有客户端，除了发送者
  socket.on('chat', function (data, fn) {
    socket.broadcast.emit('broadcast', data)
    fn('服务端已收到')
  })
  // 私密消息
  socket.on('sendprivate', function (data, fn) {
    socket.to(data.toSid).emit('private', data)
    fn('ok')
  })
})
function updataChat (socket, data, fn) {
  UserSchema.findOne({
    _id: data.id
  }, function (err, doc) {
    if (err) {
      fn({
        status: 500,
        message: 'fail',
        result: err
      })
    } else if (doc) {
      if (doc.tid) {
        socket.to(socket.nsp.name + '#' + doc.tid).emit('entry', '你的账号在另一处登录')
      }
      socket.broadcast.emit('incoming', {
        tid: socket.conn.id,
        uname: doc.uname,
        _id: doc._id
      })
      // 更新tid，做token验证一类的事情
      UserSchema.update({
        _id: doc._id
      }, {
        $set: {
          tid: socket.conn.id
        }
      }, function (err, udoc) {
        if (err) return fn({status: 500, message: 'fail', result: err})
        doc.tid = socket.conn.id
        doc.loginDate = new Date().toLocaleString()
        fn({
          status: 200,
          message: 'success',
          result: doc
        })
      })
    } else {
      fn({
        status: 201,
        message: '该用户不存在',
        result: ''
      })
    }
  })
}
