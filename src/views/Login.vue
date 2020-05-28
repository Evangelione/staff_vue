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
        placeholder="请输入账号"
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
        v-model="pwd"
      ></van-field>
      <van-button @click="_login" class="button" round type="primary">登录</van-button>
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
      phone: '',
      pwd: '',
      logo: '',
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
    ...mapActions(['getLogo', 'login']),
    _login() {
      this.login({ phone: this.phone, pwd: this.pwd }).then(res => {
        localStorage.setItem('ticket', res.user.ticket)
        localStorage.setItem('merchant_user', JSON.stringify(res.uid))
        this.$toast({
          icon: 'success',
          message: '登录成功',
          duration: 1000,
          onClose: () => {
            this.$router.replace({ path: `/order/${this.$route.params.id}/${this.$route.params.flag}` })
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
  }
}
</style>
