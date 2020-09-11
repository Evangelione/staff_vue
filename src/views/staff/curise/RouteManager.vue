<template>
  <div>
    <van-nav-bar
      @click-left="$goBack"
      fixed
      left-arrow
      title="巡航路线管理"
      right-text="创建路线"
      @click-right="goRouteCreate"
    />
    <div class="nav-bar-holder"></div>
    <van-cell-group v-for="(item, index) in routeList" :key="index" :title="item.name">
      <van-swipe-cell>
        <van-cell label="左滑删除" clickable @click="goRouteCRU(item.id)">
          <template #title>
            <span v-for="(item, index) in item.site" :key="index">
              <span v-if="index != 0">-></span>
              {{ item.site_name }}
            </span>
          </template>
        </van-cell>
        <template #right>
          <van-button square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { curiseRouteList } from '@/api/staff/curise'

export default {
  name: 'RouteManager',
  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      routeList: [],
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    curiseRouteList().then(res => {
      this.routeList = res
      console.log(res)
    })
  },

  destroyed() {},

  methods: {
    goRouteCreate() {
      this.$router.push({
        path: '/staff/curise/routeCRU',
      })
    },
    goRouteCRU(id) {
      this.$router.push({
        path: `/staff/curise/routeCRU/${id}`,
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
