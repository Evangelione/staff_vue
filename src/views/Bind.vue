<template>
  <div class="container">{{ msg }}</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'bind',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      msg: '正在绑定用户...',
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    // this.bindFlag().then(res => {
    //   console.log(res)
    // })
  },

  destroyed() {},

  methods: {
    ...mapActions(['bindFlag']),
  },
}
</script>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  text-align: center;
  line-height: 95vh;
}
</style>
