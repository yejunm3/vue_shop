<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="box-card-header">
        <el-input v-model="ordersQuery.query" @clear="getOrdersList" @keyup.native.enter="getOrdersList" placeholder="请输入内容" clearable></el-input>
        <el-button icon="el-icon-search" @click="getOrdersList" circle plain></el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="ordersList" border>
        <el-table-column type="index" label="#" fixed></el-table-column>
        <el-table-column prop="order_id" label="订单id" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
        <el-table-column prop="order_price" label="订单总价"></el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="pay_status" label="订单状态">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else-if="scope.row.pay_status === '1'">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFilter('YYYY/MM/DD hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.update_time | dateFilter('YYYY/MM/DD hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editShops(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteShops(scope.row)"></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="ordersQuery.pagenum"
        :page-size="ordersQuery.pagesize"
        :page-sizes="[10, 15, 20, 25]"
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
      ordersQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10 
      },
      total: null,
      ordersList: []
    }
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$axios.get('orders', { params: this.ordersQuery })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.total = res.data.total
      this.ordersList = res.data.goods
    },
    handleCurrentChange(newpagenum) {
      this.ordersQuery.pagenum = newpagenum
      this.getOrdersList()
    },
    handleSizeChange(newpagesize) {
      this.ordersQuery.pagesize = newpagesize
      this.getOrdersList()
    }
  },
  created() {
    this.getOrdersList()
  },
}
</script>

<style lang="less" scope>
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
</style>