<template>
  <el-container class="main">
    <!-- 侧边栏 Start -->
    <el-aside width="auto">
      <el-menu
        default-active="1-1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#35495e"
        text-color="#fff"
      >
        <div class="main-title">
          <img src="../assets/logo.png" />
          <h3 v-show="!isCollapse">后台管理系统</h3>
        </div>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 侧边栏 End -->
    <el-container>
      <!-- 页头 Start -->
      <el-header>
        <div class="handle-span">
          <span
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="handleSpan"
          ></span>
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar>admin</el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
            <el-dropdown-item>关于我们</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 页头 End -->
      <!-- 主体 Start -->
      <el-main>
        主体
      </el-main>
      <!-- 主体 End -->
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    // 退出登录
    loginOut() {
      this.$confirm('您确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.$message({
          type: 'success',
          message: '退出登录成功!'
        })
        window.sessionStorage.clear()
        this.$router.push({ name: 'login' })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleSpan() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  height: 100%;
}
.main-title {
  max-width: 220px;
  height: 70px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #273646;
}
.main-title img {
  width: 30px;
  margin-left: 17px;
}
.main-title h3 {
  display: inline-block;
  color: #fff;
  margin-left: 10px;
  white-space: nowrap;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
.el-aside {
  background: #35495e;
  box-shadow: 1px 1px 5px rgba(0, 21, 41, 0.35);
  z-index: 98;
  overflow: hidden;
}
.el-menu {
  border: none;
}
.el-header {
  width: 100%;
  height: 70px !important;
  background: #fff;
  box-shadow: 1px 1px 5px rgba(0, 21, 41, 0.35);
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.handle-span {
  font-size: 22px;
  color: #999;
  cursor: pointer;
}
.el-dropdown-item {
  cursor: pointer;
}
.el-main {
  background: #f7f7f7;
}
</style>
