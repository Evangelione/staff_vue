<template>
  <div>
    <van-nav-bar @click-left="$goBack" fixed left-arrow title="选择商品" />
    <div class="nav-bar-holder"></div>
    <van-tree-select :height="_height" :items="items" :main-active-index.sync="activeIndex">
      <template #content>
        <!-- 商品 -->
        <van-index-bar v-show="activeIndex === 0">
          <div :key="item.sort_id" v-for="item in retailList">
            <van-index-anchor :index="item.sort_name" />
            <van-card
              :key="i.goods_id"
              :num="i.stock_num == '-1' ? '∞' : i.stock_num - i.num"
              :price="i.price"
              :thumb="i.pic_arr[0].url"
              :title="i.name"
              v-for="i in item.goods_list"
            >
              <template #footer>
                <van-stepper
                  @minus="_minus(2, i.goods_id)"
                  @plus="_plus(2, i.goods_id, i.price, i.pic_arr[0].url, i.name)"
                  default-value="0"
                  disable-input
                  :min="i.min"
                  v-model="i.num"
                />
              </template>
            </van-card>
            <van-cell />
          </div>
          <van-empty description="暂无商品" v-if="retailList.length === 0"></van-empty>
        </van-index-bar>

        <!-- 服务 -->
        <van-index-bar v-show="activeIndex === 1">
          <div :key="item.cat_id" v-for="item in serviceList">
            <van-index-anchor :index="item.cat_name" />
            <van-card
              :key="i.appoint_id"
              :price="i.old_price"
              :thumb="i.pic"
              :title="i.appoint_name"
              num="∞"
              v-for="i in item.goods_list"
            >
              <template #footer>
                <van-stepper
                  :min="i.min"
                  @minus="_minus(1, i.appoint_id)"
                  @plus="_plus(1, i.appoint_id, i.old_price, i.pic, i.appoint_name)"
                  default-value="0"
                  disable-input
                  v-model="i.num"
                />
              </template>
            </van-card>
            <van-cell />
          </div>
          <van-empty description="暂无服务" v-if="serviceList.length === 0"></van-empty>
        </van-index-bar>

        <!-- 套餐 -->
        <van-index-bar v-show="activeIndex === 2">
          <div :key="item.cat_id" v-for="item in packageList">
            <van-index-anchor :index="item.cat_name" />
            <van-card
              :key="i.package_id"
              :price="i.price"
              :thumb="i.pic"
              :title="i.name"
              num="∞"
              v-for="i in item.goods_list"
            >
              <template #footer>
                <van-stepper
                  :min="i.min"
                  @minus="_minus(4, i.package_id)"
                  @plus="_plus(4, i.package_id, i.price, i.pic, i.name)"
                  default-value="0"
                  disable-input
                  v-model="i.num"
                />
              </template>
              <template #desc>
                <div :key="index" v-for="(good, index) in i.detail">{{ good.name + ' x ' + good.goods_num }}</div>
              </template>
            </van-card>
            <van-cell />
          </div>
          <van-empty description="暂无套餐" v-if="serviceList.length === 0"></van-empty>
        </van-index-bar>
      </template>
    </van-tree-select>

    <van-submit-bar
      :price="_price"
      @submit="_onSubmit"
      button-text="加入购物车"
      tip="选择的商品将会您的加入购物车"
      tip-icon="info-o"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'commodityList',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      activeIndex: 0,
      retailList: [],
      serviceList: [],
      packageList: [],
      items: [
        { text: '商品', badge: 0 },
        { text: '服务', badge: 0 },
        { text: '套餐', badge: 0 },
      ],
      loading: false,
      finished: true,
      cart: [],
    }
  },

  computed: {
    _height() {
      return window.innerHeight - 46
    },
    _price() {
      let total = 0
      this.cart.forEach(item => {
        total += item.price * 100 * item.num
      })
      return total
    },
  },

  watch: {},

  created() {},

  mounted() {
    // if (!this.$route.params.orderId) {
    //   this.cart = localStorage.getItem('staffOrderCart') ? JSON.parse(localStorage.getItem('staffOrderCart')) : []
    // }
    // 读取商品列表 && 向购物车中添加已购买数据
    // order_id: this.$route.params.orderId
    this.getRetailList({ staff_id: this.$route.params.id, order_id: this.$route.params.orderId }).then(res => {
      let list = []
      for (let i in res) {
        list.push(res[i])
      }

      // // 从缓存拿数据
      // if (!this.$route.params.orderId) {
      //   list.forEach(item => {
      //     item.goods_list.forEach(i => {
      //       this.cart.find(g => {
      //         if (g.type === 2 && g.id === i.goods_id) {
      //           this.items[0].badge += g.num
      //           i.num = g.num
      //         }
      //       })
      //     })
      //   })
      // } else {
      // 循环所有商品，找出num>1的商品并添加到购物车中
      list.forEach(item => {
        item.goods_list.forEach(i => {
          i.min = i.num
          if (i.num > 0) {
            this.items[0].badge += i.num
            this.cart.push({
              id: i.goods_id,
              num: i.num,
              type: 2,
              price: i.price,
              pic: i.pic_arr[0],
              name: i.name,
            })
          }
        })
      })
      // }
      this.retailList = list
    })

    // 读取服务列表 && 向购物车中添加已购买数据
    // order_id: this.$route.params.orderId
    this.getServiceList({ staff_id: this.$route.params.id, order_id: this.$route.params.orderId }).then(res => {
      let list = []
      for (let i in res) {
        list.push(res[i])
      }

      // // 从缓存拿数据
      // if (!this.$route.params.orderId) {
      //   list.forEach(item => {
      //     item.goods_list.forEach(i => {
      //       this.cart.find(g => {
      //         if (g.type === 1 && g.id === i.appoint_id) {
      //           this.items[1].badge += g.num
      //           i.num = g.num
      //         }
      //       })
      //     })
      //   })
      // } else {
      // 循环所有服务，找出num>1的商品并添加到购物车中
      list.forEach(item => {
        item.goods_list.forEach(i => {
          i.min = i.num
          if (i.num > 0) {
            this.items[1].badge += i.num
            this.cart.push({
              id: i.appoint_id,
              num: i.num,
              type: 1,
              price: i.old_price,
              pic: i.pic,
              name: i.appoint_name,
            })
          }
        })
      })
      // }
      this.serviceList = list
    })

    // 读取套餐列表 && 向购物车中添加已购买数据
    // order_id: this.$route.params.orderId
    this.getPackageList({ staff_id: this.$route.params.id, order_id: this.$route.params.orderId }).then(res => {
      let list = []
      for (let i in res) {
        list.push(res[i])
      }

      // // 从缓存拿数据
      // if (!this.$route.params.orderId) {
      //   list.forEach(item => {
      //     item.goods_list.forEach(i => {
      //       this.cart.find(g => {
      //         if (g.type === 4 && g.id === i.package_id) {
      //           this.items[2].badge += g.num
      //           i.num = g.num
      //         }
      //       })
      //     })
      //   })
      // } else {
      // 循环所有套餐，找出num>1的商品并添加到购物车中
      list.forEach(item => {
        item.goods_list.forEach(i => {
          i.min = i.num
          if (i.num > 0) {
            this.items[2].badge += i.num
            this.cart.push({
              id: i.package_id,
              num: i.num,
              type: 4,
              price: i.price,
              pic: i.pic,
              name: i.name,
            })
          }
        })
      })
      // }
      this.packageList = list
    })
  },

  destroyed() {},

  methods: {
    ...mapActions('staff', ['getRetailList', 'getServiceList', 'getPackageList', 'entryOrder', 'commitOrder']),
    _minus(type, id) {
      const index = this.cart.findIndex(item => {
        if (item.id === id) {
          return item
        }
      })
      if (index !== -1) {
        this.cart[index].num -= 1
        if (this.cart[index].num === 0) {
          this.cart.splice(index, 1)
        }
      } else {
        // console.log('没有还减')
      }
      this._changeNum(type, 1)
    },
    _plus(type, id, price, pic, name) {
      const index = this.cart.findIndex(item => {
        if (item.id === id) {
          return item
        }
      })
      if (index !== -1) {
        this.cart[index].num += 1
      } else {
        this.cart.push({ id: id, num: 1, type: type, price: price, pic: pic, name: name })
      }
      this._changeNum(type, 0)
    },
    _changeNum(type, operation) {
      let num = 0
      if (operation === 0) {
        num = 1
      } else {
        num = -1
      }
      if (type === 1) {
        this.items[1].badge += num
      } else if (type === 2) {
        this.items[0].badge += num
      } else if (type === 3) {
        this.items[3].badge += num
      } else if (type === 4) {
        this.items[2].badge += num
      }
    },
    _onSubmit() {
      if (this.$route.params.orderId) {
        this.commitOrder({ list: this.cart, order_id: this.$route.params.orderId }).then(() => {
          this.$toast.success({
            message: '商品已加入购物车',
            duration: 800,
            onClose: () => {
              this.$router.replace({ path: `/staffOrder` })
            },
          })
        })
      } else {
        // 存入本地
        // localStorage.setItem('staffOrderCart', JSON.stringify(this.cart))
        // this.$toast.success({
        //   message: '商品已加入购物车',
        //   duration: 800,
        //   onClose: () => {
        //     this.$goBack()
        //   },
        // })

        this.commitOrder({ list: this.cart }).then(() => {
          this.$toast.success({
            message: '商品已加入购物车',
            duration: 800,
            onClose: () => {
              this.$router.replace({ path: `/staffOrder` })
            },
          })
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.van-nav-bar--fixed {
  z-index: 999;
}

.van-index-bar {
  padding-bottom: 80px;
}

/deep/.van-index-bar__sidebar {
  display: none;
}

/deep/.van-info {
  right: -10px;
}

.van-tree-select__content {
  flex: 3;
}

.van-stepper {
  margin: 10px 0 5px;
}

/deep/.van-index-anchor--sticky {
  color: @primary-c;
}
</style>
