<template>
  <div class="container">
    <van-nav-bar @click-left="$goBack" fixed left-arrow :title="title" v-if="title === '聊天记录'" />
    <van-nav-bar @click-left="_backToRecordList" fixed left-arrow :title="title" else />
    <div class="nav-bar-holder"></div>
    <div v-if="!isChat">
      <div v-for="(item, index) in friendList" :key="index" class="f_box" @click="_goChat(item)">
        <van-row>
          <van-col span="16" class="f_name">
            {{ item.user_name }}
            <div class="f_badge" v-if="!item.haveRead"></div>
          </van-col>
          <van-col span="8" class="f_time">{{ _getChatTime(item) }}</van-col>
        </van-row>
        <div class="f_content">
          {{ _getChatContent(item) }}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="messageBox-content" ref="msgContent">
        <div
          v-for="(item, i) in msgList"
          :key="i"
          class="message-group"
          :style="{ float: item.bySelf ? 'right' : 'left' }"
        >
          <!-- 聊天时间 -->
          <div
            v-if="item.status !== 'recall'"
            class="time-style"
            :style="{ 'text-align': item.bySelf ? 'right' : 'left' }"
          >
            {{ _renderTime(item.time) }}
          </div>
          <div>
            <span style="user-select: none">
              <!-- <el-dropdown v-else @command="handleCommand(item)" trigger="click" :style="{'float':item.bySelf ? 'right':'left'}">
            <span class="el-dropdown-link">-->
              <!-- 图片消息 -->
              <img :key="item.message" :src="_getImgSrc(item.message)" v-if="item.type === 'img'" class="img-style" />
              <!-- 音频消息 -->
              <div v-else-if="item.type === 'audio'" :style="{ float: item.bySelf ? 'right' : 'left' }">
                <audio :src="_getAudioSrc(item.message)" controls controlsList="nodownload">></audio>
              </div>
              <!-- 聊天消息 -->
              <p style="user-select: text" v-else v-html="_renderTxt(item.message)" :class="{ bySelf: item.bySelf }" />
            </span>
          </div>
        </div>
      </div>

      <div class="messageBox-footer">
        <div class="footer-icon">
          <!-- 表情组件 -->
          <ChatEmoji v-on:selectEmoji="_selectEmoji" :inpMessage="message" />
          <!-- 上传图片组件 -->
          <UpLoadImage :type="type" :user="title" v-on:saveImgRecord="_saveImgRecord" :chatId="activedKey[type]" />
          <!-- 发送语音 -->
          <RecordAudio v-show="isHttps" :user="title" v-on:saveAudioRecord="_saveAudioRecord" />
        </div>
        <div class="fotter-send">
          <van-field
            v-model="message"
            type="textarea"
            placeholder="消息"
            class="sengTxt"
            @keyup.enter="_onSendTextMsg"
            ref="txtDom"
          />
          <template />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const DB_NAME = 'robot_chat',
  DB_VERSION = 1
import config from './WebIMConfig'
import WebIM from 'easemob-websdk'
import ChatEmoji from './components/emoji/index'
import UpLoadImage from './components/upLoadImage/index'
import RecordAudio from './components/recorder/index'
import emoji from '@/config/emoji'

