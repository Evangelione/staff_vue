import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { Notify, Toast } from 'vant'
import errorcode from '@/common/errorcode'

// axios全局请求拦截
axios.interceptors.request.use(
  config => {
    // Toast.loading({
    //   message: '加载中...',
    //   forbidClick: true,
    //   duration: 0,
    // })

    // 转为formdata数据格式
    config.data = qs.stringify(config.data)
    return config
  },
  error => {
    Toast.fail(error.message)
  }
)
axios.interceptors.response.use(
  config => {
    // Toast.clear()
    if (config.data.errorCode != errorcode.SUCCESS) {
      if (config.data.errorCode == errorcode.OCCUPIED) {
        Toast({
          message: config.data.errorMsg,
          icon: 'warn-o',
          forbidClick: true,
          duration: 1000,
          onClose: () => {
            router.go(-1)
          },
        })
        return false
      }
      // 兼容上传oss图片错误
      if (config.data.error == errorcode.SUCCESS) {
        return config.data.msg
      }
      // 兼容获取logo
      if (config.data.code == 200) {
        return config.data.wap_merchant_logo
      }
      // 是否为登录验证过期
      if (config.data.errorCode == errorcode.NOTICKET || config.data.errorCode == errorcode.TIMEOUT) {
        let route = router.app._route
        if (route.name != 'Login') {
          Toast({
            message: '请重新登录',
            icon: 'warn-o',
            forbidClick: true,
            duration: 1500,
            onClose: () => {
              localStorage.removeItem('ticket')
              if (route.path.indexOf('order') > -1) {
                router.push({ name: 'Login', params: router.app._route.params })
              } else if (route.path.indexOf('staffOrder') > -1) {
                window.location.href = 'http://www.9youke.com/packapp/storestaff/login.html'
              } else {
                router.push({ name: 'Login', params: router.app._route.params })
              }
            },
          })
        }
        return false
      }
      if (config.data.errorCode == errorcode.WX) {
        window.location.href = config.data.result.referer
        return false
      }
      // 是否非法操作
      if (!config.data.errorCode) {
        Toast({
          message: '后台接口未配置，请联系后台管理员',
          duration: 1500,
        })
        return false
      }
      Notify({ type: 'warning', message: config.data.errorMsg })
    }
    return config.data.result
  },
  error => {
    Toast.fail(error.message)
  }
)
