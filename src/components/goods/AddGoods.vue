<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <el-steps :active="active" finish-status="success">
        <el-step title="1"></el-step>
        <el-step title="2"></el-step>
        <el-step title="3"></el-step>
        <el-step title="4"></el-step>
        <el-step title="5"></el-step>
        <el-step title="6"></el-step>
      </el-steps>
      <!-- 主体 -->
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            active: 0
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
