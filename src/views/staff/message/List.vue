<template>
  <div>
    <van-nav-bar @click-left="$goBack" fixed left-arrow title="消息列表" />
    <div class="nav-bar-holder"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'systemMessage',
  mixins: [],

  components: {},

  props: {},

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this._getMessageList()
  },

  destroyed() {},

  methods: {
    ...mapActions('staff', ['getMessageList']),
    _getMessageList() {
      this.getMessageList().then(res => {
        console.log(res)
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
