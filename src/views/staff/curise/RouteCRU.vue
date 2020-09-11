<template>
  <div>
    <van-nav-bar @click-left="$goBack" fixed left-arrow title="巡航路线创建" />
    <div class="nav-bar-holder-sp"></div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="name"
        name="name"
        :rules="[{ required: true, message: '请填写路线名称' }]"
        label="路线名称"
        placeholder="请输入巡航路线名称"
      />
      <van-cell-group title="地图巡航点">
        <van-field
          name="site_ids"
          :rules="[{ validator, message: '请选择至少2个巡航点' }]"
          :label="item.map_name"
          v-for="(item, index) in pointList"
          :key="index"
        >
          <template #input>
            <van-checkbox-group v-model="checkbox" direction="horizontal">
              <van-checkbox
                v-model="checkbox"
                :name="item.id"
                shape="square"
                v-for="(item, index) in item.site"
                :key="index"
              >
                {{ item.site_name }}
              </van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>
        <van-cell v-if="pointList.length == 0">暂未设置巡航点，请先设置巡航点</van-cell>
      </van-cell-group>
      <div class="box">
        <div>巡航顺序：</div>
        <span v-if="!labelArr.length">按顺序选择巡航点，会生成巡航路线</span>
        <span v-for="(item, index) in labelArr" :key="index">
          <span v-if="index != 0">-></span>
          {{ item }}
        </span>
      </div>
      <div style="margin: 16px;">
        <van-button block round style="margin-top:10px;" :loading="loading">保存</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { pointList, modifyCuriseRoute, curiseRouteDetail } from '@/api/staff/curise'
export default {
  name: '',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      name: '',
      pointList: [],
      siteList: [],
      checkbox: [],
      loading: false,
    }
  },

  computed: {
    labelArr() {
      let arr = this.checkbox.map(item => {
        const site = this.siteList.find(site => {
          if (site.id == item) {
            return site
          }
        })
        return site.site_name
      })
      return arr
    },
  },

  watch: {},

  created() {},

  mounted() {
    const { id } = this.$route.params
    console.log(id)
    id &&
      curiseRouteDetail({ id }).then(res => {
        console.log(res)
        this.name = res.name
        this.checkbox = JSON.parse(res.site_ids)
      })
    var session_storestaff_store_staff = sessionStorage.getItem('session_storestaff_store_staff')
    var obj = {
      store_id: '',
    }
    if (session_storestaff_store_staff) {
      obj = JSON.parse(session_storestaff_store_staff.substr(5))
    }
    pointList({
      store_id: obj.store_id,
    }).then(res => {
      this.pointList = res
      let siteList = []
      res.forEach(item => {
        item.site.forEach(site => {
          siteList.push(site)
        })
      })
      this.siteList = siteList
      console.log(this.siteList)
    })
  },

  destroyed() {},

  methods: {
    validator(val) {
      return val.length > 1
    },
    onSubmit() {
      const { id } = this.$route.params
      this.loading = true
      console.log(this.checkbox)
      modifyCuriseRoute({
        id: id,
        name: this.name,
        site_ids: this.checkbox,
      })
        .then(res => {
          this.loading = false
          console.log(res)
          this.$toast({
            type: 'success',
            duration: 800,
            message: '路线保存成功',
            forbidClick: true,
            onClose: () => {
              this.$router.replace({
                path: '/staff/curise/routeManager',
              })
            },
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.box {
  margin-top: 14px;
  font-size: 13px;
  padding: 0 12px;
  color: #666;
  div {
    margin-bottom: 6px;
  }
}
</style>
