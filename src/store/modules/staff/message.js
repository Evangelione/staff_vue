import staffAPI from '@/api/staff/index'

export default {
  // 读取消息列表
  getMessageList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getMessageList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 处理消息
  dealMessage(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.dealMessage(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
}
