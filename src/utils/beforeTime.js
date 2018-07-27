export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    let str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
export function getTimeText (argument) {
  let timeS = argument
  let todayT = ''
  let yestodayT = ''
  let timeCha = getTimeS(timeS)
  timeS = timeS.slice(-8)
  todayT = new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000
  yestodayT = todayT + 24 * 60 * 60 * 1000
  if (timeCha > yestodayT) {
    return argument
  }
  if (timeCha > todayT && timeCha < yestodayT) {
    return timeS.slice(0, 2) > 12 ? '昨天' + (timeS.slice(0, 2) === 12 ? 12 : timeS.slice(0, 2)) + timeS.slice(2, 5) : '昨天' + timeS.slice(0, 5)
  }
  if (timeCha < todayT) {
    return timeS.slice(0, 2) >= 12 ? (timeS.slice(0, 2) === 12 ? 12 : timeS.slice(0, 2)) + timeS.slice(2, 5) : timeS.slice(0, 5)
  }
}
// 时间戳获取
function getTimeS (argument) {
  let timeS = argument
  timeS = timeS.replace(/-/g, '/')
  return new Date().getTime() - new Date(timeS).getTime() - 1000 // 有一秒的误差
}
