import axios from 'axios'

export default {
  // 读取消息列表
  getMessageList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=staffMessageList', {
      ...payload,
      'Device-Id': 'packapp',
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 处理消息
  dealMessage: payload =>
    axios.post('/appapi.php?c=Storestaff&a=dealStaffMessage', {
      ...payload,
      'Device-Id': 'packapp',
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
}
