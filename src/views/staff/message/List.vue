<template>
  <div>
    <van-nav-bar @click-left="$goBack" left-arrow title="消息列表" />
    <van-tabs v-model="active" sticky>
      <van-tab title="订单消息">
        <div v-for="(item, index) in orderList" :key="index" style="margin-bottom: 2px;">
          <van-cell :label="item.message">
            <template>
              <div>{{ $moment(item.add_time * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
              <div v-if="item.msg_type === '1'" class="msg_type">
                <van-icon name="todo-list-o" />
                订单消息
              </div>
              <div v-else class="msg_type">
                <van-icon name="gem-o" />
                屏幕消息
              </div>
              <div v-if="!item.deal_staff_id">
                <van-button type="primary" size="small" @click="_handleMsg(item)">
                  <span v-if="item.msg_type === '1'">收到</span>
                  <span v-else>我来处理</span>
                </van-button>
              </div>
              <div v-else-if="item.deal_staff_id === staff_id">
                <div>
                  我已处理
                  <span v-if="item.reply_message">：{{ item.reply_message }}</span>
                </div>
              </div>
              <div v-else>
                <div>处理人：{{ item.deal_staff_name }}</div>
              </div>
            </template>
            <template #title>
              <span>{{ item.title }}</span>
              <van-icon name="success" v-if="item.status === '1'" />
            </template>
          </van-cell>
        </div>
      </van-tab>
      <van-tab title="机器人消息">
        <div v-for="(item, index) in robotList" :key="index" style="margin-bottom: 2px;">
          <van-cell :label="item.message">
            <template>
              <div>{{ $moment(item.add_time * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
              <div v-if="item.msg_type === '1'" class="msg_type">
                <van-icon name="todo-list-o" />
                订单消息
              </div>
              <div v-else class="msg_type">
                <van-icon name="gem-o" />
                屏幕消息
              </div>
              <div v-if="!item.deal_staff_id">
                <van-button type="primary" size="small" @click="_handleMsg(item)">
                  <span v-if="item.msg_type === '1'">收到</span>
                  <span v-else>我来处理</span>
                </van-button>
              </div>
              <div v-else-if="item.deal_staff_id === staff_id">
                <div>
                  我已处理
                  <span v-if="item.reply_message">：{{ item.reply_message }}</span>
                </div>
              </div>
              <div v-else>
                <div>处理人：{{ item.deal_staff_name }}</div>
              </div>
            </template>
            <template #title>
              <span>{{ item.title }}</span>
              <van-icon name="success" v-if="item.status === '1'" />
            </template>
          </van-cell>
        </div>
      </van-tab>
    </van-tabs>

    <van-dialog v-model="show" title="回复消息" show-cancel-button @confirm="_deal">
      <van-field input-align="center" placeholder="可输入一条回复语句" v-model="msg" />
    </van-dialog>
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
    return {
      staff_id: '',
      orderList: [],
      robotList: [],
      show: false,
      msg: '',
      msg_id: '',
      active: 0,
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    let item = sessionStorage.getItem('session_storestaff_store_staff')
    if (item) {
      this.staff_id = JSON.parse(item.replace('obj||', '')).id
    }
    console.log(this.staff_id)
    this._getMessageList()
  },

  destroyed() {},

  methods: {
    ...mapActions('staff', ['getMessageList', 'dealMessage']),
    _getMessageList() {
      this.getMessageList().then(res => {
        this.orderList = res.filter(item => {
          return item.msg_type == '1'
        })
        console.log(this.orderList)
        this.robotList = res.filter(item => {
          return item.msg_type == '2'
        })
      })
    },
    _handleMsg(item) {
      console.log(item)
      if (item.msg_type === '1') {
        this.$dialog
          .confirm({
            title: '提示',
            message: '处理此条消息？',
          })
          .then(() => {
            this.dealMessage({
              msg_id: item.msg_id,
            }).then(() => {
              this.$toast.success({
                message: '操作成功',
                forbidClick: true,
                duration: 1000,
                onClose: () => {
                  // 解锁
                  this._getMessageList()
                },
              })
            })
            // on confirm
          })
          .catch(() => {
            // on cancel
          })
      } else {
        this.show = true
        this.msg_id = item.msg_id
      }
    },
    _deal() {
      this.dealMessage({
        msg_id: this.msg_id,
        reply_message: this.msg,
      }).then(() => {
        this.$toast.success({
          message: '操作成功',
          forbidClick: true,
          duration: 1000,
          onClose: () => {
            // 解锁
            this._getMessageList()
          },
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.van-icon {
  color: #4fc08d;
  margin-left: 3px;
}

.van-button {
  margin-top: 3px;
}
.msg_type {
  color: #4fc08d;
  font-size: 13px;
}
</style>
