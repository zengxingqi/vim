/*
 * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
 */
let baseUrl = ''
// 注：下面的baseUrl地址为 API前缀拼接
if (process.env.SITE === 'dev') {
  baseUrl = ''
} else if (process.env.SITE === 'prod') {
  baseUrl = ''
} else if (process.env.SITE === 'test') {
  baseUrl = ''
}

export {
  baseUrl
}
