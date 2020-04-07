<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 级联选择 -->
      <el-row>
        <span>商品选择<el-link type="danger">（仅能为第三级进行操作）</el-link></span>
        <el-cascader
        v-model="shopsValue"
        :options="shopsList"
        :props="shopsListProps"
        @change="shopsValueChange"
        ></el-cascader>
      </el-row>
      <!-- 主体 -->
    </el-card>
    <!--  -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      shopsList: [],
      shopsValue: '',
      shopsListProps: {
        label: 'cat_name',
        value: 'cat_id'
      }
    }
  },
  methods: {
    // 获取下拉列表
    async getShopsList() {
      const { data: res } = await this.$axios.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.shopsList = res.data
    },
    // 监听下拉列表值
    shopsValueChange(value) {
      console.log(value)
    }
  },
  created() {
    this.getShopsList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
