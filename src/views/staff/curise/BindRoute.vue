<template>
  <div>
    <van-nav-bar @click-left="$goBack" fixed left-arrow title="巡航路线绑定" />
    <div class="nav-bar-holder-sp"></div>
    <van-form @submit="onSubmit">
      <van-field
        readonly
        clickable
        name="time"
        :value="form.time"
        label="时间选择"
        placeholder="点击选择时间"
        @click="show = true"
      />
      <van-field
        readonly
        clickable
        name="time"
        :value="routeLabel"
        label="选择路线"
        placeholder="点击选择路线"
        @click="showRoute = true"
      />
      <div style="margin: 16px;">
        <van-button round block native-type="submit" :loading="loading">
          提交
        </van-button>
      </div>
    </van-form>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker type="time" title="选择时间" @confirm="pickTime" @cancel="show = false" />
    </van-popup>
    <van-popup v-model="showRoute" position="bottom">
      <van-picker show-toolbar :columns="columns" @confirm="pickeRoute" @cancel="showRoute = false" />
    </van-popup>
  </div>
</template>

<script>
import { curiseRouteList, bindRoute } from '@/api/staff/curise'
export default {
  name: 'BindRoute',
  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      show: false,
      showRoute: false,
      columns: [],
      form: {
        time: '',
        route_id: '',
      },
      routeLabel: '',
      loading: false,
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    curiseRouteList().then(res => {
      console.log(res)
      this.columns = res.map(item => {
        item.text = item.name
        return item
      })
    })
  },

  destroyed() {},

  methods: {
    pickTime(value) {
      console.log(value)
      this.form.time = value
      this.show = false
    },
    pickeRoute(value) {
      this.routeLabel = value.text
      this.form.route_id = value.id
      console.log(value)
      this.showRoute = false
    },
    onSubmit() {
      this.loading = true
      const { id } = this.$route.params
      this.form.imax_id = id
      bindRoute({ ...this.form })
        .then(res => {
          this.loading = false
          this.$toast({
            type: 'success',
            duration: 800,
            message: '路线绑定成功',
            forbidClick: true,
            onClose: () => {
              this.$router.replace({
                path: '/staff/curise/robotRoute',
              })
            },
          })
          console.log(res)
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="less" scoped></style>
