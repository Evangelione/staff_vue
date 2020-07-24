<template>
  <span>
    <el-popover placement="top" width="360" v-model="showModal">
      <img
        v-for="(v, i) in emojiList"
        :src="require(`@/assets/emoji/${v}`)"
        :key="i"
        @click="selectEmoji(i)"
        class="img-style"
      />
      <van-icon slot="reference" name="smile-o" size="20" color="rgba(0, 0, 0, 0.65)" />
    </el-popover>
  </span>
</template>

<script>
import emoji from '@/config/emoji'

export default {
  data() {
    return {
      emojiList: emoji.obj,
      currentEmoji: '',
      showModal: false,
    }
  },
  methods: {
    selectEmoji(e) {
      let value = (this.inpMessage || '') + e
      this.showModal = false
      this.$emit('selectEmoji', value)
    },
  },
  props: {
    inpMessage: String,
  },
}
</script>
<style scoped>
.img-style {
  width: 22px;
  margin: 5px;
  cursor: pointer;
}
.img-style:hover {
  background-color: aquamarine;
}
</style>
