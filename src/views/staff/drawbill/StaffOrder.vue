<template>
  <div style="height: 100vh;">
    <van-nav-bar :border="false" @click-left="$goBack" fixed left-arrow title="开单收银" v-show="!status" />
    <div class="nav-bar-holder" v-show="!status"></div>
    <div v-show="!status" class="search-bar-parent">
      <div class="search-bar">
        <van-row align="center" gutter="20" type="flex">
          <van-col span="22">
            <van-field @click="_showSearchBar" clearable placeholder="商品名称" v-model="search">
              <template #left-icon>
                <van-icon :name="icon" class="bar-code" />
              </template>
            </van-field>
          </van-col>
          <van-col span="1">
            <van-icon :size="25" color="#fff" name="scan" />
          </van-col>
        </van-row>
      </div>
      <van-row align="center" type="flex">
        <van-col class="info" span="11">
          <van-icon name="manager" />
          <div>店员：{{ staffName }}</div>
        </van-col>
        <van-col class="info" span="13">
          <van-icon name="calender-o" />
          <div>日期：{{ $moment().format('YYYY-MM-DD') }}</div>
        </van-col>
      </van-row>
      <div :key="index" @click="_openOperatorMask(item)" class="order-box" v-for="(item, index) in curOrder">
        <van-row align="center" justify="center" type="flex">
          <van-col offset="1" span="5">
            <van-image :src="item.pic || item.goods_img" height="20vw" width="20vw" />
          </van-col>
          <van-col offset="1" span="7">{{ item.name }}</van-col>
          <van-col offset="1" span="4">x {{ item.num || item.goods_num }}</van-col>
          <van-col span="5" style="color: #e93e14;">¥ {{ item.pay_price }}</van-col>
        </van-row>
      </div>
      <transition name="fade">
        <div class="shortcut-bar" v-if="!expand">
          <div @click="_goOrder" class="shortcut-bar-item" style="background: #f56c6c;">点单</div>
          <!-- <div @click="_clearOrder" class="shortcut-bar-item" style="background: #666;">清空</div> -->
          <div @click="_entryOrder" class="shortcut-bar-item" style="background: rgba(0,150,255,0.8);">
            挂单
            <van-icon :badge="entryCount" class="badge" />
          </div>
          <div
            @click="$router.push(`/staffOrder/settlement`)"
            class="shortcut-bar-item"
            style="background: lightgreen;"
          >
            已结算
          </div>
        </div>
      </transition>
      <div class="shortcut-bar fix">
        <div @click="_clickLast" class="shortcut-bar-item last">
          <van-icon name="arrow-up" v-if="expand" />
          <van-icon name="arrow-down" v-else />
          <span>{{ expand ? '展开' : '收起' }}</span>
        </div>
      </div>

      <van-submit-bar :price="_totalPrice" @submit="_onSubmit" button-text="结算">
        <div class="total">共计：{{ _totalNum }} 件</div>
      </van-submit-bar>
    </div>
    <div v-show="status">
      <van-search
        @cancel="_searchCancel"
        @input="_onSearch"
        autofocus
        placeholder="请输入搜索关键词"
        ref="search"
        show-action
        v-model.lazy="search"
      >
        <template #left>
          <div
            @click="showSearchTypePicker = !showSearchTypePicker"
            style="margin-right: 10px; color: #666; font-size: 14px;"
          >
            {{ curSearch }}
          </div>
        </template>
      </van-search>

      <div :key="index" @click="_addGoodToCart(item)" class="search-box" v-for="(item, index) in searchResult">
        <van-row align="center" justify="center" type="flex">
          <van-col offset="1" span="8">
            <van-image :src="_listPic(item)" height="20vw" width="20vw" />
          </van-col>
          <van-col span="8">{{ item.appoint_name || item.name }}</van-col>
          <van-col span="8" style="color: #e93e14;">¥ {{ item.old_price || item.price }}</van-col>
        </van-row>
      </div>
      <div v-if="searchResult.length === 0">
        <van-empty description="暂无商品" />
      </div>
    </div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="showSearchTypePicker">
      <van-picker
        :columns="searchTypeColumns"
        @confirm="_pickSearchType"
        show-toolbar
        title="商品类型"
        value-key="label"
      />
    </van-popup>
    <van-popup position="bottom" safe-area-inset-bottom v-model="showMarkPicker">
      <van-picker :columns="markColumns" @confirm="_pickMark" show-toolbar title="选择标识位" value-key="s_name" />
    </van-popup>
    <van-popup
      class="operate-popup"
      close-on-click-overlay="false"
      closeable
      style="width: 90vw;"
      v-model="showOperatorPopup"
    >
      <div class="title">{{ curOperateOrder.name }}</div>
      <van-divider style="height: auto;" />
      <div>
        单价：
        <div style="color: #e93e14;">¥ {{ curOperateOrder.unit_price }}</div>
      </div>
      <div>
        数量：
        <van-stepper
          :disabled="curOperateOrder.type != 2"
          @change="_changeOperateOrderNum"
          v-model="curOperateOrder.goods_num"
        />
      </div>
      <div>
        总额：
        <van-field
          input-align="right"
          label="¥"
          label-width="20"
          placeholder="实付金额"
          v-model="curOperateOrder.pay_price"
        />
      </div>
      <div style="margin: 18px 0 4px 0;">
        <van-button size="small" type="danger">删除</van-button>
        <van-button @click="_modifyGood" size="small" type="primary">确定</van-button>
      </div>
    </van-popup>

    <van-dialog class="QRCode" title="用户扫码支付" v-model="showPayQRCode">
      <img :src="qrcode" />
    </van-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'staffOrder',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      staffName: '',
      search: '',
      icon: '',
      expand: false,
      status: false,
      showSearchTypePicker: false,
      showMarkPicker: false,
      showOperatorPopup: false,
      showPayQRCode: false,
      qrcode: '',
      searchTypeColumns: [
        {
          label: '商品',
          value: 2,
        },
        {
          label: '服务',
          value: 1,
        },
        {
          label: '套餐',
          value: 4,
        },
      ],
      markColumns: [],
      curSearch: '商品',
      curSearchType: 2,
      searchResult: [],
      curOrder: [],
      entryCount: 0,
      timer: null,
      curOperateOrder: {},
    }
  },

  computed: {
    _totalNum() {
      let total = 0
      this.curOrder.forEach(item => {
        total += item.num || item.goods_num - 0
      })
      return total
    },
    _totalPrice() {
      let total = 0
      this.curOrder.forEach(item => {
        total += (item.unit_price || item.price) * 100 * (item.goods_num || item.num)
      })
      return total
    },
  },

  watch: {},

  created() {},

  mounted() {
    this.icon = require('@/assets/images/xtb_06.png')
    const staff = sessionStorage.getItem('session_storestaff_store_staff')
    if (staff) {
      this.staffName = JSON.parse(sessionStorage.getItem('session_storestaff_store_staff').replace('obj||', '')).name
    }
    // const cacheOrder = localStorage.getItem('staffOrderCart')
    //   ? JSON.parse(localStorage.getItem('staffOrderCart'))
    //   : null
    // if (cacheOrder) {
    //   this.curOrder = cacheOrder
    // } else {
    this.getBillingOrder().then(res => {
      this.curOrder = res
    })
    // }
    this._getOrderCount()
  },

  destroyed() {},

  methods: {
    ...mapActions('staff', [
      'commitOrder',
      'getRetailList',
      'getServiceList',
      'getPackageList',
      'getBillingOrder',
      'getFreeMarkList',
      'entryOrder',
      'getOrderCount',
      'cancelOrder',
      'modifyGood',
      'payOrder',
    ]),
    _onSubmit() {
      if (this.curOrder.length) {
        this.payOrder({ order_id: this.curOrder[0].order_id }).then(res => {
          let qrcode =
            document.location.origin + '/appapi.php?g=Appapi&c=Imax2&a=geth5Qrcode&url=' + encodeURIComponent(res.url)
          this.qrcode = qrcode
          this.showPayQRCode = true
        })
      } else {
        this.$toast({
          message: '当前无操作中的订单',
          duration: 1000,
        })
      }
    },
    _listPic(item) {
      if (item.pic_arr) {
        return item.pic_arr[0].url
      } else if (item.pic) {
        return item.pic
      }
    },
    _modifyGood() {
      this.modifyGood({
        id: this.curOperateOrder.id,
        num: this.curOperateOrder.goods_num,
        pay_price: this.curOperateOrder.pay_price,
      }).then(() => {
        this.$toast.success({
          message: '修改完成',
          duration: 800,
          onClose: () => {
            this.getBillingOrder().then(res => {
              this.curOrder = res
            })
            this.showOperatorPopup = false
          },
        })
      })
    },
    _changeOperateOrderNum(value) {
      this.curOperateOrder.pay_price = (value * this.curOperateOrder.unit_price).toFixed(2)
    },
    _goOrder() {
      let order_id = this.curOrder[0] && this.curOrder[0].order_id
      if (order_id) {
        this.$router.push(`/staffOrder/commodity/${order_id}`)
      } else {
        this.$router.push(`/staffOrder/commodity`)
      }
    },
    _addGoodToCart(data) {
      debugger
      let order_id = this.curOrder[0] && this.curOrder[0].order_id
      let cart = this.curOrder.map(item => {
        if (
          (item.type == this.curSearchType && data.goods_id) ||
          data.appoint_id ||
          data.package_id == item.goods_appoint_id
        ) {
          return {
            id: item.goods_appoint_id,
            num: item.goods_num - 0 + 1,
            type: item.type,
            price: item.price,
          }
        } else {
          return {
            id: item.goods_appoint_id,
            num: item.goods_num,
            type: item.type,
            price: item.price,
          }
        }
      })
      this.commitOrder({
        list: cart,
        order_id: order_id,
      }).then(() => {
        this.$toast.success({
          message: '商品已加入购物车',
          duration: 800,
          onClose: () => {
            this.status = false
            this.curSearch = '商品'
            this.curSearchType = 2
            this.search = ''
            this.searchResult = []
            this.getBillingOrder().then(res => {
              this.curOrder = res
            })
          },
        })
      })
    },
    _getOrderCount() {
      this.getOrderCount().then(res => {
        this.entryCount = res.hangingCount
      })
    },

    _openOperatorMask(data) {
      this.showOperatorPopup = true
      this.curOperateOrder = JSON.parse(JSON.stringify(data))
    },
    _entryOrder() {
      // 当前有商品
      if (this.curOrder.length > 0) {
        // 挂过单
        if (this.curOrder[0].s_id) {
          this.entryOrder({ s_id: this.curOrder[0].s_id, order_id: this.curOrder[0].order_id }).then(() => {
            this.$toast.success({
              message: '挂单成功',
              duration: 800,
              onClose: () => {
                this._getOrderCount()
                this.curOrder = []
              },
            })
          })
        } else {
          // 没挂过单
          this._getMarkList()
        }
      } else {
        // 当前无商品
        this.$router.push(`/staffOrder/entryOrder`)
      }
    },
    _getMarkList() {
      // 获取空闲标识，打开标识选择
      this.getFreeMarkList().then(res => {
        this.markColumns = res
        this.showMarkPicker = true
      })
    },
    // 选择标识且挂单
    _pickMark(data) {
      let list = this.curOrder.map(item => {
        return {
          id: item.id,
          pay_price: item.pay_price,
        }
      })
      this.entryOrder({ s_id: data.id, list: list, order_id: this.curOrder[0].order_id }).then(() => {
        this.$toast.success({
          message: '挂单成功',
          duration: 800,
          onClose: () => {
            // localStorage.removeItem('staffOrderCart')
            this.curOrder = []
            this.showMarkPicker = false
            this._getOrderCount()
          },
        })
      })
    },
    _showSearchBar() {
      this.status = !this.status
      setTimeout(() => {
        this.$refs.search.children[1].children[0].children[1].children[0].children[0].focus()
      }, 50)
    },
    _clickLast() {
      this.expand = !this.expand
    },
    _searchCancel() {
      this.status = !this.status
      this.searchResult = []
      this.curSearch = '商品'
      this.curSearchType = 0
    },
    _onSearch(data) {
      if (data === '') {
        this.searchResult = []
        clearTimeout(this.timer)
        this.timer = null
        return false
      }
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      let method = ''
      switch (this.curSearchType) {
        case 2:
          method = 'getRetailList'
          break
        case 1:
          method = 'getServiceList'
          break
        case 4:
          method = 'getPackageList'
          break
      }
      this.timer = setTimeout(() => {
        this[method]({ name: data }).then(res => {
          let result = []
          let list = []
          for (let i in res) {
            list.push(res[i])
          }
          list.forEach(item => {
            item.goods_list.forEach(i => {
              result.push(i)
            })
          })
          this.searchResult = result
          clearTimeout(this.timer)
          this.timer = null
        })
      }, 500)
    },
    _pickSearchType(data) {
      this.curSearch = data.label
      this.curSearchType = data.value
      this.showSearchTypePicker = !this.showSearchTypePicker
    },
  },
}
</script>

