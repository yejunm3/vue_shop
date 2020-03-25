<template>
  <el-container class="main">
    <!-- 侧边栏 -->
    <el-aside width="auto">
      <el-menu
        :default-active="defaultIndex + ''"
        :collapse="isCollapse"
        :unique-opened="true"
        class="el-menu-vertical-demo"
        background-color="#35495e"
        text-color="#fff"
        router
      >
        <div class="main-title">
          <img src="../assets/logo.png" />
          <h3 v-show="!isCollapse">后台管理系统</h3>
        </div>
        <!-- 侧边栏渲染：这里绑定的index必须是唯一的字符串，item.id直接加上一个空字符串即可 -->
        <el-submenu v-for="subList in menuList" :key="subList.id" :index="subList.id + ''">
          <template slot="title">
            <i :class="iconList[subList.id]"></i>
            <span slot="title">{{ subList.authName }}</span>
          </template>
          <!-- 子侧边栏渲染 -->
          <el-menu-item
            v-for="item in subList.children"
            :key="item.id"
            :index="item.path + ''"
            @click="changeDefaultIndex(item.path)"
          >{{ item.authName }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 页头 -->
      <el-header>
        <div class="handle-span">
          <span :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="handleSpan"></span>
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
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menuList: [],
      defaultIndex: 'users'
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
        this.$message.success('退出登录成功!')
        window.sessionStorage.clear()
        this.$router.push({ name: 'login' })
      })
      .catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 侧边栏切换
    handleSpan() {
      this.isCollapse = !this.isCollapse
    },
    // 侧边栏参数
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      this.menuList = res.data
      console.log(this.menuList)
    },
    // 更改默认值
    changeDefaultIndex(path) {
      window.sessionStorage.setItem('defaultIndex', path)
      this.defaultIndex = path
    },
    // 获取默认值
    getDefaultIndex() {
      this.defaultIndex = window.sessionStorage.getItem('defaultIndex') || this.defaultIndex
      console.log(this.defaultIndex)
    }
  },
  // 重构图标 返回`[列表id]: class名`这样形式的数组
  computed: {
    iconList: function() {
      let iconArr = [
        'el-icon-user-solid',
        'el-icon-s-cooperation',
        'el-icon-s-goods',
        'el-icon-s-shop',
        'el-icon-s-data'
      ]
      let iconListArr = []
      this.menuList.forEach((item, i) => {
        iconListArr[item.id] = iconArr[i]
      })
      console.log(iconListArr)
      return iconListArr
    }
  },
  created() {
    this.getMenuList()
    this.getDefaultIndex()
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
