<template>
  <div>
    <el-button @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
