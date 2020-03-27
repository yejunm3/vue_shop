<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="box-card-header">
        <el-input 
          v-model="queryInfo.query"
          placeholder="请输入内容"
          @keyup.native.enter="seachUsers" 
          @clear="getUsersList"
          clearable 
        ></el-input>
        <el-button icon="el-icon-search" circle @click="seachUsers"></el-button>
        <el-button round @click="dialogTableVisible = true">添加用户</el-button>
      </div>
      <!-- 主体 -->
      <el-table
        style="width: 100%"
        :data="usersList"
        :default-sort="{ prop: 'id', order: 'ascending' }"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="role_name" label="昵称"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <!--  -->
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable="false">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable="false">
            <el-button type="success" size="mini" icon="el-icon-check"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </el-table-column>
        <!--  -->
      </el-table>
      <!-- 分页 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 3, 4]"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog title="添加用户" :visible.sync="dialogTableVisible">
      这里放内容
    </el-dialog>

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
        pagesize: 2
      },
      usersList: [],
      total: null,
      dialogTableVisible: false
    }
  },
  methods: {
    // 获取用户列表
    async getUsersList() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.usersList = res.data.users
      this.total = res.data.total
      console.log(res.data)
    },
    // 监听分页 页码值变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getUsersList()
    },
    // 监听分页 下拉变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 修改用户状态 失败时值取反
    async changeState(stateMsg) {
      const { data: res } = await this.$axios.put(`users/${stateMsg.id}/state/${stateMsg.mg_state}`)
      if (res.meta.status !== 200) {
        stateMsg.mg_state = !stateMsg.mg_state
        return this.$message.error('更新状态失败')
      } else {
        this.$message.success('更新状态成功')
      }
      console.log(res)
    },
    // 搜索功能
    seachUsers() {
      this.getUsersList()
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
  .el-table {
    margin-bottom: 20px;
  }
}
</style>