export default {
  name: 'WithRobot',

  mixins: [],

  components: {
    ChatEmoji,
    UpLoadImage,
    RecordAudio,
  },

  props: {},

  data() {
    return {
      title: '聊天记录',
      isChat: false,
      conn: {},
      db: null,
      friendList: [],
      msgList: [],
      message: '',
      type: 'contact',
      activedKey: {
        contact: '',
        group: '',
        chatroom: '',
      },
      isHttps: window.location.protocol !== 'https:',
    }
  },
  updated() {
    this._scrollBottom()
  },
  computed: {},

  watch: {},

  created() {
    let that = this
    let conn = {}
    WebIM.config = config
    conn = WebIM.conn = new WebIM.connection({
      appKey: WebIM.config.appkey,
      isHttpDNS: WebIM.config.isHttpDNS,
      isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
      https: WebIM.config.https,
      url: WebIM.config.xmppURL,
      apiUrl: WebIM.config.apiURL,
      isAutoLogin: WebIM.config.isAutoLogin,
      heartBeatWait: WebIM.config.heartBeatWait,
      autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
      autoReconnectInterval: WebIM.config.autoReconnectInterval,
      isStropheLog: WebIM.config.isStropheLog,
      delivery: WebIM.config.delivery,
    })
    conn.listen({
      onOpened: function(message) {
        console.log('---连接成功回调---')
        console.log(message)
      }, //连接成功回调
      onClosed: function(message) {
        console.log('---连接关闭回调---')
        console.log(message)
      }, //连接关闭回调
      onTextMessage: message => {
        console.log('---收到文本消息---')
        console.log(message)
        that._receiveText(message)
      }, //收到文本消息
      onEmojiMessage: function(message) {
        console.log('---收到表情消息---')
        console.log(message)
      }, //收到表情消息
      onPictureMessage: function(message) {
        console.log('---收到图片消息---')
        console.log(message)
        that._receiveImage(message)
      }, //收到图片消息
      onCmdMessage: function(message) {
        console.log('---收到命令消息---')
        console.log(message)
      }, //收到命令消息
      onAudioMessage: function(message) {
        console.log('---连接关闭回调---')
        console.log(message)
      }, //收到音频消息
      onLocationMessage: function(message) {
        console.log('---收到位置消息---')
        console.log(message)
      }, //收到位置消息
      onFileMessage: function(message) {
        console.log('---收到文件消息---')
        console.log(message)
      }, //收到文件消息
      onVideoMessage: function(message) {
        console.log('---收到视频消息---')
        let node = document.getElementById('privateVideo')
        let option = {
          url: message.url,
          headers: {
            Accept: 'audio/mp4',
          },
          onFileDownloadComplete: function(response) {
            let objectURL = WebIM.utils.parseDownloadResponse.call(conn, response)
            node.src = objectURL
          },
          onFileDownloadError: function() {
            console.log('File down load error.')
          },
        }
        WebIM.utils.download.call(conn, option)
      }, //收到视频消息
      onPresence: function(message) {
        console.log('---处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息---')
        console.log(message)
      }, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      onRoster: function(message) {
        console.log('---处理好友申请---')
        console.log(message)
      }, //处理好友申请
      onInviteMessage: function(message) {
        console.log('---处理群组邀请---')
        console.log(message)
      }, //处理群组邀请
      onOnline: function() {
        console.log('---本机网络连接成功---')
      }, //本机网络连接成功
      onOffline: function() {
        console.log('---本机网络掉线---')
      }, //本机网络掉线
      onError: function(message) {
        console.log('---失败回调---')
        console.log(message)
      }, //失败回调
      onBlacklistUpdate: function(list) {
        console.log('---黑名单变动---')
        //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list)
      },
      onRecallMessage: function(message) {
        console.log('---收到撤回消息回调---')
        console.log(message)
      }, //收到撤回消息回调
      onReceivedMessage: function(message) {
        console.log('---收到消息送达服务器回执---')
        console.log(message)
      }, //收到消息送达服务器回执
      onDeliveredMessage: function(message) {
        console.log('---收到消息送达客户端回执---')
        console.log(message)
      }, //收到消息送达客户端回执
      onReadMessage: function(message) {
        console.log('---收到消息已读回执---')
        console.log(message)
      }, //收到消息已读回执
      onCreateGroup: function(message) {
        console.log('---创建群组成功回执---')
        console.log(message)
      }, //创建群组成功回执（需调用createGroupNew）
      onMutedMessage: function(message) {
        console.log('---如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员---')
        console.log(message)
      }, //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
    })
    this.conn = conn
  },

  mounted() {
    this._openDB()
  },

  destroyed() {},

  methods: {
    _openDB() {
      // 打开数据库 -> userList数据库
      let request = window.indexedDB.open(DB_NAME, DB_VERSION)
      request.onerror = e => {
        console.log(e.currentTarget.error.message)
      }
      request.onsuccess = e => {
        this.db = e.target.result
        // 创建事物 -> userList表
        let transaction = this.db.transaction(DB_NAME, 'readwrite')
        // 遍历数据表 -> userList表
        let store = transaction.objectStore(DB_NAME)
        let request = store.openCursor()
        request.onsuccess = el => {
          let cursor = el.target.result
          // 循环
          if (cursor) {
            console.log(cursor)
            this.friendList.push(cursor.value)
            cursor.continue()
          } else {
            console.log(this.friendList)
          }
        }
        let staff = JSON.parse(sessionStorage.getItem('session_storestaff_store_staff').replace('obj||', ''))
        this._login(staff.store_id, staff.store_name)
      }
      request.onupgradeneeded = e => {
        let db = e.target.result
        if (!db.objectStoreNames.contains(DB_NAME)) {
          db.createObjectStore(DB_NAME, { keyPath: 'id' })
        }
        console.log('DB version changed to ' + DB_VERSION)
      }
    },
    _register(merId, nickname) {
      let options = {
        apiUrl: WebIM.config.apiURL,
        username: 'mer_id_' + merId,
        password: merId,
        nickname: nickname,
        appKey: WebIM.config.appkey,
        success: res => {
          let token = res.access_token
          this._login(merId, nickname)
          console.log(token)
        },
        error: () => {},
      }
      this.conn.open(options)
    },
    _login(merId, nickname) {
      let options = {
        apiUrl: WebIM.config.apiURL,
        user: 'mer_id_' + merId,
        pwd: merId,
        appKey: WebIM.config.appkey,
        success: res => {
          let token = res.access_token
          console.log(token)
          console.log('登录成功')
        },
        error: res => {
          console.log(res)
          this._register(merId, nickname)
        },
      }
      this.conn.open(options)
    },
    _getChatContent(obj) {
      if (obj.message[obj.message.length - 1].type === 'text') {
        return obj.message[obj.message.length - 1].message
      } else if (obj.message[obj.message.length - 1].type === 'audio') {
        return '[语音]'
      } else if (obj.message[obj.message.length - 1].type === 'img') {
        return '[图片]'
      }
    },
    _getChatTime(obj) {
      return obj.message[obj.message.length - 1].time
    },
    _getTime() {
      let data = new Date()
      let sseconds = '',
        hour = '',
        minute = ''
      if (data.getSeconds() - 10 < 0) {
        sseconds = '0' + data.getSeconds()
      } else {
        sseconds = data.getSeconds()
      }
      if (data.getHours() - 10 < 0) {
        hour = '0' + data.getHours()
      } else {
        hour = data.getHours()
      }
      if (data.getMinutes() - 10 < 0) {
        minute = '0' + data.getMinutes()
      } else {
        minute = data.getMinutes()
      }
      return (
        data.getFullYear() +
        '/' +
        (data.getMonth() + 1) +
        '/' +
        data.getDate() +
        '  ' +
        hour +
        ':' +
        minute +
        ':' +
        sseconds
      )
    },
    _receiveText(obj) {
      const user = this.friendList.find(item => {
        if (item.id === obj.from) {
          return item
        }
      })
      // 更新数据
      if (user) {
        user.haveRead = false
        user.message.push({
          id: obj.id,
          message: obj.data,
          bySelf: false,
          time: this._getTime(),
          type: 'text',
        })
        this.friendList = [...this.friendList]
        this._updateRecord(user)
      } else {
        // 插入数据
        let haveRead = this.title === obj.from
        const item = {
          id: obj.from,
          user_id: obj.from,
          user_name: obj.from,
          haveRead: haveRead,
          message: [
            {
              id: obj.id,
              message: obj.data,
              bySelf: false,
              time: this._getTime(),
              type: 'text',
            },
          ],
        }
        this.friendList.push(item)
        this.friendList = [...this.friendList]
        this._createRecord(item)
      }
    },
    _createRecord(obj) {
      let request = this.db
        .transaction(DB_NAME, 'readwrite')
        .objectStore(DB_NAME)
        .add(obj)
      request.onsuccess = function() {
        console.log('数据写入成功')
      }

      request.onerror = function() {
        console.log('数据写入失败')
      }
    },
    _updateRecord(obj) {
      let request = this.db
        .transaction(DB_NAME, 'readwrite')
        .objectStore(DB_NAME)
        .put(obj)
      request.onsuccess = function() {
        console.log('数据更新成功')
      }

      request.onerror = function() {
        console.log('数据更新失败')
      }
    },
    _goChat(obj) {
      let item = this.friendList.find(item => {
        if (item.id === obj.id) {
          return item
        }
      })
      item.haveRead = true
      this.friendList = [...this.friendList]
      this._updateRecord(item)
      this.isChat = true
      this.title = obj.user_name
      this.msgList = obj.message
    },
    _backToRecordList() {
      this.isChat = false
      this.title = '聊天记录'
    },
    _scrollBottom() {
      setTimeout(() => {
        const dom = this.$refs.msgContent
        if (!dom) return
        dom.scrollTop = dom.scrollHeight
      }, 0)
    },
    _renderTime(time) {
      const nowStr = new Date()
      const localStr = time ? new Date(time) : nowStr
      const localMoment = this.$moment(localStr)
      return localMoment.format('MM-DD hh:mm A')
    },
    _selectEmoji(v) {
      this.$data.message = v
      this.$refs.txtDom.focus()
    },
    _onSendTextMsg() {
      let that = this
      if (this.message === '' || this.message === '\n') {
        this.message = ''
        return
      }
      this.message = this.message.trim()
      let id = this.conn.getUniqueId() // 生成本地消息id
      let msg = new WebIM.message('txt', id) // 创建文本消息
      msg.set({
        msg: this.message, // 消息内容
        to: this.title, // 接收消息对象（用户id）
        roomType: false,
        success: (id, serverMsgId) => {
          console.log('send private text Success')
          const user = that.friendList.find(item => {
            if (item.id === that.title) {
              return item
            }
          })
          user.message.push({
            id: serverMsgId,
            message: that.message,
            bySelf: true,
            time: that._getTime(),
            type: 'text',
          })
          that.friendList = [...that.friendList]
          that._updateRecord(user)
          that.message = ''
        }, // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
        fail: () => {
          console.log('Send private text error')
        }, // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
      })
      this.conn.send(msg.body)
    },
    _renderTxt(txt = '') {
      let rnTxt = []
      let match = null
      const regex = /(\[.*?\])/g
      let start = 0
      let index = 0
      while ((match = regex.exec(txt))) {
        index = match.index
        if (index > start) {
          rnTxt.push(txt.substring(start, index))
        }
        if (match[1] in emoji.obj) {
          const v = emoji.obj[match[1]]
          rnTxt.push(this.customEmoji(v))
        } else {
          rnTxt.push(match[1])
        }
        start = index + match[1].length
      }
      rnTxt.push(txt.substring(start, txt.length))
      return rnTxt.join('')
    },
    customEmoji(value) {
      return `<img src="${require('@/assets/emoji/' + value)}" style="width:20px"/>`
    },
    _saveAudioRecord(blob, id) {
      const user = this.friendList.find(item => {
        if (item.id === this.title) {
          return item
        }
      })
      if (user) {
        user.message.push({
          id: id,
          message: blob,
          bySelf: true,
          time: this._getTime(),
          type: 'audio',
        })
        this.friendList = [...this.friendList]
        this._updateRecord(user)
      }
    },
    _getAudioSrc(blob) {
      return URL.createObjectURL(blob)
    },
    _getImgSrc(file) {
      return file
    },
    _saveImgRecord(img, id) {
      const user = this.friendList.find(item => {
        if (item.id === this.title) {
          return item
        }
      })
      if (user) {
        user.message.push({
          id: id,
          message: img,
          bySelf: true,
          time: this._getTime(),
          type: 'img',
        })
        this.friendList = [...this.friendList]
        this._updateRecord(user)
      }
    },
    _receiveImage(obj) {
      const user = this.friendList.find(item => {
        if (item.id === obj.from) {
          return item
        }
      })
      // 更新数据
      if (user) {
        user.message.push({
          id: obj.id,
          message: obj.url,
          bySelf: false,
          time: this._getTime(),
          type: 'img',
        })
        this.friendList = [...this.friendList]
        this._updateRecord(user)
      } else {
        // 插入数据
        let haveRead = this.title === obj.from
        const item = {
          id: obj.from,
          user_id: obj.from,
          user_name: obj.from,
          haveRead: haveRead,
          message: [
            {
              id: obj.id,
              message: obj.url,
              bySelf: false,
              time: this._getTime(),
              type: 'img',
            },
          ],
        }
        this.friendList.push(item)
        this.friendList = [...this.friendList]
        this._createRecord(item)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  overflow: hidden;
}
.f_name {
  font-weight: 500;
  height: 35px;
  line-height: 35px;
  padding-left: 6px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.f_time {
  color: #888c98;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  text-align: right;
}

.f_content {
  padding-left: 6px;
  color: rgba(0, 0, 0, 0.75);
}

.f_box {
  min-height: 80px;
  padding: 4px 8px 12px 8px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(238, 238, 238);
}

.f_box:hover {
  background: #d9d9d9;
}

.f_badge {
  display: inline-block;
  width: 6px;
  height: 6px;
  vertical-align: super;
  background: #ff4d4f;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #fff;
}

.messageBox-content {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 190px);
  top: 50px;
  background: #fff;
  padding: 10px 16px;
  overflow: scroll;

  .message-group {
    padding-top: 3px;
    font-size: 14px;
    line-height: 1.5;
    clear: both;
    width: 100%;

    p {
      list-style: none;
      min-width: 100px;
      background: #fff;
      text-align: left;
      padding: 10px 14px;
      border-radius: 25px;
      border: 1px solid #eceff1;
      display: inline-block;
      margin-top: 11px;
      word-break: break-all;

      &.bySelf {
        background: #eceff1;
        float: right;
      }
    }
  }
}

.messageBox-footer {
  border-top: 1px solid #d6dce0;
  position: absolute;
  bottom: 0;
  width: 100%;
  // height    : 150px;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;

  .footer-icon {
    padding: 15px 10px;
    text-align: left;
    height: 20px;
    display: flex;

    .van-icon {
      margin-left: 8px;
      cursor: pointer;
    }

    .icon {
      color: rgba(0, 0, 0, 0.65);
      font-size: 20px;
      margin-left: 8px;
    }
  }

  .fotter-send {
    height: 100px;
    width: 100%;
    padding-left: 10px;

    .sengTxt {
      text-align: left;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      bottom: 5px;
      font-size: 14px;
      padding-left: 10px;
      box-shadow: 0 0 0 0;
      border: 1px solid #fff;
      outline-style: none;
    }

    .van-icon {
      position: absolute;
      right: 10px;
      top: 45px;
    }
  }
}

.time-style {
  clear: both;
  margin-left: 2px;
  margin-top: 3px;
  font-size: 12px;
  color: #888c98;
}

/deep/.van-field__control {
  min-height: 80px;
}

.img-style {
  width: 100%;
}
</style>
