<!--
  功能：开始时间，结束时间组件（验证非空）
  作者：cc
  时间：2019年11月20日
  版本：v1.0
  修改记录：
  修改内容：
  修改人员：
  修改时间：
  备注：  如需验证，则包在ValidationObserver内使用，并传入需要验证的字段
  props：
    startTimeLabel<String>：开始时间label
    startTimeField<String>：开始时间验证字段
    endTimeLabel<String>：结束时间label
    endTimeField<String>：结束时间验证字段
    data<Object>：默认时间 只接受 2000-01-01 或者 10位时间戳
    pickStartTime<Function>：返回选中的开始时间到父组件
    pickEndTime<Function>：返回选中的结束时间到父组件
    showDefault<Boolean>：在DropdownMenu中使用时，是否展示初始值

    示例：
    <time-picker
          :data="[formData.start_time, formData.end_time]"
          :pickEndTime="_pickEndTime"
          :pickStartTime="_pickStartTime"
          endField="预约结束时间"
          endLabel="预约结束时间"
          startField="预约开始时间"
          startLabel="预约开始时间"
        ></time-picker>
-->
<template>
  <div>
    <ValidationProvider :name="startField" :rules="startField ? 'required' : null" slim v-slot="{ errors }">
      <van-field
        :disabled="disabled"
        :error-message="errors[0]"
        :label="startLabel"
        :required="!!startField"
        :value="startTimeLabel"
        @click="_controlStartTimePicker"
        error-message-align="right"
        input-align="right"
        is-link
        placeholder="选择开始时间"
        readonly
      ></van-field>
    </ValidationProvider>
    <ValidationProvider :name="endField" :rules="endField ? 'required' : null" slim v-slot="{ errors }">
      <van-field
        :disabled="disabled"
        :error-message="errors[0]"
        :label="endLabel"
        :required="!!endField"
        :value="endTimeLabel"
        @click="_controlEndTimePicker"
        error-message-align="right"
        input-align="right"
        is-link
        placeholder="选择结束时间"
        readonly
      ></van-field>
    </ValidationProvider>
    <!-- 弹出层 -->
    <!-- 开始时间 -->
    <van-popup position="bottom" safe-area-inset-bottom v-if="type !== 'time'" v-model="showStartTimePicker">
      <van-datetime-picker
        :formatter="$timeFormatter"
        :max-date="endTime"
        :swipe-duration="300"
        :type="type"
        :value="startTime"
        @cancel="_controlStartTimePicker"
        @confirm="_pickStartTime"
      />
    </van-popup>
    <!-- time类型 -->
    <van-popup position="bottom" safe-area-inset-bottom v-else v-model="showStartTimePicker">
      <van-datetime-picker
        :max-hour="maxHour"
        :max-minute="maxMinute"
        :swipe-duration="300"
        :type="type"
        :value="startTime"
        @cancel="_controlStartTimePicker"
        @change="_changeStartTime"
        @confirm="_pickStartTime"
        cancel-button-text="关闭"
      />
    </van-popup>
    <!-- 结束时间 -->
    <van-popup position="bottom" safe-area-inset-bottom v-if="type !== 'time'" v-model="showEndTimePicker">
      <van-datetime-picker
        :formatter="$timeFormatter"
        :min-date="startTime"
        :swipe-duration="300"
        :type="type"
        :value="endTime"
        @cancel="_controlEndTimePicker"
        @confirm="_pickEndTime"
      />
    </van-popup>
    <!-- time类型 -->
    <van-popup position="bottom" safe-area-inset-bottom v-else v-model="showEndTimePicker">
      <van-datetime-picker
        :min-hour="minHour"
        :min-minute="minMinute"
        :swipe-duration="300"
        :type="type"
        :value="endTime"
        @cancel="_controlEndTimePicker"
        @change="_changeEndTime"
        @confirm="_pickEndTime"
        cancel-button-text="关闭"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'timePicker',

  mixins: [],

  components: {},

  props: {
    startLabel: {
      type: String,
      required: true,
    },
    startField: String,
    endLabel: {
      type: String,
      required: true,
    },
    endField: String,
    data: Array,
    type: {
      type: String,
      default: 'date',
    },
    pickStartTime: {
      type: Function,
      required: true,
    },
    pickEndTime: {
      type: Function,
      required: true,
    },
    disabled: Boolean,
    showDefault: Boolean,
  },

  data() {
    return {
      showStartTimePicker: false,
      showEndTimePicker: false,
      showStartTimeLabel: false,
      showEndTimeLabel: false,
      startTime: new Date(this.$moment().subtract(30, 'days')),
      endTime: new Date(),
    }
  },

  computed: {
    // 开始时间非空验证
    startTimeLabel() {
      if (this.showStartTimeLabel) {
        if (this.type !== 'time') {
          if (this.type === 'datetime') {
            return this.$moment(this.startTime).format('YYYY-MM-DD HH:mm')
          }
          return this.$moment(this.startTime).format('YYYY-MM-DD')
        }
        return this.startTime
      } else {
        return ''
      }
    },
    // 结束时间非空验证
    endTimeLabel() {
      if (this.showEndTimeLabel) {
        if (this.type !== 'time') {
          if (this.type === 'datetime') {
            return this.$moment(this.endTime).format('YYYY-MM-DD HH:mm')
          }
          return this.$moment(this.endTime).format('YYYY-MM-DD')
        }
        return this.endTime
      } else {
        return ''
      }
    },
    minHour() {
      return this.type === 'time' ? Number(this.startTime.split(':')[0]) : ''
    },
    minMinute() {
      if (this.startTime.split(':')[0] === this.endTime.split(':')[0]) {
        return this.type === 'time' ? Number(this.startTime.split(':')[1]) : ''
      }
      return 0
    },
    maxHour() {
      return this.type === 'time' ? Number(this.endTime.split(':')[0]) : ''
    },
    maxMinute() {
      if (this.startTime.split(':')[0] === this.endTime.split(':')[0]) {
        return this.type === 'time' ? Number(this.endTime.split(':')[1]) : ''
      }
      return 59
    },
  },

  watch: {
    data() {
      // 判断是否为有效数据，如不是则按默认数据展示
      if (this.data && this.data[0] !== '' && this.data[0] !== '0' && this.data[1] !== '' && this.data[1] !== '0') {
        // 有效数据，且类型为time，则直接赋值
        if (this.type === 'time') {
          this.startTime = this.data[0]
          this.endTime = this.data[1]
        } else {
          if (isNaN(this.data[0] - 0)) {
            // 2000-01-01类型处理
            this.startTime = new Date(this.$moment(this.data[0]))
          } else {
            // 10位时间戳类型处理
            this.startTime = new Date(this.$moment(this.data[0] * 1000))
          }
          if (isNaN(this.data[1] - 0)) {
            // 2000-01-01类型处理
            this.endTime = new Date(this.$moment(this.data[1]))
          } else {
            // 10位时间戳类型处理
            this.endTime = new Date(this.$moment(this.data[1] * 1000))
          }
        }
        this.showStartTimeLabel = true
        this.showEndTimeLabel = true
      }
    },
  },

  created() {
    if (this.type === 'time') {
      if (this.data && this.data[0] !== '' && this.data[0] !== '0' && this.data[1] !== '' && this.data[1] !== '0') {
        this.startTime = this.data[0]
        this.endTime = this.data[1]
      } else {
        this.startTime = '07:00'
        this.endTime = '20:59'
      }
    }
  },

  mounted() {
    if (this.showDefault) {
      this.showStartTimeLabel = true
      this.showEndTimeLabel = true
    }
  },

  destroyed() {},

  methods: {
    _controlStartTimePicker() {
      if (this.disabled) return
      this.showStartTimePicker = !this.showStartTimePicker
    },
    _controlEndTimePicker() {
      if (this.disabled) return
      this.showEndTimePicker = !this.showEndTimePicker
    },
    _changeStartTime(picker) {
      this.showStartTimeLabel = true
      this.startTime = picker.getValues().join(':')
      this.pickStartTime(picker.getValues().join(':'))
    },
    _changeEndTime(picker) {
      this.showEndTimeLabel = true
      this.endTime = picker.getValues().join(':')
      this.pickEndTime(picker.getValues().join(':'))
    },
    _pickStartTime(data) {
      this.startTime = data
      this.showStartTimeLabel = true
      this.pickStartTime(data)
      this._controlStartTimePicker()
    },
    _pickEndTime(data) {
      this.endTime = data
      this.showEndTimeLabel = true
      this.pickEndTime(data)
      this._controlEndTimePicker()
    },
  },
}
</script>

<style lang="less" scoped></style>
