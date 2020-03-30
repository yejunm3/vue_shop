<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!--  -->
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            {{scope.row}}
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      </el-table>
      <!--  -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    }
  },
  created() {
      this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
