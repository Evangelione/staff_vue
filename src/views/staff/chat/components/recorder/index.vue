<template>
  <div>
    <van-popup v-model="reCoderVisible">
      <div class="reCoder" v-show="reCoderVisible">
        <div class="sound-waves">
          <div
            v-for="(iHeight, index) in randomHeight"
            :key="index"
            class="wavesItem"
            :style="{ height: iHeight + 'px' }"
          ></div>
        </div>
        <div class="tipText">按住开始录音</div>
        <a-button
          type="primary"
          class="holdBtn"
          @touchstart="mouseStart"
          @touchend="mouseEnd('audio')"
          @mousedown.prevent="mouseStart"
          @mouseup.prevent="mouseEnd('audio')"
        >
          <svg
            t="1571062524943"
            class="icon microphone"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2945"
            width="200"
            height="200"
          >
            <path
              d="M714 605.9v-338c0-111.4-90.6-202-202-202s-202 90.6-202 202v338c0 104.6 80 190.9 182 201v111.2H379c-11 0-20 9-20 20s9 20 20 20h266c11 0 20-9 20-20s-9-20-20-20H532V806.9c102-10.1 182-96.4 182-201z m-202-500c89.3 0 162 72.7 162 162v318H350v-318c0-89.4 72.7-162 162-162z m-160.8 520h321.5c-9.9 79.9-78.2 142-160.8 142s-150.8-62.1-160.7-142z"
              fill="#565656"
              p-id="2946"
            ></path>
            <path
              d="M455.4 193.8m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2947"
            ></path>
            <path
              d="M455.4 303.5m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2948"
            ></path>
            <path
              d="M455.4 413.2m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2949"
            ></path>
            <path
              d="M455.4 522.9m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2950"
            ></path>
            <path
              d="M398.9 248.7m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2951"
            ></path>
            <path
              d="M398.9 358.4m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2952"
            ></path>
            <path
              d="M398.9 468.1m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2953"
            ></path>
            <path
              d="M512 248.7m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2954"
            ></path>
            <path
              d="M512 358.4m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2955"
            ></path>
            <path
              d="M512 468.1m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2956"
            ></path>
            <path
              d="M568.6 193.8m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2957"
            ></path>
            <path
              d="M568.6 303.5m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2958"
            ></path>
            <path
              d="M568.6 413.2m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2959"
            ></path>
            <path
              d="M568.6 522.9m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2960"
            ></path>
            <path
              d="M625.1 248.7m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2961"
            ></path>
            <path
              d="M625.1 358.4m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2962"
            ></path>
            <path
              d="M625.1 468.1m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z"
              fill="#565656"
              p-id="2963"
            ></path></svg
        ></a-button>
      </div>
    </van-popup>

    <div class="wrap">
      <van-icon name="volume-o" size="20" style="margin-left: 10px;" @click="show" />
    </div>
  </div>
</template>

<script>
import WebIM from 'easemob-websdk'
import recording from './recordAudio.js'
import { mapActions } from 'vuex'
export default {
  props: ['user'],
  data() {
    return {
      form: {
        time: '按住说话(60秒)',
        audioUrl: '',
      },
      num: 60, // 按住说话时间
      recorder: null,
      interval: '',
      audioFileList: [], // 上传语音列表
      startTime: '', // 语音开始时间
      endTime: '', // 语音结束
      audioSrc: '',

      randomHeight: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      runAnimation: false,
      reCoderVisible: false,
    }
  },
  methods: {
    ...mapActions(['sendRecorder']),
    // 清除定时器
    clearTimer() {
      if (this.interval) {
        this.num = 60
        clearInterval(this.interval)
      }
    },
    onRandom() {
      let me = this
      let _randomHeight = this.randomHeight.concat([])
      let i = 0
      this.$data.randomHeight = _randomHeight
      if (this.runAnimation) {
        for (i; i < this.randomHeight.length; i++) {
          _randomHeight[i] = 60 * Math.random().toFixed(2) + 10
        }
        setTimeout(function() {
          me.onRandom()
        }, 500)
      }
    },
    hide() {
      this.reCoderVisible = false
    },
    show() {
      this.reCoderVisible = true
    },
    // 长按说话
    mouseStart(e) {
      e.preventDefault()
      this.runAnimation = true
      this.onRandom()
      this.clearTimer()
      this.startTime = new Date().getTime()

      recording.get(rec => {
        // 当首次按下时，要获取浏览器的麦克风权限，所以这时要做一个判断处理
        if (rec) {
          // 首次按下，只调用一次
          if (this.flag) {
            this.mouseEnd()
            this.flag = false
          } else {
            this.recorder = rec
            this.interval = setInterval(() => {
              if (this.num <= 0) {
                this.recorder.stop()
                this.num = 60
                this.clearTimer()
              } else {
                this.num--
                this.time = '松开结束（' + this.num + '秒）'
                this.recorder.start()
              }
            }, 1000)
          }
        }
      })
    },

    // 松开时上传语音
    mouseEnd(type) {
      let that = this
      this.runAnimation = false
      // this.$data.randomHeight = this.randomHeight.map(i => i = 30)
      this.hide()
      this.clearTimer()
      this.endTime = new Date().getTime()
      if (this.recorder) {
        this.recorder.stop()
        // 重置说话时间
        this.num = 60
        this.time = '按住说话（' + this.num + '秒）'
        // 获取语音二进制文件
        let blob = this.recorder.getBlob()
        // 发送语音功能
        if (type === 'audio') {
          var id = WebIM.conn.getUniqueId() // 生成本地消息id
          var msg = new WebIM.message('audio', id) // 创建音频消息
          var option = {
            apiUrl: WebIM.config.apiURL,
            file: {
              filename: 'audio',
              filetype: 'audio',
              data: blob,
            },
            to: this.user, // 接收消息对象
            roomType: false,
            onFileUploadError: function() {
              // 消息上传失败
              console.log('onFileUploadError')
            },
            onFileUploadComplete: function() {
              // 消息上传成功
              console.log('onFileUploadComplete')
            },
            success: function(id, mid) {
              // 消息发送成功
              that.$emit('saveAudioRecord', blob, mid)
              console.log('Success')
            },
            flashUpload: WebIM.flashUpload,
            ext: { file_length: blob.size },
          }
          msg.set(option)
          WebIM.conn.send(msg.body)
        }
      }
    },
  },
}
</script>

<style scoped>
.van-popup {
  border-radius: 10px;
  padding: 15px;
}
.reCoder {
  position: relative;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.15);
  width: 200px;
  height: 200px;
  background: #fff;
}
.sound-waves {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
}
.wavesItem {
  border: 1px solid #f2f2f2;
  width: 4px;
  background: green;
  margin: 2px;
}
.tipText {
  text-align: center;
  font-size: 14px;
  position: absolute;
  bottom: 70px;
  width: 100%;
}
.holdBtn {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  text-align: center;
  padding: 0;
  position: absolute;
  bottom: 10px;
  left: calc(50% - 25px);
  background: green;
}
.microphone {
  height: 50px;
  width: 30px;
  margin: 0 !important;
}
</style>
