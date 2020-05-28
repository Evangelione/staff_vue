<template>
  <div>
    <van-nav-bar :border="false" @click-left="$goBack" fixed left-arrow title="挂单中订单" />
    <div class="nav-bar-holder-sp"></div>
    <van-radio-group v-model="radio">
      <div :key="index" v-for="(item, index) in orderList">
        <van-panel>
          <div class="van-hairline--bottom" slot="header">
            <van-row class="header">
              <van-col span="18">
                <div class="title">
                  <van-icon name="label-o" />
                  <span>{{ item.s_name }}</span>
                  <van-button @click="_getMarkList(item)" size="mini" type="warning">修改标识</van-button>
                </div>
                <div class="desc">订单号：{{ item.order_no }}</div>
              </van-col>
              <van-col span="6">
                <div class="status">
                  <van-radio :name="item.order_id"></van-radio>
                </div>
              </van-col>
            </van-row>
          </div>
          <div>
            <div :key="index2" v-for="(item2, index2) in item.list">
              <van-row :class="item2.type !== '4' ? 'detail' : 'detail has-border-top'" align="center" type="flex">
                <van-col class="van-ellipsis" span="6">{{ item2.name }}</van-col>
                <van-col class="price van-ellipsis" offset="1" span="5">
                  <div>x {{ item2.goods_num }}</div>
                  <div style="margin-top: 3px;">¥ {{ item2.unit_price }}</div>
                </van-col>
                <van-col span="12" style="display: flex;justify-content: flex-end;">
                  <div v-if="item2.type === '1'">
                    <div v-if="item2.service_status === '1'">服务完成</div>
                    <div v-if="item2.service_status === '2'">
                      <div v-if="item2.sent == '0'">
                        <van-button @click="_getStaffList(item2)" size="mini">指派服务</van-button>
                      </div>
                      <div v-else>
                        <van-button @click="_rePickStaff(item2)" size="mini" style="margin-right: 4px;"
                          >修改指派</van-button
                        >
                        <van-button @click="_orders(item2)" size="mini">接单</van-button>
                      </div>
                    </div>
                    <div v-if="item2.service_status === '3'">
                      <div v-if="item2.supply.length > 0">
                        <van-button @click="_rePickStaff(item2)" size="mini">修改指派</van-button>
                        <van-button @click="_finish(item2)" size="mini">服务完成</van-button>
                      </div>
                      <div v-else>
                        <van-button @click="_getStaffList(item2)" size="mini">指派服务</van-button>
                      </div>
                    </div>
                    <div v-if="item2.service_status === '4'">
                      <van-button @click="_rework(item2)" size="mini">返工</van-button>
                      <van-button @click="_acceptance(item2)" size="mini">验收合格</van-button>
                    </div>
                    <div v-if="item2.service_status === '5'">待重新服务</div>
                  </div>
                  <div v-if="item2.type === '4'">套餐</div>
                </van-col>
              </van-row>
              <!-- 套餐显示包含内容 -->
              <div class="has-border-bottom" v-if="item2.type === '4'">
                <van-row
                  :key="index3"
                  align="center"
                  class="detail"
                  type="flex"
                  v-for="(item3, index3) in item2.detail"
                >
                  <van-col class="van-ellipsis" span="6">{{ item3.name }}</van-col>
                  <van-col class="price van-ellipsis" offset="1" span="5">
                    <div>x {{ item3.goods_num }}</div>
                  </van-col>
                  <van-col span="12" style="display: flex;justify-content: flex-end;">
                    <div v-if="item3.type === '1'">
                      <div v-if="item3.service_status === '1'">服务完成</div>
                      <div v-if="item3.service_status === '2'">
                        <div v-if="item3.sent == '0'">
                          <van-button @click="_getStaffList(item3)" size="mini">指派服务</van-button>
                        </div>
                        <div v-else>
                          <van-button @click="_rePickStaff(item3)" size="mini" style="margin-right: 4px;"
                            >修改指派</van-button
                          >
                          <van-button @click="_orders(item3)" size="mini">接单</van-button>
                        </div>
                      </div>
                      <div v-if="item3.service_status === '3'">
                        <div v-if="item3.supply.length > 0">
                          <van-button @click="_rePickStaff(item3)" size="mini">修改指派</van-button>
                          <van-button @click="_finish(item3)" size="mini">服务完成</van-button>
                        </div>
                        <div v-else>
                          <van-button @click="_getStaffList(item3)" size="mini">指派服务</van-button>
                        </div>
                      </div>
                      <div v-if="item3.service_status === '4'">
                        <van-button @click="_rework(item3)" size="mini">返工</van-button>
                        <van-button @click="_acceptance(item3)" size="mini">验收合格</van-button>
                      </div>
                      <div v-if="item3.service_status === '5'">待重新服务</div>
                    </div>
                  </van-col>
                </van-row>
              </div>
            </div>
          </div>
        </van-panel>
        <div class="white-space"></div>
      </div>
    </van-radio-group>
    <div class="tool-bar">
      <van-button @click="_cancelOrder" size="small" style="background: #ccc;">取消</van-button>
      <van-button @click="_confirm" size="small" type="primary">确定</van-button>
    </div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="showMarkPicker">
      <van-picker :columns="markColumns" @confirm="_pickMark" show-toolbar title="选择标识位" value-key="s_name" />
    </van-popup>
    <van-popup position="bottom" safe-area-inset-bottom v-model="showStaffPicker">
      <!-- <van-picker
        :columns="staffColumns"
        :default-index="defaultStaffIndex"
        @confirm="_pickStaff"
        show-toolbar
        title="指派服务人员"
        value-key="name"
      />-->
      <van-checkbox-group v-model="staffResult">
        <van-cell-group>
          <van-cell
            :key="item"
            :title="item.name"
            @click="toggle(index, item.disabled)"
            clickable
            v-for="(item, index) in staffColumns"
          >
            <template #right-icon>
              <van-checkbox :disabled="item.disabled" :name="item.id" ref="checkboxes" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <van-button @click="_pickStaff" style="width: 100vw;" type="primary">指派</van-button>
    </van-popup>

    <van-popup position="bottom" safe-area-inset-bottom v-model="showStaffSinglePicker">
      <van-picker
        :columns="staffColumns"
        @confirm="_pickSingleStaff"
        show-toolbar
        title="选择服务人员"
        value-key="name"
      />
    </van-popup>
    <van-popup class="repick" safe-area-inset-bottom v-model="showStaffRePicker">
      <div class="title van-hairline--bottom">当前指派人员：</div>
      <van-row :key="index" align="center" justify="space-between" type="flex" v-for="(item, index) in curOrder.supply">
        <van-col span="8">{{ item.name }}</van-col>
        <van-col span="16">
          <van-button @click="_undoStaff(item)" size="small" style="float: right;" type="danger">撤下</van-button>
        </van-col>
      </van-row>
      <van-button @click="_openSingleStaffPicker(curOrder)" class="add" icon="plus" size="small" type="primary"
        >添加服务人员</van-button
      >
    </van-popup>

    <!-- 取消原因 -->
    <van-dialog @confirm="_confirmReason" show-cancel-button title="取消订单" v-model="showReason">
      <van-field input-align="center" placeholder="请输入原因" v-model="reason" />
    </van-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'entryOrder',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      orderList: [],
      radio: '',
      showMarkPicker: false,
      showStaffPicker: false,
      showStaffRePicker: false,
      showStaffSinglePicker: false,
      showReason: false,
      markColumns: [],
      staffColumns: [],
      curOrder: {},
      defaultStaffIndex: 0,
      staffResult: [],
      reason: '',
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getEntryOrderList().then(res => {
      this.orderList = res
    })
  },

  destroyed() {},

  methods: {
    ...mapActions('staffOrder', [
      'getEntryOrderList',
      'pullOrder',
      'getFreeMarkList',
      'getFreeStaffList',
      'changeOrderMark',
      'appointStaff',
      'unDoStaff',
      'addStaff',
      'insteadOrders',
      'insteadFinish',
      'rework',
      'acceptance',
      'cancelOrder',
    ]),
    // 获取空闲标识
    _getMarkList(data) {
      this.curOrder = data
      // 获取空闲标识，打开标识选择
      this.getFreeMarkList().then(res => {
        this.markColumns = res
        this.showMarkPicker = true
      })
    },
    // 获取空闲服务人员
    _getStaffList(data) {
      this.curOrder = data
      this.getFreeStaffList({
        id: data.goods_appoint_id,
      }).then(res => {
        res = res.map(item => {
          return {
            ...item,
            name: item.name + ` - ${item.technician_grade_name || '暂无等级'} （¥ ${item.service_fee}）`,
          }
        })
        if (data.remark_service_personnel !== '0') {
          const index = res.findIndex(item => {
            if (item.id == data.remark_service_personnel) {
              return item
            }
          })
          if (index > -1) {
            this.defaultStaffIndex = index
            res[index].name = res[index].name + ' （用户指定）'
          }
        }
        this.staffColumns = res
        this.showStaffPicker = true
      })
    },
    // 重新指定服务人员
    _rePickStaff(data) {
      this.curOrder = data
      this.showStaffRePicker = true
    },
    // 修改标识
    _pickMark(data) {
      this.changeOrderMark({ s_id: data.id, order_id: this.curOrder.order_id }).then(() => {
        this.$toast.success({
          message: '修改成功',
          duration: 800,
          onClose: () => {
            // localStorage.removeItem('staffOrderCart')
            this.curOrder = {}
            this.showMarkPicker = false
            this.getEntryOrderList().then(res => {
              this.orderList = res
            })
          },
        })
      })
    },
    // 指派服务人员
    _pickStaff() {
      if (this.staffResult.length == 0) {
        this.$toast({
          message: '请选择服务人员',
          duration: 800,
        })
        return false
      }
      if (this.curOrder.sent === 0) {
        this.appointStaff({
          order_id: this.curOrder.order_id,
          store_order_id: this.curOrder.id,
          worker_id: this.staffResult,
        }).then(() => {
          this.$toast.success({
            message: '指派成功',
            duration: 800,
            onClose: () => {
              this.getEntryOrderList().then(res => {
                this.orderList = res
                this.showStaffPicker = false
                this.staffResult = []
              })
            },
          })
        })
      }
    },
    _openSingleStaffPicker(data) {
      this.getFreeStaffList().then(res => {
        if (data.remark_service_personnel !== '0') {
          const index = res.findIndex(item => {
            if (item.id == data.remark_service_personnel) {
              return item
            }
          })
          if (index > -1) {
            this.defaultStaffIndex = index
            res[index].name = res[index].name + ' （用户指定）'
          }
        }
        let staffIDS = data.supply.map(item => {
          return item.id
        })
        let col = []
        res.forEach(item => {
          if (staffIDS.indexOf(item.id) === -1) {
            col.push(item)
          }
        })

        this.staffColumns = col
        this.showStaffSinglePicker = true
      })
    },
    _pickSingleStaff(data) {
      this.addStaff({
        staff_id: data.id,
        id: this.curOrder.id,
      }).then(() => {
        this.$toast.success({
          message: '操作成功',
          duration: 800,
          onClose: () => {
            this.getEntryOrderList().then(res => {
              this.showStaffSinglePicker = false
              this.showStaffRePicker = false
              this.orderList = res
              this.curOrder = res
            })
          },
        })
      })
    },
    _undoStaff(staff) {
      this.unDoStaff({
        staff_id: staff.id,
        id: this.curOrder.id,
      }).then(() => {
        this.$toast.success({
          message: '操作成功',
          duration: 800,
          onClose: () => {
            this.getEntryOrderList().then(res => {
              this.showStaffRePicker = false
              this.orderList = res
              this.curOrder = res
            })
          },
        })
      })
    },
    toggle(index, flag) {
      !flag && this.$refs.checkboxes[index].toggle()
    },
    _confirm() {
      if (this.radio) {
        this.pullOrder({ order_id: this.radio }).then(() => {
          this.$goBack()
        })
      } else {
        this.$toast({
          message: '请选择要操作的订单',
          duration: 800,
        })
      }
    },
    // 代替接单
    _orders(data) {
      this.insteadOrders({
        order_id: data.order_id,
        store_order_id: data.id,
      }).then(() => {
        this.$toast.success({
          message: '代替接单成功',
          duration: 800,
          onClose: () => {
            this.getEntryOrderList().then(res => {
              this.orderList = res
            })
          },
        })
      })
    },
    // 代替完成
    _finish(data) {
      this.insteadFinish({
        order_id: data.order_id,
        store_order_id: data.id,
      }).then(() => {
        this.$toast.success({
          message: '代替完成成功',
          duration: 800,
          onClose: () => {
            this.getEntryOrderList().then(res => {
              this.orderList = res
            })
          },
        })
      })
    },
    // 返工
    _rework(data) {
      this.rework({
        order_id: data.order_id,
        store_order_id: data.id,
      }).then(() => {
        this.$toast.success({
          message: '订单已返工',
          duration: 800,
          onClose: () => {
            this.getEntryOrderList().then(res => {
              this.orderList = res
            })
          },
        })
      })
    },
    // 验收
    _acceptance(data) {
      this.acceptance({
        order_id: data.order_id,
        store_order_id: data.id,
      }).then(() => {
        this.$toast.success({
          message: '订单验收合格',
          duration: 800,
          onClose: () => {
            this.getEntryOrderList().then(res => {
              this.orderList = res
            })
          },
        })
      })
    },
    _cancelOrder() {
      if (this.radio) {
        this.$dialog
          .confirm({
            title: '取消订单',
            message: '确认取消当前订单？\n（服务将终止且订单无法恢复）',
          })
          .then(() => {
            // on confirm
            this.showReason = true
          })
          .catch(() => {
            // on cancel
          })
      } else {
        this.$toast({
          message: '请选中要取消的订单',
          duration: 800,
        })
      }
    },
    // 确认取消备注信息
    _confirmReason() {
      if (this.reason) {
        let order = this.orderList.find(item => {
          if (item.order_id === this.radio) {
            return item
          }
        })
        this.cancelOrder({
          order_id: order.order_id,
          reason: this.reason,
        }).then(() => {
          this.$toast.success({
            message: '取消成功',
            duration: 800,
            onClose: () => {
              this.getEntryOrderList().then(res => {
                this.orderList = res
              })
            },
          })
        })
      } else {
        this.$toast({
          message: '取消原因必填',
          duration: 800,
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  padding: 8px 16px;
  font-size: 13px;
  .title {
    color: #323232;
    display: flex;
    align-items: center;

    .van-icon {
      margin-right: 4px;
    }
    .van-button {
      margin-left: 6px;
    }
  }
  .desc {
    font-size: 12px;
    color: #969696;
    margin-top: 5px;
  }

  .status {
    color: red;
    text-align: right;
  }

  .van-radio {
    justify-content: flex-end;
  }
}
.van-panel__content {
  padding: 6px 16px;
  font-size: 12px;
  color: #444;
}

.detail {
  padding: 0 6px 8px 6px;
  .price {
    color: #666;
  }
}

.has-border-top {
  border: 1px solid #ccc;
  border-bottom: none !important;
  padding-top: 8px;
}

.has-border-bottom {
  border: 1px solid #ccc;
  border-top: none;
  margin-bottom: 8px;
}

.tool-bar {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  .van-button {
    margin-right: 10px;
    width: 42vw;
  }
}

.van-radio-group {
  margin-bottom: 60px;
}

.repick {
  width: 90vw;
  padding: 10px;
  box-sizing: border-box;

  .title {
    color: #444;
    text-align: center;
    font-size: 16px;
    padding-bottom: 8px;
    margin-bottom: 18px;
  }

  .van-row {
    padding: 0 8px 6px 8px;
    color: #666;
  }

  .add {
    margin-top: 8px;
    float: right;
  }
}
</style>
