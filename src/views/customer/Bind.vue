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
    let staff = this.$route.params.staff ? this.$route.params.staff : 0
    this.bindFlag({
      order_no: this.$route.params.order,
      face_id: this.$route.params.face,
      staff_id: staff,
    }).then(res => {
      this.$router.replace({ path: `/order/${res.store_id}/${res.s_id}` })
    })
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
