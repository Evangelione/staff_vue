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

// 获取任务列表
export const taskList = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=taskList', withCommonData(payload))
}

// 操作任务（创建，修改）
export const modifyTask = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=task', withCommonData(payload))
}

// 任务取消
export const cancelTask = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=cancelTask', withCommonData(payload))
}

// 手动完成任务
export const completeTask = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=overTask', withCommonData(payload))
}

// 获取巡航点
export const cruisePointList = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=point', withCommonData(payload))
}

// 门店机器人列表
export const robotList = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=robotList', withCommonData(payload))
}

// 店员列表
export const staffList = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=staffListStore', withCommonData(payload))
}

// 获取单个任务详情
export const taskDetail = payload => {
  console.log(payload)
  return axios.post('/appapi.php?c=StorestaffTask&a=OneTask', withCommonData(payload))
}