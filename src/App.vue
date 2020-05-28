<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'login',

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

  methods: {},
}
</script>

<style lang="less">
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
  background-color: #f3f3f3;
}

.nav-bar-holder {
  height: 46px;

  &-sp {
    height: 54px;
  }
}

.tab-bar-holder {
  height: 50px;

  &-sp {
    height: 58px;
  }
}

// iphoneX、iphoneXs
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .tab-bar-holder {
    height: 90px;

    &-sp {
      height: 98px;
    }
  }
}

// iphone Xs Max
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  .tab-bar-holder {
    height: 90px;

    &-sp {
      height: 98px;
    }
  }
}

// iphone XR
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  .tab-bar-holder {
    height: 90px;

    &-sp {
      height: 98px;
    }
  }
}

.wing-blank {
  margin-left: 8px;
  margin-right: 8px;
  box-sizing: border-box;
  &-lg {
    margin-left: 16px;
    margin-right: 16px;
    box-sizing: border-box;
  }
}

.white-space {
  height: 8px;
  &-lg {
    height: 16px;
  }
}
</style>
