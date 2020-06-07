<template>
  <div>
    首页
    <van-button @click="_goLogin">跳转登录</van-button>
  </div>
</template>

<script>
export default {
  name: 'index',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
    _goLogin() {
      this.$router.push({
        name: 'Login',
        params: {
          id: 313,
          flag: 63,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
