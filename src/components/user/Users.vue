<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="box-card-header">
        <el-input v-model="addValue" placeholder="请输入内容"></el-input>
        <el-button icon="el-icon-search" circle></el-button>
        <el-button round>添加用户</el-button>
      </div>
      <!-- 主体 -->
      <el-table
        :data="usersList"
        style="width: 100%"
        :default-sort = "{prop: 'id', order: 'ascending'}"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="role_name" label="昵称"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope='scope'>
              <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="success" icon="el-icon-check" circle></el-button>
          <!-- <el-button type="danger" icon="el-icon-delete" circle></el-button> -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /**
       * 查询参数
       * 当前页码
       * 每页显示条数
       */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      usersList: [],
      total: '',
      addValue: ''
    }
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.usersList = res.data.users
      this.total = res.data.total
      console.log(this.usersList)
    }
  },
  created() {
    this.getUsersList()
  }
}
</script>

<style lang="less">
.users {
  .el-breadcrumb {
    margin-bottom: 10px;
  }
  .el-card__header {
    padding: 13px 20px;
    .box-card-header {
      display: flex;
      .el-input {
        width: 50%;
        margin-right: 10px;
      }
    }
  }
}
</style>
