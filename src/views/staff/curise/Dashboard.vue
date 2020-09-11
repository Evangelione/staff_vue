<template>
  <div>
    <van-nav-bar @click-left="$goBack" fixed left-arrow title="巡航路线" />
    <div class="nav-bar-holder-sp"></div>
    <van-cell title="路线管理" @click="goRouteCreate" is-link />
    <van-cell title="绑定路线" @click="goRouteBind" is-link />
  </div>
</template>

<script>
export default {
  name: '',

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
    goRouteCreate() {
      this.$router.push({
        path: '/staff/curise/routeManager',
      })
    },
    goRouteBind() {
      this.$router.push({
        path: '/staff/curise/robotRoute',
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
