<template>
  <div class="goods-list">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="box-card-header">
        <el-input v-model="goodsQuery.query" @clear="getGoodsList" @keyup.native.enter="getGoodsList" placeholder="请输入内容" clearable></el-input>
        <el-button icon="el-icon-search" @click="getGoodsList" circle></el-button>
        <el-button @click="addShops" round>添加商品</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="goodsList" border>
        <el-table-column type="index" label="#" fixed></el-table-column>
        <el-table-column prop="goods_id" label="商品id"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600"></el-table-column>
        <el-table-column label="添加时间" width="200">
            <template slot-scope="scope">
                {{ scope.row.add_time | dateFilter('YYYY/MM/DD hh:mm:ss') }}
            </template>
        </el-table-column>
        <el-table-column prop="goods_state" label="商品状态">
          <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.goods_state === 0">未通过</el-tag>
              <el-tag type="warning" v-else-if="scope.row.goods_state === 1">审核中</el-tag>
              <el-tag v-else>已审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="goods_price" label="价格"></el-table-column>
        <el-table-column prop="goods_number" label="数量"></el-table-column>
        <el-table-column prop="goods_weight" label="重量"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editShops(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteShops(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="goodsQuery.pagenum"
        :page-size="goodsQuery.pagesize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      goodsQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: null
    }
  },
  methods: {
    /**
     * 获取商品列表
     * 监听页码值变化
     * 监听每页显示数量
     */
    async getGoodsList() {
      const { data: res } = await this.$axios.get('goods', { params: this.goodsQuery })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleCurrentChange(value) {
      this.goodsQuery.pagenum = value
      this.getGoodsList()
    },
    handleSizeChange(value) {
      this.goodsQuery.pagesize = value
      this.getGoodsList()
    },
    /**
     * 添加商品路由跳转
     * 编辑商品路由跳转
     */
    addShops() {
      this.$router.push({ name: 'addgoods' })
    },
    editShops(scope) {
      this.$router.push({ name: 'editgoods', query: { id: scope.goods_id } })
    },
    // 删除商品（这里的$confirm返回promise对象）
    async deleteShops(scope) {
      const data = await this.$confirm('是否删除此商品', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (data !== 'confirm') return this.$message.info('取消操作')
      const { data: res } = await this.$axios.delete('goods/' + scope.goods_id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getGoodsList()
      this.$message.success('删除成功')
    }
    // 
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less">
.goods-list {
  .el-breadcrumb {
    margin-bottom: 10px;
  }
  .el-card__header {
    padding: 15px 20px;
    border-bottom: none;
    .box-card-header {
      display: flex;
      .el-input {
        width: 50%;
        margin-right: 10px;
      }
    }
  }
  .el-card__body {
      padding: 0 20px 20px;
  }
  .el-table {
    margin-bottom: 15px;
  }
}
</style>
