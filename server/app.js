const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server, {
  transports: ['websocket', 'polling']
})
// app.get('/', function (req, res) {
//   res.end()
// })
// console.info()
server.listen(1234)

// app.use(async ctx => {
//   ctx.body = 'Hello World'
// })

// io.on('connection', function (socket) {
//   console.info(socket.id)
//   socket.emit('news', {
//     hello: 'world'
//   })
//   socket.on('event', function (data) {
//     console.log(data)
//   })

//   socket.on('disconnect', function () {
//     console.info('disconnect')
//   })
// })

var arr = []
var chats = []
io.on('connection', function (socketIO) {
  console.info(socketIO.id)
  console.info(io.sockets.sockets)
  var uname
  socketIO.on('name', (name) => {
    console.info(name)
    uname = `/${name.name}`
    arr.push(uname)
    chats.push(socketIO.id)
    var chat = io
      .of(uname)
      .on('connection', function (socket) {
        socket.on('disconnect', function (data) {
          console.info('chat disconnect', data)
        })
        socket.on('chat', function (data) {
          // console.info(data)
          // console.info(socket.conn.server.clients)
          // console.info(socket.conn.server.clientsCount)
          console.info(socket.id)
          console.info(arr)
          console.info(chats)
          chat.emit('message', '给自己触发消息')
          chats.forEach(element => {
            arr.forEach(ele => {
              if (io.sockets.sockets[element] && `${ele}#${element}` !== socket.id) {
                console.info(`${ele}#${element}`)
                socket.to(`${ele}#${element}`).emit('message', '给好友发消息')
              }
            })
          })
        })
      })
  })
})
// var chat = io
//   .of('/chat')
//   .on('connection', function (socket) {
//     // console.info('chat', socket.id)

//     socket.to(socket.id).emit('an event', {
//       some: '123'
//     })

//     socket.on('disconnect', function (data) {
//       console.info('chat disconnect', data)
//     })
//     socket.on('error', function (error) {
//       console.info('chat', error)
//     })
//     socket.on('chat', function (data) {
//       // console.info(data)
//       // console.info(socket.conn.server.clients)
//       // console.info(socket.conn.server.clientsCount)
//       console.info(socket.id)
//       chat.emit('message', '触发消息')
//     })
//   })

// var news = io
//   .of('/news')
//   .on('connection', function (socket) {
//     // console.info('news', socket.client.id)
//     // 用户掉线了，断开连接了
//     socket.on('disconnect', function (data) {
//       console.info(socket.client.id)
//       console.info('news disconnect', data)
//     })
//     socket.on('error', function (error) {
//       console.info('news', error)
//     })
//   })
// .in('general').clients((error, clients) => {
//   if (error) throw error
//   console.log('clients', clients) // => [Anw2LatarvGVVXEIAAAD]
// })
