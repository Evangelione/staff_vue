<template>
  <div>
    <van-nav-bar @click-left="$goBack" left-arrow title="任务列表" right-text="创建任务" @click-right="_goCRU" />
    <van-dropdown-menu :close-on-click-outside="false">
      <van-dropdown-item v-model="status" :options="statusOption" @change="_onRefresh" />
      <van-dropdown-item ref="roleRef" title="执行人" v-if="status == 2 || status == 3 || status == 4">
        <van-field
          label="执行人类型"
          :value="roleTypeLabel"
          @click="_openRoleTypePicker"
          input-align="right"
          is-link
          placeholder="选择执行人类型"
          readonly
        />
        <van-field
          label="任务类型"
          :value="typeLabel"
          @click="_openTypePicker"
          input-align="right"
          is-link
          placeholder="选择任务类型"
          readonly
        />
        <van-field
          label="执行人"
          :value="roleLabel"
          @click="_openRolePicker"
          input-align="right"
          is-link
          placeholder="选择执行人"
          readonly
        />
        <van-button @click="_searchRole" block type="primary">筛选</van-button>
      </van-dropdown-item>
      <van-dropdown-item ref="timeRef" title="时间筛选">
        <van-field
          label="开始时间"
          :value="startTimeLabel"
          @click="_controlStartTimePicker"
          input-align="right"
          is-link
          placeholder="选择开始时间"
          readonly
        />
        <van-field
          label="结束时间"
          :value="endTimeLabel"
          @click="_controlEndTimePicker"
          input-align="right"
          is-link
          placeholder="选择结束时间"
          readonly
        />
        <van-button @click="_search" block type="primary">筛选</van-button>
      </van-dropdown-item>
    </van-dropdown-menu>
    <!-- 开始时间 -->
    <van-popup position="bottom" safe-area-inset-bottom v-model="showStartTimePicker">
      <van-datetime-picker
        :formatter="$timeFormatter"
        :max-date="endTime"
        :swipe-duration="300"
        :value="startTime"
        @cancel="_controlStartTimePicker"
        @confirm="_pickStartTime"
      />
    </van-popup>
    <!-- 结束时间 -->
    <van-popup position="bottom" safe-area-inset-bottom v-model="showEndTimePicker">
      <van-datetime-picker
        :formatter="$timeFormatter"
        :min-date="startTime"
        :swipe-duration="300"
        :value="endTime"
        @cancel="_controlEndTimePicker"
        @confirm="_pickEndTime"
      />
    </van-popup>
    <!-- 执行人类型 -->
    <van-popup position="bottom" safe-area-inset-bottom v-model="showRoleTypePicker">
      <van-picker
        title="执行人类型"
        show-toolbar
        :columns="roleTypeOption"
        @confirm="_onPickeRoleType"
        @cancel="_onCancelRoleType"
      />
    </van-popup>
    <!-- 任务类型 -->
    <van-popup position="bottom" safe-area-inset-bottom v-model="showTypePicker">
      <van-picker title="任务类型" show-toolbar :columns="typeOption" @confirm="_onPickeType" @cancel="_onCancelType" />
    </van-popup>
    <!-- 执行人 -->
    <van-popup position="bottom" safe-area-inset-bottom v-model="showRolePicker">
      <van-picker title="执行人" show-toolbar :columns="roleOption" @confirm="_onPickeRole" @cancel="_onCancelRole" />
    </van-popup>

    <van-dialog
      v-model="showCancelDialog"
      title="取消任务"
      show-cancel-button
      @confirm="cancelTask"
      @cancel="reason = ''"
    >
      <van-field input-align="center" v-model="reason" placeholder="请输入取消原因" />
    </van-dialog>

    <div v-for="(item, index) in taskList" :key="index">
      <van-panel :title="item.name" :desc="item.query" :status="_typeLabel(item)" style="margin-bottom: 6px;">
        <div>执行人：{{ item.people.name || item.people.imax_name }}</div>
        <div>执行人类型：{{ item.designate_type == '1' ? '店员' : '机器人' }}</div>
        <div v-if="item.type == 1 && item.designate_type == '2'">收货人：{{ item.people.name }}</div>
        <div>指派时间：{{ $moment(item.designate_time * 1000).format('YYYY-MM-DD HH:mm') }}</div>
        <template #footer v-if="status == 1 || status == 2 || status == 3">
          <van-button
            v-if="status == 1 || status == 2 || status == 3"
            size="small"
            type="danger"
            @click="
              showCancelDialog = true
              curCancelId = item.id
            "
          >
            取消任务
          </van-button>
          <van-button v-if="status == 2 || status == 3" size="small" type="primary" @click="completeTask(item.id)">
            任务完成
          </van-button>
          <van-button size="small" v-if="status == 1 || status == 2 || status == 3" @click="goEdit(item.id)">
            {{ status == 1 ? '指派任务' : '修改任务' }}
          </van-button>
        </template>
      </van-panel>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { taskList, modifyTask, robotList, staffList, cancelTask, completeTask, cruisePointList } from '@/api/staff/task'
