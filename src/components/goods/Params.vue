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
        <span>商品选择：</span>
        <el-cascader
        v-model="shopsId"
        :options="shopsList"
        :props="shopsListProps"
        @change="shopsValueChange"
        ></el-cascader>
      </el-row>

      <!-- tabs切换 -->
      <el-tabs v-model="attributeType" @tab-click="attributeTypeChange">
        <!-- tabs-1 -->
        <el-tab-pane label="动态参数" name="only">
          <el-button plain :disabled="isDisabledButton">添加动态参数</el-button>
          <el-table :data="activeParams" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                {{scope.row}}
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-edit">编辑</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- tabs-2 -->
        <el-tab-pane label="静态属性" name="many">
          <el-button plain :disabled="isDisabledButton">添加静态属性</el-button>
          <el-table :data="staticParams" border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-edit">编辑</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  -->
      </el-tabs>

    </el-card>
    <!--  -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      shopsId: '',
      shopsList: [],
      shopsListProps: {
        label: 'cat_name',
        value: 'cat_id',
        emitPath: false
      },
      attributeType: 'only',
      activeParams: [],
      staticParams: []
    }
  },
  methods: {
    // 获取下拉列表
    async getShopsList() {
      const { data: res } = await this.$axios.get('categories')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.shopsList = res.data
    },
    // 根据id和sel发起请求
    async getAttributesList() {
      const { data: res } = await this.$axios.get(`categories/${this.shopsId}/attributes`, { params: { sel: this.attributeType } })
      console.log(res)
      if (res.meta.status === 200) {
        if (this.attributeType === 'only') {
          this.activeParams = res.data
        } else {
          this.staticParams = res.data
        }
      } else {
        return this.$message.error('获取数据失败')
      }
    },
    // 监听下拉列表值（获取id）
    shopsValueChange(id) {
      this.shopsId = id
      this.getAttributesList()
    },
    // 监听切换事件（获取sel）
    attributeTypeChange(tab) {
      this.attributeType = tab.name
      if (this.shopsId === '') return
      this.getAttributesList()
    }
    // 
  },
  // 判断按钮是否禁用
  computed: {
    isDisabledButton() {
      if (this.shopsId !== '') return false
      return true
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
.el-table {
  margin-top: 15px;
} 
</style>