<style lang="less" scoped>
.search-bar-parent {
  z-index: 99;
  margin-top: -5px;
}

.search-bar {
  background: @primary-c;
  padding: 15px 20px 15px 20px;
  .van-field {
    height: 30px;
    line-height: 30px;
    padding: 0 10px 0 20px;
    border-radius: 30px;
    font-size: 12px;
  }
  .bar-code {
    margin-right: 5px;
  }
}

.info {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 8px 0px 8px 20px;
  font-size: 12px;

  .van-icon {
    font-size: 16px;
    margin-right: 5px;
    color: @primary-c;
  }
}

.van-submit-bar__button--danger {
  background: @primary-c;
}

.total {
  font-size: 13px;
  color: #666;
}

.shortcut-bar {
  position: fixed;
  bottom: 140px;
  right: 15px;
  &.fix {
    bottom: 80px;
  }

  .shortcut-bar-item {
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background: red;
    width: 52px;
    height: 52px;
    border-radius: 26px;
    margin-top: 6px;
    font-size: 12px;
  }
  .last {
    flex-direction: column;
    background: rgba(153, 153, 153, 0.8);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.badge {
  position: relative;
  right: -5px;
  bottom: 15px;
}

.order-box {
  background: #fff;
  margin-top: 6px;
  font-size: 13px;
  color: #444;
  padding: 5px 0;

  .van-image {
    box-sizing: border-box;
  }
}

.search-box {
  background: #fff;
  margin-top: 6px;
  padding: 6px 0;
  font-size: 13px;
  color: #444;
}

.operate-popup {
  padding: 10px 14px;
  box-sizing: border-box;
  color: #444;
  font-size: 14px;

  .title {
    font-size: 14px;
    color: #222;
    margin: 0;
  }

  & > div {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .van-button {
      width: 40vw;
    }
  }

  .van-field {
    padding: 0;
    width: 40vw;
  }

  /deep/.van-field__control--right {
    border: 1px solid #ccc;
    text-align: center;
  }
}

.QRCode {
  /deep/.van-dialog__content {
    text-align: center;
  }

  img {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 40vw;
    height: 40vw;
  }
}
</style>
