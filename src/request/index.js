import axios from 'axios'
const service = axios.create({
  // baseURL: '', // api的base_url
  // timeout: 20000 // request timeout
})
// axios请求拦截器
service.interceptors.request.use((config) => {
  return config
}, function (error) {
  return Promise.reject(error)
})
// axios响应拦截器
service.interceptors.response.use((response) => {
  return response
}, function (error) {
  return Promise.reject(error)
})

export default service
