<template>
  <div class="container">
    <van-nav-bar :right-text="_rightText" @click-right="goOrder" fixed title="点单" />
    <div class="nav-bar-holder"></div>
    <van-sticky :offset-top="46">
      <div style="padding: 5px 20px; background: #fff; font-size: 14px;">
        <div class="mark">
          <van-icon name="label-o" />
          <span>订单：</span>
          <span>{{ flagName }}</span>
        </div>
        <!-- <van-divider />
        <div class="date">
          <van-icon name="diamond-o" />
          <span>桌台 / 座位：</span>
          <span>{{ site === '' ? '暂未选择' : site_name }}</span>
          <van-button
            @click="_openFlagPicker"
            size="mini"
            style="float: right;"
            type="primary"
          >{{ site_name === '' ? '选择' : '修改' }}</van-button>
        </div>-->
      </div>
    </van-sticky>
    <van-loading type="spinner" v-if="loading && !list.length" />
    <div style="background: #fff; margin-top: 10px;">
      <van-card
        :class="item.status !== '0' ? 'green' : ''"
        :key="index"
        :num="item.goods_num"
        :price="item.pay_price"
        :tag="item.status === '0' ? '未下单' : '已下单'"
        :thumb="item.goods_img"
        :title="item.name"
        @click="_openEditor(item)"
        v-for="(item, index) in list"
      >
        <template #tags>
          <van-tag :type="_tagType(item.type)" style="margin-top: 3px;">{{ _goodsType(item.type) }}</van-tag>
        </template>
        <template #footer>
          <span
            style="padding: 4px 0;"
            v-if="
              item.need_service_personnel === '1' &&
                item.remark_service_personnel !== '0' &&
                item.type !== '4' &&
                !item.supply
            "
          >
            指定：{{ _getStaffInfo(item) }}
          </span>
          <span style="padding: 4px 0;" v-else>
            <div :key="i" v-for="(staff, i) in item.supply">
              {{ staff.name }} - {{ staff.grade_name }} （¥{{ staff.service_fee }}）
            </div>
          </span>
          <van-button
            @click.stop="_controlStaffPicker(index, item)"
            size="small"
            style="margin-top: 20px"
            v-if="item.type != '2' && item.status == '0' && item.need_service_personnel === '1'"
          >
            指定服务人员
          </van-button>

          <div style="margin-top: 15px;" v-if="item.type === '4'">
            <div :key="index2" style="margin-top: 3px;" v-for="(i, index2) in item.detail">
              <div style="display: flex;justify-content: space-between; align-items: center;">
                <span>{{ i.name }} x1</span>
                <van-button
                  @click.stop="_controlPackageStaffPicker(index, index2, i)"
                  size="mini"
                  style="margin-left: 40px;padding: 0 4px;"
                  v-if="i.type != '2' && i.status == '0' && i.need_service_personnel === '1'"
                >
                  指定服务人员
                </van-button>
              </div>
              <div style="text-align: left;">
                <span
                  class="package-staff"
                  v-if="i.need_service_personnel === '1' && i.remark_service_personnel !== '0' && !i.supply"
                >
                  指定：{{ _getStaffInfo(i) }}
                </span>
                <span style="padding: 4px 0;" v-else>
                  <div :key="id" class="sup-real" v-for="(staff, id) in i.supply">
                    {{ staff.name }} - {{ staff.grade_name }} （¥{{ staff.service_fee }}）
                  </div>
                </span>
              </div>
            </div>
          </div>
        </template>
      </van-card>
    </div>
    <div class="wing-blank-lg" style="margin-top: 20px;" v-if="recommendList.length !== 0">
      <van-divider>推荐商品</van-divider>
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item :key="index" v-for="(item, index) in recommendList">
          <van-col
            :key="index2"
            @click="_openDesc(index, index2)"
            offset="1"
            span="5"
            style="text-align: center;"
            v-for="(i, index2) in item"
          >
            <van-image :src="i.pic" height="70" width="100%" />
            <span style="font-size: 12px; color: #666;">{{ i.name || i.appoint_name }}</span>
          </van-col>
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-empty description="点击下方下单" v-if="list.length === 0 && !loading" />
    <van-submit-bar
      :button-text="_orderSubmitText"
      :disabled="_canSubmit"
      :price="_price"
      :tip="_showTip"
      @submit="perCheck"
      v-else
    />
    <van-popup position="bottom" safe-area-inset-bottom v-model="showFlagPicker">
      <van-picker
        :columns="flagColumns"
        @cancel="_controlFlagPicker"
        @confirm="_pickFlag"
        show-toolbar
        title="请选择桌台 / 座位"
        value-key="s_name"
      ></van-picker>
    </van-popup>
    <van-popup position="bottom" safe-area-inset-bottom v-model="showStaffPicker">
      <van-picker
        :columns="staffColumns"
        @cancel="_controlStaffPicker()"
        @confirm="_pickStaff"
        show-toolbar
        title="选择店员"
        value-key="t_name"
      ></van-picker>
    </van-popup>
    <van-popup position="bottom" safe-area-inset-bottom v-model="showPackageStaffPicker">
      <van-picker
        :columns="staffColumns"
        @cancel="_controlPackageStaffPicker()"
        @confirm="_pickPackageStaff"
        show-toolbar
        title="选择店员"
        value-key="t_name"
      ></van-picker>
    </van-popup>

    <van-popup :style="{ width: '90vw' }" round safe-area-inset-bottom v-model="showRecommendPopup">
      <van-image :src="curRec.pic" height="90vw" width="100%" />
      <div class="title">{{ curRec.name || curRec.appoint_name }}</div>
      <div class="price-box">
        <div class="price">¥ {{ curRec.price || curRec.old_price }}</div>
        <van-stepper v-model="curRec.num" />
      </div>
      <div class="opa">
        <van-button @click="_addToCart" size="small" type="primary">加入购物车</van-button>
      </div>
    </van-popup>

    <van-popup :style="{ width: '90vw' }" round safe-area-inset-bottom v-model="showEditPopup">
      <van-image :src="curEdit.goods_img" height="90vw" width="100%" />
      <div class="title">{{ curEdit.name }}</div>
      <div class="price-box">
        <div class="price">¥ {{ curEdit.pay_price }}</div>
        <van-stepper v-if="curEdit.type == '2'" v-model="curEdit.num" />
      </div>
      <div class="opa">
        <van-button @click="_deleteCommodity" size="small" style="margin-right: 4px;" type="primary">
          删除商品
        </van-button>
        <van-button @click="_modifyCommodity" size="small" type="primary" v-if="curEdit.type == '2'">
          确认修改
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'order',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      loading: false,
      list: [],
      showFlagPicker: false,
      showStaffPicker: false,
      showPackageStaffPicker: false,
      showRecommendPopup: false,
      showEditPopup: false,
      flagColumns: [],
      staffColumns: [],
      site: '',
      site_name: '',
      curGood: '',
      curPackageGood: '',
      recommendList: [],
      curRec: '',
      curEdit: '',
      flagName: '',
      station: {},
    }
  },

  computed: {
    _price() {
      let total = 0
      this.list.forEach(item => {
        total += item.pay_price * 100 * item.goods_num
        if (item.type == '1') {
          if (item.supply) {
            item.supply.forEach(ii => {
              total += ii.service_fee * 100
            })
          } else if (
            item.need_service_personnel == '1' &&
            item.remark_service_personnel != '0' &&
            item.remark_service_personnel_price
          ) {
            total += item.remark_service_personnel_price * 100
          }
        } else if (item.type == '4') {
          item.detail.forEach(i => {
            if (i.supply) {
              i.supply.forEach(ii => {
                total += ii.service_fee * 100
              })
            } else if (
              i.type == '1' &&
              i.need_service_personnel == '1' &&
              i.remark_service_personnel != '0' &&
              i.remark_service_personnel_price
            ) {
              total += i.remark_service_personnel_price * 100
            }
          })
        }
      })
      return total
    },
    _showTip() {
      if (this.list.length > 0) {
        return this.list[0].status === '2' ? '店员正在结算此订单' : ''
      } else {
        return ''
      }
    },
    _canSubmit() {
      if (this.list.length > 0) {
        return this.list[0].status === '2' ? true : false
      } else {
        return false
      }
    },
    _rightText() {
      if (this.list.length > 0) {
        return this.list[0].status === '2' ? '' : '继续点单'
      } else {
        return '点单'
      }
    },
    _orderSubmitText() {
      if (this.list.length > 0) {
        let str = '结算'
        if (this.list[0].status == '2') {
          str = '结算中'
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].status == '0') {
              str = '提交订单'
              break
            }
          }
        }
        return str
      } else {
        return '提交订单'
      }
    },
  },

  watch: {
    $route: '_getUserOrder',
  },

  created() {},

  mounted() {
    const ticket = localStorage.getItem('ticket')
    if (!ticket && !this._isWx) {
      // this.$router.replace({ path: `/login/${this.$route.params.id}/${this.$route.params.flag}` })
    } else {
      this._getUserOrder()
    }
    this.getFlag({ store_id: this.$route.params.id }).then(res => {
      this.flagColumns = res
    })
  },

  destroyed() {
    this.ws.close()
  },

  methods: {
    ...mapActions(['getFlag', 'getStaff', 'commitOrder', 'getRecommendList', 'addToCart', 'connWs', 'notificationWs']),
    ...mapActions('commodity', ['getUserOrder', 'settlementOrder', 'remStaff', 'modifyGood']),
    _openWs(res) {
      if (res.info.s_tag !== '2') {
        return
      }
      let url = 'wss://go.9youke.com/robot'
      if (process.env.VUE_APP_ENV == 'prod') {
        url = 'wss://go.91gzt.com/robot'
      }
      var ws = new WebSocket(`${url}/v2/ws/conn/${res.info.s_id}/${res.info.uid}`)
      //连接打开时触发
      ws.onopen = function() {
        console.log('Connection open ...')
        // ws.send("Hello WebSockets!");
        // ws.send("ping")
      }
      //接收到消息时触发
      ws.onmessage = evt => {
        console.log('Received Message: ' + evt.data)
        console.log()
        const data = JSON.parse(evt.data)
        if (data.action === 'update') {
          this._getUserOrder()
        }
        // if (typeof evt.data === 'object') {
        // const link = document.createElement('a')
        // link.href = window.URL.createObjectURL(evt.data)
        // link.download = 'file'
        // link.click()
        // }
      }
      //连接关闭时触发
      ws.onclose = function() {
        console.log('Connection closed.')
      }
      this.ws = ws
    },
    _getUserOrder() {
      this.loading = true
      this.getUserOrder({ s_id: this.$route.params.flag }).then(res => {
        if (res.action === 'go_back') {
          this.$router.replace(`/order/${this.$route.params.id}/${res.s_id}`)
          return
        }
        if (!this.ws) this._openWs(res)

        this.flagName = res.info.s_name
        document.title = res.info.s_name
        this.loading = false

        this.list = res.list
        this.station = res.info

        let goodsSet = new Set()
        let serviceSet = new Set()

        res.list.forEach(item => {
          if (item.type === '1') {
            serviceSet.add(item.goods_appoint_id)
          } else if (item.type === '2') {
            goodsSet.add(item.goods_appoint_id)
          } else if (item.type === '4') {
            item.detail.forEach(item2 => {
              if (item2.type === '1') {
                serviceSet.add(item2.goods_appoint_id)
              } else if (item2.type === '2') {
                goodsSet.add(item2.goods_appoint_id)
              }
            })
          }
        })
        this._getRecommendList(Array.from(goodsSet), Array.from(serviceSet))
      })
    },
    goOrder() {
      if (this.list.length) {
        this.$router.push(
          `/commodity/${this.$route.params.id}/${this.$route.params.flag}/${this.station.uid}/${this.list[0].order_id}`
        )
      } else {
        this.$router.push(`/commodity/${this.$route.params.id}/${this.$route.params.flag}/${this.station.uid}`)
      }
    },
    _openEditor(item) {
      this.curEdit = item
      this.curEdit.num = item.goods_num
      console.log(item)
      if (item.status != '0') {
        this.$toast('商品已提交，不能修改')
        return
      }
      this.showEditPopup = true
    },
    _deleteCommodity() {
      this.modifyGood({
        id: this.curEdit.id,
        num: 0,
      }).then(() => {
        this.$toast({
          message: '删除成功',
          duration: 800,
          onClose: () => {
            this._getUserOrder()
            this.showEditPopup = false
          },
        })
        if (this.station.s_tag == '2') {
          this.notificationWs({
            sid: this.station.s_id,
            uid: this.station.uid,
          }).catch(() => {})
        }
      })
    },
    _modifyCommodity() {
      this.modifyGood({
        id: this.curEdit.id,
        num: this.curEdit.num,
      }).then(() => {
        this.$toast({
          message: '修改成功',
          duration: 800,
          onClose: () => {
            this._getUserOrder()
            this.showEditPopup = false
          },
        })
        if (this.station.s_tag == '2') {
          this.notificationWs({
            sid: this.station.s_id,
            uid: this.station.uid,
          }).catch(() => {})
        }
      })
    },
    _getRecommendList(goods, services) {
      this.getRecommendList({ goods_ids: goods, service_ids: services, store_id: this.$route.params.id }).then(res => {
        let r = [...res.goods, ...res.service]
        let total = r.length
        let result = []
        for (let i = 0; i < Math.ceil(total / 4); i++) {
          let arr = []
          for (let j = 0; j < 4; j++) {
            if (r[j]) {
              arr.push(r[j])
            }
          }
          result.push(arr)
        }
        this.recommendList = result
      })
    },
    _goodsType(type) {
      let name = ''
      switch (type) {
        case '1':
          name = '服务'
          break
        case '2':
          name = '商品'
          break
        case '3':
          name = '组合卡'
          break
        case '4':
          name = '套餐'
          break
        default:
          name = '未知商品'
      }
      return name
    },
    _tagType(type) {
      let name = 'primary'
      switch (type) {
        case '1':
          name = 'primary'
          break
        case '2':
          name = 'success'
          break
        case '3':
          name = 'primary'
          break
        case '4':
          name = 'warning'
          break
        default:
          name = 'primary'
      }
      return name
    },
    _openFlagPicker() {
      if (this.flagColumns.length !== 0) {
        this.showFlagPicker = !this.showFlagPicker
      }
    },
    _controlFlagPicker() {
      this.showFlagPicker = !this.showFlagPicker
    },
    _controlStaffPicker(index, item) {
      if (item) {
        this.getStaff({ store_id: this.$route.params.id, id: item.goods_appoint_id }).then(res => {
          this.staffColumns = res.map(item => {
            if (item.status !== 0) {
              return {
                ...item,
                t_name: item.name + ` - ${item.technician_grade_name || '暂无等级'} （¥${item.service_fee}）（服务中）`,
              }
            } else {
              return {
                ...item,
                t_name: item.name + ` - ${item.technician_grade_name || '暂无等级'} （¥ ${item.service_fee}）`,
              }
            }
          })
        })
      }
      this.curGood = index
      this.showStaffPicker = !this.showStaffPicker
    },
    _controlPackageStaffPicker(index, index2, item) {
      if (item) {
        this.getStaff({ store_id: this.$route.params.id, id: item.goods_appoint_id }).then(res => {
          this.staffColumns = res.map(item => {
            if (item.status !== 0) {
              return {
                ...item,
                t_name: item.name + ` - ${item.technician_grade_name || '暂无等级'} （¥${item.service_fee}）（服务中）`,
              }
            } else {
              return {
                ...item,
                t_name: item.name + ` - ${item.technician_grade_name || '暂无等级'} （¥ ${item.service_fee}）`,
              }
            }
          })
        })
      }
      this.curGood = index
      this.curPackageGood = index2
      this.showPackageStaffPicker = !this.showPackageStaffPicker
    },
    _pickFlag(data) {
      this.site = data.id
      this.site_name = data.s_name
      this._controlFlagPicker()
      this._onSubmit()
    },
    _pickStaff(data) {
      console.log(data)
      console.log(this.curGood)
      this.remStaff({ id: this.list[this.curGood].id, order_id: this.list[0].order_id, staff_id: data.id }).then(
        res => {
          console.log(this)
          if (this.station.s_tag == '2') {
            this.notificationWs({
              sid: this.station.s_id,
              uid: this.station.uid,
            }).catch(() => {})
          }
          console.log(res)
        }
      )
      this.list[this.curGood].remark_service_personnel = data.id
      this.list[this.curGood].remark_service_personnel_name = data.name
      this.list[this.curGood].remark_service_personnel_level = data.technician_grade_name
      this.list[this.curGood].remark_service_personnel_price = data.service_fee
      this.list = Object.assign([], this.list)
      this._controlStaffPicker()
    },
    _pickPackageStaff(data) {
      this.remStaff({
        id: this.list[this.curGood].detail[this.curPackageGood].id,
        order_id: this.list[0].order_id,
        staff_id: data.id,
      }).then(res => {
        if (this.station.s_tag == '2') {
          this.notificationWs({
            sid: this.station.s_id,
            uid: this.station.uid,
          }).catch(() => {})
        }
        console.log(res)
      })
      this.list[this.curGood].detail[this.curPackageGood].remark_service_personnel = data.id
      this.list[this.curGood].detail[this.curPackageGood].remark_service_personnel_name = data.name
      this.list[this.curGood].detail[this.curPackageGood].remark_service_personnel_level = data.technician_grade_name
      this.list[this.curGood].detail[this.curPackageGood].remark_service_personnel_price = data.service_fee
      this.list = Object.assign([], this.list)
      this._controlPackageStaffPicker()
    },
    _openDesc(index, index2) {
      this.curRec = this.recommendList[index][index2]
      this.showRecommendPopup = true
    },
    _addToCart() {
      let good = this.curRec
      this.addToCart({
        list: {
          id: good.goods_id || good.appoint_id,
          num: good.num,
          price: good.price || good.old_price,
          type: good.appoint_id ? '1' : '2',
        },
        order_id: this.list[0].order_id,
      }).then(() => {
        this.$toast({
          message: '加入购物车成功',
          duration: 800,
          onClose: () => {
            this._getUserOrder()
            this.showRecommendPopup = false
          },
        })
      })
    },
    _staffPrice() {
      let total = 0
      this.list.forEach(item => {
        if (item.type === '1' && item.need_service_personnel == '1' && item.remark_service_personnel !== '0') {
          total += item.remark_service_personnel_price * 100
        } else if (item.type === '4') {
          item.detail.forEach(item2 => {
            if (item2.type === '1' && item2.need_service_personnel == '1' && item2.remark_service_personnel !== '0') {
              total += item2.remark_service_personnel_price * 100
            }
          })
        }
      })
      return total
    },
    _getStaffInfo(item) {
      return `${item.remark_service_personnel_name} - ${item.remark_service_personnel_level} （ ¥ ${item.remark_service_personnel_price}）`
    },
    perCheck() {
      let need = false
      if (this.station.order_rem.length == 0) {
        this.list.forEach(item => {
          if (item.type == 1 && item.need_table == 1) {
            need = true
          } else if (item.type == 4) {
            item.detail.forEach(item2 => {
              if (item2.need_table == 1) {
                need = true
              }
            })
          }
        })
      }
      if (this.station.s_tag == '1' || this.station.s_tag == '2') {
        need = false
      }
      if (!need) {
        this._onSubmit()
      } else {
        this._openFlagPicker()
      }
    },
    _onSubmit() {
      if (this._orderSubmitText === '结算') {
        this.settlementOrder({ order_id: this.list[0].order_id }).then(res => {
          window.location.href = res.url
        })
      } else {
        let isFirst = true
        this.list.forEach(item => {
          if (item.status !== '0') {
            isFirst = false
          }
        })
        let par = { s_user_id: this.$route.params.flag, order_id: this.list[0].order_id }
        if (this.site) {
          par.s_id = this.site
        }
        this.commitOrder(par).then(() => {
          this.$toast.success({
            message: '订单已提交',
            duration: 800,
            onClose: () => {
              this._getUserOrder()
            },
          })
          this.list = []
          this.recommendList = []
          if (this.station.s_tag == '2') {
            this.notificationWs({
              sid: this.station.s_id,
              uid: this.station.uid,
            }).catch(() => {})
          }
          this.pushStaff({ isFirst }).then(res => {
            console.log(res)
          })
        })
      }
      // if (this.site_name === '') {
      //   this.$toast({
      //     message: '请选择桌台 / 座位',
      //     duration: 800,
      //     onClose: () => {
      //       this._controlFlagPicker()
      //     },
      //   })
      //   return false
      // }
      // console.log(this._staffPrice())

      // console.log(this.list)
      // if (this.list.length >= 0) {
      //   return false
      // }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  color: #101010;
  padding-bottom: 60px;
}

.mark {
  display: flex;
  align-items: center;
}

.van-divider {
  margin: 5px 0;
  border-color: #ccc;
}

.van-icon {
  margin-right: 6px;
}

.van-loading {
  text-align: center;
  margin-top: 80px;
}

.van-card {
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.van-collapse {
  margin-top: 4px;
}

.title {
  margin-top: 10px;
  padding: 0 10px;
}

.price-box {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.price {
  color: red;
  margin-top: 10px;
}

.opa {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
  padding-right: 10px;
}

.green {
  .van-tag--danger {
    background: green;
  }
}

/deep/.van-collapse-item__content {
  color: #555;
  padding: 10px 4px;
  .van-button {
    margin-left: 0;
  }
}

.package-staff {
  font-size: 10px;
  color: #777;
}

.van-card__footer {
  margin-top: 8px;
}

.sup-real {
  font-size: 10px;
  color: #777;
}
</style>
