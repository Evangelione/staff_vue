<template>
  <div>
    <van-nav-bar :border="false" @click-left="$goBack" fixed left-arrow title="挂单中订单" />
    <div class="nav-bar-holder-sp"></div>
    <van-collapse accordion v-model="active">
      <van-collapse-item :key="index" :label="item.order_no" :name="item.order_id" v-for="(item, index) in orderList">
        <template #title>
          <div v-if="item.user_phone">
            {{ item.s_name || '未知标识' }} -
            <a class="tel" :href="`tel:${item.user_phone}`" @click.stop="() => {}">
              <van-icon name="phone-o" />
              {{ item.user_phone }}
            </a>
          </div>
          <div v-else>{{ item.s_name || '未知标识' }}</div>
        </template>
        <div>
          <div class="tool-bar">
            操作：
            <div>
              <van-button @click="_cancelOrder(item.order_id)" size="small" style="background: #ccc;">
                取消此订单
              </van-button>
              <van-button @click="_getMarkList(item)" size="small" type="primary">修改标识</van-button>
              <van-button @click="_confirm(item.order_id)" size="small" type="warning">选中</van-button>
            </div>
          </div>
          <van-cell-group :key="index2" v-for="(item2, index2) in item.list">
            <van-cell :label="`x${item2.goods_num} ¥${item2.unit_price}`" :title="item2.name">
              <div v-if="item2.type === '1'">
                <div v-if="item2.service_status === '1'">
                  已完成
                  <van-button @click="viewStaff(item2)" size="mini" style="margin-left: 6px;">查看</van-button>
                </div>
                <div v-if="item2.service_status === '2'">
                  <div v-if="item2.sent == '0'">
                    <van-button @click="_getStaffList(item2)" size="mini">指派服务</van-button>
                  </div>
                  <div v-else>
                    <van-button @click="_rePickStaff(item2)" size="mini" style="margin-right: 4px;">
                      修改指派
                    </van-button>
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
            </van-cell>
            <!-- 套餐显示包含内容 -->
            <div class="package-detail" v-if="item2.type === '4'">
              <van-row :key="index3" align="center" class="detail" type="flex" v-for="(item3, index3) in item2.detail">
                <van-col class="van-ellipsis" span="6">{{ item3.name }}</van-col>
                <van-col class="price van-ellipsis" offset="1" span="5">
                  <div>x {{ item3.goods_num }}</div>
                </van-col>
                <van-col span="12" style="display: flex;justify-content: flex-end;">
                  <div v-if="item3.type === '1'">
                    <div v-if="item3.service_status === '1'">
                      已完成
                      <van-button @click="viewStaff(item3)" size="mini" style="margin-left: 6px;">查看</van-button>
                    </div>
                    <div v-if="item3.service_status === '2'">
                      <div v-if="item3.sent == '0'">
                        <van-button @click="_getStaffList(item3)" size="mini">指派服务</van-button>
                      </div>
                      <div v-else>
                        <van-button @click="_rePickStaff(item3)" size="mini" style="margin-right: 4px;">
                          修改指派
                        </van-button>
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
          </van-cell-group>
        </div>
      </van-collapse-item>
    </van-collapse>
    <!-- <div class="tool-bar"></div> -->
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
      <van-button @click="_openSingleStaffPicker(curOrder)" class="add" icon="plus" size="small" type="primary">
        添加服务人员
      </van-button>
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
      active: [],
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
    ...mapActions('staff', [
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
        this.markColumns = res.map(item => {
          let tag = '个人'
          let status = '空闲'
          if (item.tag === '2') {
            tag = '多人'
          } else if (item.tag === '3') {
            tag = '公用'
          }
          if (item.status === 1) {
            status = '使用中'
          }
          let disabled = false
          if (data.s_id == item.id) {
            disabled = true
          }
          return {
            ...item,
            s_name: `${item.s_name}（${tag} - ${status}）`,
            name: item.s_name,
            disabled,
          }
        })
        this.showMarkPicker = true
      })
    },
    // 获取空闲服务人员
    _getStaffList(data) {
      this.curOrder = data
      this.getFreeStaffList({
        id: data.goods_appoint_id,
      }).then(res => {
        if (res.length) {
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
        } else {
          this.$dialog.alert({
            title: '提示',
            message: '没有可指派的服务人员',
          })
        }
      })
    },
    // 重新指定服务人员
    _rePickStaff(data) {
      this.curOrder = data
      this.showStaffRePicker = true
    },
    // 修改标识
    _pickMark(data) {
      if (data.status === 1) {
        this.$dialog
          .confirm({
            title: '合并订单',
            message: `${data.name}中已有订单，\n是否要将订单合并到 -> ${data.name}，\n合并后无法撤销！！！`,
          })
          .then(() => {
            this._changeOrderMark(data)
          })
          .catch(() => {
            // on cancel
          })
      } else {
        this._changeOrderMark(data)
      }
    },
    _changeOrderMark(data) {
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
    viewStaff(item) {
      console.log(item)
      let s = item.supply.map(i => {
        return `${i.name} - ¥${i.service_fee}`
      })
      console.log(s)
      this.$dialog({ message: s.join('\n') })
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
        }).then(res => {
          if (res.msg) {
            this.$toast.success({
              message: '指派成功\n（通知失败）',
              duration: 1500,
              onClose: () => {
                this.getEntryOrderList().then(res => {
                  this.orderList = res
                  this.showStaffPicker = false
                  this.staffResult = []
                })
              },
            })
          } else {
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
          }
        })
      }
    },
    _openSingleStaffPicker(data) {
      var supArr = data.supply.map(item => item.id)
      this.getFreeStaffList({
        id: data.goods_appoint_id,
      }).then(res => {
        if (res.length) {
          res = res.map(item => {
            let disabled = false
            if (supArr.indexOf(item.id) > -1) {
              disabled = true
            }
            return {
              ...item,
              name: item.name + ` - ${item.technician_grade_name || '暂无等级'} （¥ ${item.service_fee}）`,
              disabled,
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
          this.showStaffSinglePicker = true
        } else {
          this.$dialog.alert({
            title: '提示',
            message: '没有可指派的服务人员',
          })
        }

        // if (data.remark_service_personnel !== '0') {
        //           const index = res.findIndex(item => {
        //             if (item.id == data.remark_service_personnel) {
        //               return item
        //             }
        //           })
        //           if (index > -1) {
        //             this.defaultStaffIndex = index
        //             res[index].name = res[index].name + ' （用户指定）'
        //           }
        //         }
        //         let staffIDS = data.supply.map(item => {
        //           return item.id
        //         })
        //         let col = []
        //         res.forEach(item => {
        //           if (staffIDS.indexOf(item.id) === -1) {
        //             col.push(item)
        //           }
        //         })

        //         this.staffColumns = col
        //         this.showStaffSinglePicker = true
        //       })
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
    _confirm(id) {
      this.pullOrder({ order_id: id }).then(() => {
        this.$goBack()
      })
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
    _cancelOrder(id) {
      this.radio = id
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
    },
    // 确认取消备注信息
    _confirmReason() {
      if (this.reason) {
        this.cancelOrder({
          order_id: this.radio,
          reason: this.reason,
        }).then(() => {
          this.$toast.success({
            message: '取消成功',
            duration: 800,
            onClose: () => {
              this.getEntryOrderList().then(res => {
                this.orderList = res
                this.radio = ''
                this.reason = ''
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

.package-detail {
  padding: 12px;
}

.tool-bar {
  // position: fixed;
  // bottom: 0;
  // width: 100vw;
  // height: 50px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // background: #fff;
  // .van-button {
  //   margin-right: 10px;
  //   width: 42vw;
  // }
  padding: 4px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .van-button {
    margin-right: 4px;
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

.van-cell {
  font-size: 12px;
  color: #666;
}

.tel {
  color: #323233;
  margin-left: 12px;
}

/deep/.van-collapse-item__content {
  padding: 0;
}
</style>
