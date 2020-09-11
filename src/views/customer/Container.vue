<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CustomerContainer',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    console.log(this.$route)
  },

  destroyed() {},

  methods: {
    ...mapActions(['connWs']),
  },
}
</script>

<style></style>
