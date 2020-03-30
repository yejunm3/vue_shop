<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!--  -->
      <el-table :data="rightList" :border="true" :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="权限id"></el-table-column>
        <el-table-column prop="authName" label="权限说明"></el-table-column>
        <el-table-column prop="level" label="权限层级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="danger" v-else-if="scope.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pid" label="权限父id"></el-table-column>
        <el-table-column prop="path" label="对应访问路径"></el-table-column>
      </el-table>
      <!--  -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$axios.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightList = res.data
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
