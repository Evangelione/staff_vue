<template>
  <div>
    <van-nav-bar @click-left="$goBack" fixed left-arrow title="机器人巡航路线管理" />
    <div class="nav-bar-holder-sp"></div>
    <div>
      <van-panel :title="item.name" v-for="(item, index) in robotList" :key="index">
        <div>
          <div style="margin-top: 6px; color: #aaa;" v-if="item.route.length == 0">暂未绑定巡航路线</div>
          <div v-for="(item, index) in item.route" :key="index" style="margin: 8px 0px;">
            <div>
              <span style="color: #333; font-size: 16px;">{{ item.time }}</span>
              ：{{ item.name }}
              <van-button type="danger" size="mini" style="float:right;" @click="deleteRoute(item.id)">删除</van-button>
            </div>
            <div style="margin-top: 6px;">
              <span v-for="(item, index) in item.site" :key="index">
                <span v-if="index != 0">-></span>
                {{ item.site_name }}
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <van-button size="small" @click="goRobotRoute(item.id)">绑定路线</van-button>
        </template>
      </van-panel>
    </div>
  </div>
</template>

<script>
import { robotList, unbindRoute } from '@/api/staff/curise'
export default {
  name: 'RobotRoute',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      robotList: [],
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getRobotList()
  },

  destroyed() {},

  methods: {
    getRobotList() {
      robotList().then(res => {
        console.log(res)
        this.robotList = res
      })
    },
    goRobotRoute(id) {
      this.$router.push({
        path: `/staff/curise/routeBind/${id}`,
      })
    },
    deleteRoute(id) {
      unbindRoute({ id }).then(() => {
        this.$toast({
          type: 'success',
          duration: 800,
          message: '路线解绑成功',
          forbidClick: true,
          onClose: () => {
            this.getRobotList()
          },
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.van-panel__content {
  font-size: 13px;
  color: #666;
  padding: 12px 16px;
}

.van-panel__footer {
  text-align: right;
}
</style>