export default {
  name: 'TaskList',
  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      type: '',
      typeOption: [],
      status: 1,
      statusOption: [
        { text: '已取消', value: 0 },
        { text: '未指派', value: 1 },
        { text: '已指派', value: 2 },
        { text: '进行中', value: 3 },
        { text: '已完成', value: 4 },
      ],
      roleTypeOption: [
        { text: '员工', value: 1 },
        { text: '机器人', value: 2 },
      ],
      role_type: '',
      roleOption: [],
      role_id: '',
      startTime: new Date(this.$moment().subtract(30, 'days')),
      endTime: new Date(),
      showStartTimePicker: false,
      showEndTimePicker: false,
      showRoleTypePicker: false,
      showTypePicker: false,
      showRolePicker: false,
      showCancelDialog: false,
      taskList: [],
      reason: '',
      curCancelId: '',
    }
  },

  computed: {
    // 开始时间非空验证
    startTimeLabel() {
      console.log(this.startTime)
      return this.$moment(this.startTime).format('YYYY-MM-DD HH:mm')
    },
    // 结束时间非空验证
    endTimeLabel() {
      return this.$moment(this.endTime).format('YYYY-MM-DD HH:mm')
    },
    roleTypeLabel() {
      const roleType = this.roleTypeOption.find(item => {
        if (item.value === this.role_type) {
          return item
        }
      })
      console.log(roleType)
      return roleType && roleType.text
    },
    typeLabel() {
      const type = this.typeOption.find(item => {
        if (item.value === this.type) {
          return item
        }
      })
      console.log(type)
      return type && type.text
    },
    roleLabel() {
      const role = this.roleOption.find(item => {
        if (item.value === this.role_id) {
          return item
        }
      })
      return role && role.text
    },
  },

  watch: {},

  created() {},

  mounted() {
    this._onRefresh()
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
      this.roleOption = this.staffList
    })
  },

  destroyed() {},

  methods: {
    _onRefresh() {
      taskList({
        status: this.status,
        designate_type: this.role_type,
        type: this.type,
        designate_id: this.role_id,
        s_time: this.$moment(this.startTime).format('YYYY-MM-DD HH:mm'),
        e_time: this.$moment(this.endTime).format('YYYY-MM-DD HH:mm'),
      }).then(res => {
        this.taskList = res
        console.log(res)
      })
    },
    _pickStartTime(data) {
      this.startTime = new Date(this.$moment(data))
      this.showStartTimePicker = false
    },
    _pickEndTime(data) {
      this.endTime = new Date(this.$moment(data))
      this.showEndTimePicker = false
    },
    _search() {
      this._onRefresh()
      this.$refs.timeRef.toggle()
    },
    _searchRole() {
      this._onRefresh()
      this.$refs.roleRef.toggle()
    },
    _controlStartTimePicker() {
      this.showStartTimePicker = !this.showStartTimePicker
    },
    _controlEndTimePicker() {
      this.showEndTimePicker = !this.showEndTimePicker
    },
    _openTypePicker() {
      this.showTypePicker = true
    },
    _onPickeType(data) {
      console.log(data)
      this.type = data.value
      this._onCancelType()
    },

    _onCancelType() {
      this.showTypePicker = false
    },
    _openRolePicker() {
      this.showRolePicker = true
    },
    _openRoleTypePicker() {
      this.showRoleTypePicker = true
    },
    _onPickeRole(data) {
      console.log(data)
      this.role_id = data.value
      this._onCancelRole()
    },
    _onCancelRole() {
      this.showRolePicker = false
    },
    _onPickeRoleType(data) {
      console.log(data)
      this.role_type = data.value
      this._onCancelRoleType()
      this.type = ''
      this.role_id = ''
      this._onRoleTypeChange(data.value)
    },
    _onCancelRoleType() {
      this.showRoleTypePicker = false
    },
    _modifyTask() {
      modifyTask({
        id: '',
        designate_type: '',
        designate_id: '',
        name: '',
        query: '',
        type: '',
      }).then(res => {
        console.log(res)
      })
    },
    _onRoleTypeChange(value) {
      console.log(value)
      if (value == 1) {
        this.typeOption = [
          { text: '重要+紧急', value: 1 },
          { text: '重要+不紧急', value: 2 },
          { text: '不重要+紧急', value: 3 },
          { text: '不重要+不紧急', value: 4 },
        ]
        this.roleOption = this.staffList
      } else {
        this.typeOption = [
          { text: '送货', value: 1 },
          { text: '取货', value: 2 },
          { text: '导航', value: 3 },
        ]
        this.roleOption = this.robotList
      }
    },
    _goCRU() {
      this.$router.push({
        path: '/staff/task/create',
      })
    },
    goEdit(id) {
      this.$router.push({
        path: `/staff/task/create/${id}`,
      })
    },
    cancelTask() {
      if (this.reason == '') {
        this.$toast.fail('取消原因必填')
        return
      }
      cancelTask({ id: this.curCancelId, reason: this.reason }).then(() => {
        this.$toast.success('任务取消成功')
        this._onRefresh()
      })
    },
    completeTask(id) {
      completeTask({ id }).then(() => {
        this.$toast.success('任务完成')
        this._onRefresh()
      })
    },
    _typeLabel(item) {
      let label = '无'
      switch (item.type) {
        case '1':
          label = '送货'
          break
        case '2':
          label = '取货'
          break
        case '3':
          label = '导航'
          break
      }
      return label
    },
  },
}
</script>

<style lang="less" scoped>
.van-panel__content {
  padding: 12px 16px;
  font-size: 13px;
  color: #666;
}
.van-panel__footer {
  .van-button {
    margin-left: 6px;
  }
  text-align: right;
}
</style>
