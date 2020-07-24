<template>
  <label for="uploadImage">
    <van-icon name="photo-o" size="20" style="margin-left: 10px" color="rgba(0, 0, 0, 0.65)" />
    <input id="uploadImage" type="file" class="hide" ref="imgDom" @change="pictureChange" />
  </label>
</template>

<script>
import WebIM from 'easemob-websdk'

export default {
  data() {
    return {
      image: null,
    }
  },
  methods: {
    pictureChange(e) {
      let file = WebIM.utils.getFileUrl(e.target)
      if (!file.filename) {
        this.$refs.imgDom.value = null
        return false
      }
      var id = WebIM.conn.getUniqueId() // 生成本地消息id
      var msg = new WebIM.message('img', id) // 创建图片消息
      var allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true,
        jpeg: true,
      }
      let that = this
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: this.user, // 接收消息对象
          roomType: false,
          onFileUploadError: function() {
            // 消息上传失败
            that.$refs.imgDom.value = null
            console.log('onFileUploadError')
          },
          onFileUploadComplete: function() {
            // 消息上传成功
            that.$refs.imgDom.value = null
            console.log('onFileUploadComplete')
          },
          success: function(id, mid) {
            // 消息发送成功
            that.$refs.imgDom.value = null
            console.log('Success')
            that.$emit('saveImgRecord', msg.body.body.url, mid)
          },
          flashUpload: WebIM.flashUpload,
        }
        msg.set(option)
        WebIM.conn.send(msg.body)
      }
    },
  },
  props: [
    'type', // 聊天类型 contact, group, chatroom
    'chatId', // 选中的聊天对象
    'user',
  ],
}
</script>
<style scoped>
.hide {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  filter: alpha(opacity=0);
  opacity: 0;
  cursor: inherit;
  display: none;
}
</style>
