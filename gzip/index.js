/* eslint-disable */
// API文档 https://archiverjs.com/docs/
// 导入需要的模块
var fs = require('fs');
var archiver = require('archiver');

// 创建一个文件数据流，并最终压缩成一个包
var output = fs.createWriteStream(__dirname + '/vim.tar');
var archive = archiver('tar', {
  gzip: true,
  gzipOptions: {
    level: 6 // 设置压缩级别
  }
})

// archiver('zip', {
//   zlib: {
//     level: 9  // 设置压缩级别
//   }
// })

// 监听所有要写入的存档数据，
// 只有在涉及文件描述符时才触发“关闭”事件。
output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

// 当数据源被耗尽时，无论数据源是什么，都会触发此事件。
// 它不是这个库的一部分，而是来自 NodeJS API。
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function () {
  console.log('Data has been drained');
});

// 捕获警告（即统计失败和其他非阻塞错误）
archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// 明确地捕捉此错误
archive.on('error', function (err) {
  throw err;
});

// 将文件归档
archive.pipe(output);

// 从全局模式追加文件
archive.glob('../dist/**');

// 最终归档（即我们已经完成了文件，文件流必须完成）
// “关闭”、“结束”或“完成”可在调用此方法后立即启动，以便预先注册。
archive.finalize();
