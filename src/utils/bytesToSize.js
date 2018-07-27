// 数据容量单位转换(kb,mb,gb,tb)
export function bytesToSize (bytes) {
  if (bytes === 0) return '0 B'
  // or 1024
  let k = 1000
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}
