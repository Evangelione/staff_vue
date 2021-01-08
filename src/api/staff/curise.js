import axios from 'axios'

function withCommonData(data) {
  const { device_id } = JSON.parse(sessionStorage.getItem('session_storestaff_store_staff').substr(5))
  const payload = {
    ...data,
    'Device-Id': device_id,
    ticket: localStorage.getItem('local_storestaff_ticket')
      ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
      : '',
  }
  return payload
}

// 获取移动机器人列表
export const robotList = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=imax_list', withCommonData(payload))
}

// 获取店铺下的巡航点
export const pointList = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=point', withCommonData(payload))
}

// 获取巡航路线
export const curiseRouteList = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=route_list', withCommonData(payload))
}

// 创建巡航路线
export const modifyCuriseRoute = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=route', withCommonData(payload))
}

// 巡航路线详情
export const curiseRouteDetail = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=route_detail', withCommonData(payload))
}

// 删除循环路线
export const curiseRouteDelete = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=del_route', withCommonData(payload))
}

// 机器人绑定巡航路线
export const bindRoute = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=route_with_imax', withCommonData(payload))
}

// 机器人巡航路线解绑
export const unbindRoute = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=delwith', withCommonData(payload))
}
