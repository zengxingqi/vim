const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server, {
  transports: ['websocket', 'polling']
})

server.listen(1234)

io.on('connect', onConnect)

io.of('/chat').on('connection', function (socket) {
  console.info('chat', socket.id)

  socket.to(socket.id).emit('an event', {
    some: '123'
  })

  socket.on('chat', function (data) {
    console.info()
  })

  socket.on('disconnect', function (data) {
    console.info('chat disconnect', data)
  })
  socket.on('error', function (error) {
    console.info('chat', error)
  })
})

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
  // 发送给同在 'game' 房间的所有客户端，除了发送者
  // socket.to('game').emit('nice game', "let's play a game")

  // 发送给同在 'game1' 或 'game2' 房间的所有客户端，除了发送者
  // socket.to('game1').to('game2').emit('nice game', "let's play a game (too)")

  // 发送给同在 'game' 房间的所有客户端，包括发送者
  // io.in('game').emit('big-announcement', 'the game will start soon')

  // 发送给同在 'myNamespace' 命名空间下的所有客户端，包括发送者
  // io.of('myNamespace').emit('bigger-announcement', 'the tournament will start soon')

  // 发送给指定 socketid 的客户端（私密消息）
  // for (let id in io.sockets.connected) {
  //   console.info(id)
  //   if (io.sockets.connected.hasOwnProperty(id) && id !== socket.id) {
  //     socket.to(id).emit('hey', 'I just met you')
  //   }
  // }
  // 包含回执的消息
  // socket.emit('question', 'do you think so?', function (answer) {
  //   console.info(answer)
  // })
  // 接收消息
  // socket.on('chat', function () {
  //   console.info('chat')
  //   // 发送给指定 socketid 的客户端（私密消息）
  //   io.clients((error, clients) => {
  //     if (error) throw error
  //     console.log('clients', clients) // => [Anw2LatarvGVVXEIAAAD]
  //     let i = 0
  //     let len = clients.length
  //     for (i; i < len; i++) {
  //       console.info(i)
  //       if (clients[i] !== socket.id) {
  //         socket.to(clients[i]).emit('hey', 'I just met you')
  //       }
  //     }
  //   })
  // })
  // socket.on('disconnect', function (data) {
  //   console.info('disconnect', data)
  // })
}

// app.get('/', function (req, res) {
//   res.end()
// })
// console.info()
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

// var arr = []
// var chats = []
// io.on('connection', function (socketIO) {
//   console.info(socketIO.id)
//   console.info(io.sockets.sockets)
//   var uname
//   socketIO.on('name', (name) => {
//     console.info(name)
//     uname = `/${name.name}`
//     arr.push(uname)
//     chats.push(socketIO.id)
//     var chat = io
//       .of(uname)
//       .on('connection', function (socket) {
//         socket.on('disconnect', function (data) {
//           console.info('chat disconnect', data)
//         })
//         socket.on('chat', function (data) {
//           // console.info(data)
//           // console.info(socket.conn.server.clients)
//           // console.info(socket.conn.server.clientsCount)
//           console.info(socket.id)
//           console.info(arr)
//           console.info(chats)
//           chat.emit('message', '给自己触发消息')
//           chats.forEach(element => {
//             arr.forEach(ele => {
//               if (io.sockets.sockets[element] && `${ele}#${element}` !== socket.id) {
//                 console.info(`${ele}#${element}`)
//                 socket.to(`<${ele}#${element}>`).emit('message', '给好友发消息')
//               }
//             })
//           })
//         })
//       })
//   })
// })
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
