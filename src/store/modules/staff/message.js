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
}
