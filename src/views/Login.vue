<template>
  <div class="container">
    <div class="group">
      <div class="title">
        <div class="img-box">
          <img :src="logo" alt />
        </div>
        <div>扫码点单</div>
      </div>
      <van-field
        :border="false"
        class="input"
        label-align="center"
        label-width="80"
        left-icon="user-o"
        placeholder="请输入手机号"
        type="tel"
        v-model="phone"
      ></van-field>
      <van-field
        :border="false"
        class="input"
        label-align="center"
        label-width="80"
        left-icon="closed-eye"
        placeholder="请输入密码"
        type="password"
        v-if="!register"
        v-model="pwd"
      ></van-field>
      <van-field
        center
        class="input"
        clearable
        left-icon="envelop-o"
        placeholder="请输入短信验证码"
        v-if="register"
        v-model="sms"
      >
        <template #button>
          <van-button :disabled="timer" @click="_getSms" size="small" type="primary">{{ timer ? time : '发送验证码' }}</van-button>
        </template>
      </van-field>
      <van-field
        :border="false"
        class="input"
        label-align="center"
        label-width="80"
        left-icon="closed-eye"
        placeholder="请输入密码"
        type="password"
        v-if="register"
        v-model="pwd"
      ></van-field>

      <div @click="register = true" class="register" v-if="!register">点击注册</div>
      <div @click="register = false" class="register" v-else>点击登录</div>
      <van-button @click="_login" class="button" round type="primary" v-if="!register">登录</van-button>
      <van-button @click="_register" class="button" round type="primary" v-else>点击注册</van-button>
    </div>
    <!-- <img class="blur" src="@/assets/image/login_bg.jpeg" /> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'login',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      register: false,
      phone: '',
      pwd: '',
      sms: '',
      logo: '',
      time: 60,
      timer: null,
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getLogo().then(res => {
      this.logo = res
    })
  },

  destroyed() {},

  methods: {
    ...mapActions(['getLogo', 'login', 'getSms', 'registerAcc']),
    _login() {
      if (!this.phone || !this.pwd) {
        this.$toast({
          message: '请完善登录信息',
          duration: 1000,
        })
        return
      }
      this.login({ phone: this.phone, pwd: this.pwd }).then(res => {
        localStorage.setItem('ticket', res.user.ticket)
        localStorage.setItem('merchant_user', JSON.stringify(res.uid))
        this.$toast({
          icon: 'success',
          message: '登录成功',
          duration: 1000,
          onClose: () => {
            // if (this.$route.params.flag) {
            //   this.$router.replace({ path: `/order/${this.$route.params.id}/${this.$route.params.flag}` })
            // } else {
            //   this.$router.replace({ path: `/order/${this.$route.params.id}` })
            // }
            this.$goBack()
          },
        })
      })
    },
    _getSms() {
      if (!new RegExp(/^[1][3-9][0-9]{9}$/).test(this.phone)) {
        this.$toast({
          message: '请输入正确的手机号',
          duration: 1000,
        })
        return
      }
      this.getSms({
        phone: this.phone,
      }).then(() => {
        this.$toast({
          icon: 'success',
          message: '发送成功',
          duration: 1000,
        })
        this.timer = setInterval(() => {
          if (this.time <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.time = 60
          } else {
            this.time -= 1
          }
        }, 1000)
      })
    },
    _register() {
      if (!this.phone || !this.pwd || !this.sms) {
        this.$toast({
          message: '请完善注册信息',
          duration: 1000,
        })
        return
      }
      if (!new RegExp(/^[1][3-9][0-9]{9}$/).test(this.phone)) {
        this.$toast({
          message: '请输入正确的手机号',
          duration: 1000,
        })
        return
      }
      if (this.pwd.length < 6) {
        this.$toast({
          message: '密码最少6位',
          duration: 1000,
        })
        return
      }
      if (this.sms.length < 6) {
        this.$toast({
          message: '请输入6位验证码',
          duration: 1000,
        })
        return
      }
      console.log(this.$route)
      this.registerAcc({
        phone: this.phone,
        password: this.pwd,
        verify: this.sms,
      }).then(() => {
        this.$toast({
          icon: 'success',
          message: '注册成功，自动登录中',
          duration: 1500,
          onClose: () => {
            // if (this.$route.params.flag) {
            //   this.$router.replace({ path: `/order/${this.$route.params.id}/${this.$route.params.flag}` })
            // } else {
            //   this.$router.replace({ path: `/order/${this.$route.params.id}` })
            // }
            // console.log(this.$route)
            this.$router.replace({ name: 'Order', params: this.$route.params })
          },
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .blur {
    position: absolute;
    width: 108vw;
    height: 108vh;
    // filter: blur(10px);
    z-index: -10;
    top: -15px;
    left: -15px;
  }

  .group {
    margin-top: 60px;
    text-align: center;
    .title {
      text-align: center;
      font-size: 20px;
      color: rgb(102, 102, 102);
      margin-bottom: 60px;
      .img-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 28vw;
        box-shadow: 0 0 8px 1px #ccc;
        border: 1px solid #ccc;
        box-sizing: border-box;
        width: 31vw;
        height: 31vw;
        margin: 0 auto 15px;
        img {
          width: 27vw;
          height: 27vw;
          border-radius: 27vw;
        }
      }
    }

    .input {
      width: 300px;
      margin: 10px auto;
      background: transparent;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
      padding-left: 20px;
      /deep/.van-field__left-icon {
        color: @font-gray-c;
      }
      /deep/.van-field__control {
        color: @font-gray-c;
        padding-left: 20px;
      }
    }

    .button {
      width: 280px;
      margin-top: 70px;
    }

    .register {
      text-align: right;
      width: 300px;
      margin: 0 auto;
      color: #3b78dd;
      font-size: 12px;
      padding-right: 30px;
    }
  }
}
</style>
