<template>
  <div>
    <van-nav-bar @click-left="$goBack" left-arrow title="创建任务" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.name"
        name="name"
        label="任务名称"
        placeholder="请输入任务名称"
        :rules="[{ required: true, message: '任务名称必填' }]"
      />
      <van-field
        readonly
        clickable
        name="designate_type"
        :value="designateType"
        label="执行人类型"
        placeholder="选择类型"
        @click="
          currentPicker = 'designate_type'
          defaultIndex = roleTypeOption.findIndex(item => {
            if (item.value == form.designate_type) {
              return item
            }
          })
          columns = roleTypeOption
          showPicker = true
        "
      />
      <van-field
        readonly
        clickable
        name="designate_id"
        :value="designateLabel"
        label="执行人"
        placeholder="选择执行人"
        @click="
          currentPicker = 'designate_id'
          defaultIndex = roleOption.findIndex(item => {
            if (item.value == form.designate_id) {
              return item
            }
          })
          columns = roleOption
          showPicker = true
        "
      />
      <van-field
        v-model="form.sort"
        name="sort"
        label="任务权重"
        placeholder="0-100的数字，越小权重越高"
        :rules="[{ required: true, message: '任务名称必填' }]"
      />
      <van-field v-model="form.query" name="query" label="任务说明" placeholder="请输入说明" />
      <van-field
        readonly
        clickable
        name="type"
        :value="typeLabel"
        label="任务类型"
        placeholder="选择类型"
        @click="
          currentPicker = 'type'
          defaultIndex = typeOption.findIndex(item => {
            if (item.value == form.type) {
              return item
            }
          })
          columns = typeOption
          showPicker = true
        "
      />
      <van-field
        readonly
        clickable
        v-if="form.type == 1 && form.designate_type == 2"
        name="consignee"
        :value="consigneeLabel"
        label="收货人"
        placeholder="选择收货人"
        @click="
          currentPicker = 'consignee'
          columns = staffList
          showPicker = true
        "
      />
      <van-field
        readonly
        clickable
        v-if="form.designate_type == 2"
        name="site_id"
        :value="siteLabel"
        label="目标地点"
        placeholder="选择目标地点"
        @click="
          currentPicker = 'site_id'
          columns = pointList
          defaultIndex = 0
          showPicker = true
        "
      />
      <div style="margin: 16px">
        <van-button type="primary" block native-type="submit" :loading="loading">提交</van-button>
      </div>
    </van-form>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        :defaultIndex="defaultIndex"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { robotList, staffList, modifyTask, taskDetail, cruisePointListByRobot } from '@/api/staff/task'

export default {
  name: 'TaskCRU',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      form: {
        name: '',
        designate_type: '',
        designate_id: '',
        sort: '',
        query: '',
        consignee: '',
        type: '',
        site_id: '',
      },
      columns: [],
      roleTypeOption: [
        { text: '员工', value: 1 },
        { text: '机器人', value: 2 },
      ],
      typeOption: [
        { text: '送货', value: 1 },
        { text: '取货', value: 2 },
        { text: '导航', value: 3 },
      ],
      showPicker: false,
      currentPicker: '',
      robotList: [],
      staffList: [],
      pointList: [],
      defaultIndex: 0,
    }
  },

  computed: {
    designateType() {
      const item = this.roleTypeOption.find(item => {
        if (item.value == this.form.designate_type) {
          return item
        }
      })
      return item && item.text
    },
    roleOption() {
      if (this.form.designate_type == 1) {
        return this.staffList
      } else if (this.form.designate_type == 2) {
        return this.robotList
      } else {
        return []
      }
    },
    designateLabel() {
      const item = this.roleOption.find(item => {
        if (item.value == this.form.designate_id) {
          return item
        }
      })
      return item && item.text
    },
    typeLabel() {
      const item = this.typeOption.find(item => {
        if (item.value == this.form.type) {
          return item
        }
      })
      return item && item.text
    },
    consigneeLabel() {
      const item = this.staffList.find(item => {
        if (item.value == this.form.consignee) {
          return item
        }
      })
      return item && item.text
    },
    siteLabel() {
      let label = ''
      this.pointList.find(item => {
        item.children.find(child => {
          if (child.id == this.form.site_id) {
            label = item.map_name + ' - ' + child.mark_name
            return child
          }
        })
      })
      return label
    },
  },

  watch: {},

  created() {},

  mounted() {
    const { id } = this.$route.params
    id &&
      taskDetail({ id }).then(res => {
        console.log(res)
        this.form = {
          name: res.name,
          designate_type: res.designate_type - 0,
          designate_id: res.designate_id - 0,
          sort: res.sort,
          query: res.query,
          consignee: res.consignee == 0 ? '' : res.consignee,
          type: res.type - 0,
          site_id: res.site_id,
        }
        cruisePointListByRobot({ device_id: res.designate_id }).then(res => {
          this.pointList = res.map(item => {
            item.text = item.map_name
            item.children = item.site.map(child => {
              child.text = child.mark_name
              return child
            })
            return item
          })
        })
      })
    robotList().then(res => {
      console.log(res)
      this.robotList = res.map(item => {
        item.text = item.imax_name
        item.value = item.id
        return item
      })
    })
    staffList().then(res => {
      console.log(res)
      this.staffList = res.map(item => {
        item.text = item.name
        item.value = item.id
        return item
      })
    })
  },

  destroyed() {},

  methods: {
    onConfirm(data, index) {
      console.log(this.currentPicker)
      if (this.currentPicker == 'designate_type') {
        if (data.value == 1) {
          this.typeOption = [
            { text: '重要+紧急', value: 1 },
            { text: '重要+不紧急', value: 2 },
            { text: '不重要+紧急', value: 3 },
            { text: '不重要+不紧急', value: 4 },
          ]
        } else {
          this.typeOption = [
            { text: '送货', value: 1 },
            { text: '取货', value: 2 },
            { text: '导航', value: 3 },
          ]
        }
        this.form.designate_id = ''
      }
      if (this.currentPicker == 'designate_id') {
        cruisePointListByRobot({ device_id: data.id }).then(res => {
          this.pointList = res.map(item => {
            item.text = item.map_name
            item.children = item.site.map(child => {
              child.text = child.mark_name
              return child
            })
            return item
          })
        })
      }
      this.form[this.currentPicker] = data.value
      if (this.currentPicker == 'site_id') {
        console.log(this.pointList[index[0]].map_en, this.pointList[index[0]].children[index[1]].id)
        this.form.site_id = this.pointList[index[0]].children[index[1]].id
      }
      this.showPicker = false
    },
    onSubmit(values) {
      this.loading = true
      const { id } = this.$route.params
      if (id) {
        this.form.id = id
      }
      console.log('submit', values)
      console.log(this.form)
      modifyTask(this.form)
        .then(res => {
          console.log(res)
          this.$toast.success('提交成功')
          this.loading = false
          this.$router.replace({
            path: '/staff/task',
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="less" scoped></style>
