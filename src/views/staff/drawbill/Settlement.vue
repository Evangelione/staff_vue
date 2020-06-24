<template>
  <div>
    <van-nav-bar :border="false" @click-left="$goBack" fixed left-arrow title="已结算订单" />
    <div class="nav-bar-holder-sp"></div>
    <van-tabs type="card">
      <van-tab title="已结算">内容 1</van-tab>
      <van-tab title="已取消">
        <div :key="index" v-for="(item, index) in cancelList">
          <van-panel>
            <div class="van-hairline--bottom" slot="header">
              <van-row class="header">
                <van-col span="24">
                  <div class="title">
                    <van-icon name="label-o" />
                    <span>{{ item.s_name }}</span>
                  </div>
                  <div class="desc">订单号：{{ item.order_no }}</div>
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
                      <div v-if="item2.service_status === '2'">待服务</div>
                      <div v-if="item2.service_status === '3'">服务中</div>
                      <div v-if="item2.service_status === '4'">待验收</div>
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
                        <div v-if="item3.service_status === '2'">待服务</div>
                        <div v-if="item3.service_status === '3'">服务中</div>
                        <div v-if="item3.service_status === '4'">待验收</div>
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
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'settlement',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      cancelList: [],
      resultList: [],
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this._getSettledOrderList()
    this._getCancelOrderList()
  },

  destroyed() {},

  methods: {
    ...mapActions('staff', ['getSettledOrderList', 'getCancelOrderList']),
    _getSettledOrderList() {
      this.getSettledOrderList().then(res => {
        // console.log(res)
        this.resultList = res
      })
    },
    _getCancelOrderList() {
      this.getCancelOrderList().then(res => {
        // console.log(res)
        this.cancelList = res
      })
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
</style>
