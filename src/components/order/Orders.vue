<template>
  <div class="orders">
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
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.is_send === '否'">未发货</el-tag>
            <el-tag type="success" v-else-if="scope.row.is_send === '是'">已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'">未支付</el-tag>
            <el-tag type="success" v-else>已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'">未支付</el-tag>
            <el-tag type="success" v-else-if="scope.row.order_pay === '1'">支付宝</el-tag>
            <el-tag type="success" v-else-if="scope.row.order_pay === '2'">微信</el-tag>
            <el-tag type="success" v-else-if="scope.row.order_pay === '3'">银行卡</el-tag>
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
        <el-table-column label="操作" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-truck" @click="showDeliveryDetails">物流</el-button>
            <el-button type="primary" size="small" icon="el-icon-view" @click="showOrdersDetails(scope.row.order_id)">详情</el-button>
            <el-button type="primary" size="small" icon="el-icon-map-location" @click="showAddressDetails(scope.row.order_id)">地址</el-button>
          </template>
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

    <!-- 物流详情 -->
    <el-drawer :with-header="false" :visible.sync="deliveryDetails">
      <el-alert title="物流详情" type="info" show-icon center></el-alert>
      <el-timeline>
        <el-timeline-item v-for="(item, i) in deliveryDetailsList" :key="i" :timestamp="item.ftime">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
    
    <!-- 订单详情 -->
    <el-drawer :with-header="false" :visible.sync="ordersDetails" @close="handleClose">
      <el-alert title="订单详情" type="info" show-icon center></el-alert>
      <div class="orders-details">
        <el-row>
          <el-col :span="6">订单id</el-col>
          <el-col :span="18"><el-input v-model="editOrdersId" :disabled="true"></el-input></el-col>
        </el-row>
        <el-row>
          <el-col :span="6">是否发货</el-col>
          <el-col :span="18">
            <el-switch v-model="editOrdersDetails.is_send" @change="handleSendChange" active-text="已发货" inactive-text="未发货"></el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">支付状态</el-col>
          <el-col :span="18">
            <el-switch v-model="editOrdersDetails.pay_status" active-text="已付款" inactive-text="未付款" disabled></el-switch>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">支付方式</el-col>
          <el-col :span="18">
            <el-radio-group v-model="editOrdersDetails.order_pay" @change="handleRadioChange" size="small">
              <el-radio-button :label="'0'">未支付</el-radio-button>
              <el-radio-button :label="'1'">支付宝</el-radio-button>
              <el-radio-button :label="'2'">微信</el-radio-button>
              <el-radio-button :label="'3'">银行卡</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">订单价格</el-col>
          <el-col :span="18"><el-input v-model="editOrdersDetails.order_price" :disabled="true"></el-input></el-col>
        </el-row>
        <el-row>
          <el-col :span="6">订单数量</el-col>
          <el-col :span="18"><el-input v-model="editOrdersDetails.order_number" :disabled="true"></el-input></el-col>
        </el-row>
      </div>
    </el-drawer>

    <!-- 更改地址 -->
    <el-drawer :with-header="false" :visible.sync="addressDetails" @closed="cancleAddressForm">
      <el-alert title="更改地址" type="info" show-icon center></el-alert>
      <el-form ref="addressForm" label-width="80px">
        <el-form-item label="详细地址">
          <el-input v-model="addressValue1"></el-input>
        </el-form-item>
        <el-form-item label="省市联动">
          <el-cascader class="address-react" v-model="addressValue2" :options="regionData"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddressForm">确认修改</el-button>
          <el-button @click="cancleAddressForm">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

  </div>
</template>

<script>
import _ from 'lodash'
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  data() {
    return {
      // 获取列表
      ordersQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10 
      },
      total: null,
      ordersList: [],
      // 物流详情
      deliveryDetails: false,
      deliveryDetailsList: [],
      // 订单详情
      ordersDetails: false,
      editOrdersId: '',
      editOrdersDetails: {
        is_send: '',
        order_pay: '',
        order_price: '',
        order_number: '',
        pay_status: ''
      },
      editOrdersChange: false,
      // 修改地址
      addressDetails: false,
      addressValue1: '',
      addressValue2: '',
      // 联动数据
      regionData: regionData
    }
  },
  methods: {
    // 获取列表
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
    },
    // 物流详情展示
    async showDeliveryDetails() {
      const { data: res } = await this.$axios.get('/kuaidi/1106975712662')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取物流详情失败')
      this.deliveryDetailsList = res.data
      this.deliveryDetails = true
    },
    // 订单详情展示
    async showOrdersDetails(id) {
      const { data: res } = await this.$axios.get('orders/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取订单详情失败')
      this.ordersDetails = true
      // 
      this.editOrdersId = res.data.order_id
      this.editOrdersDetails.is_send = (res.data.is_send === '否' ? false : true)
      this.editOrdersDetails.pay_status = (res.data.order_pay === '0' ? false : true)
      this.editOrdersDetails.order_pay = res.data.order_pay
      this.editOrdersDetails.order_price = res.data.order_price
      this.editOrdersDetails.order_number = this.getOrderNumber(res.data.goods)
    },
    // 获取商品数量
    getOrderNumber(goodsArr) {
      let goodsNum = null
      goodsArr.forEach(item => {
        goodsNum += parseInt(item.goods_number)
      })
      return goodsNum
    },
    // 订单详情关闭
    async handleClose() {
      if (!this.editOrdersChange) return
      let ordersListClone = _.cloneDeep(this.editOrdersDetails)
      // 
      const { data:res } = await this.$axios.put('orders/' + this.editOrdersId, ordersListClone)
      console.log(res)
      if (res.meta. status!== 201) return this.$message.error('更新失败')
      this.$message.success('更新成功')
      this.editOrdersChange = false
      this.getOrdersList()
    },
    // 更改发货状态
    handleSendChange() {
      this.editOrdersChange = true
    },
    // 更改支付方式
    handleRadioChange(value) {
      if (value === '0') {
        this.editOrdersDetails.pay_status = false
      } else {
        this.editOrdersDetails.pay_status = true
      }
      this.editOrdersChange = true
    },
    // 修改地址展示
    showAddressDetails() {
      this.addressDetails = true
    },
    submitAddressForm() {
      if (this.addressValue1 === '' || this.addressValue2 === '') return this.$message.error('请填写完整的地址')
      this.$message({
        dangerouslyUseHTMLString: true,
        message: `
        <p style="margin-bottom: 5px;">详细地址: ${this.addressValue1}</p>
        <p>级联选择: ${CodeToText[this.addressValue2[0]]},${CodeToText[this.addressValue2[1]]},${CodeToText[this.addressValue2[2]]}</p>
        `
      })
    },
    cancleAddressForm() {
      this.addressDetails = false
      this.addressValue1 = ''
      this.addressValue2 = ''
    }
    // 
  },
  created() {
    this.getOrdersList()
  },
}
</script>

<style lang="less">
.orders {
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
  .el-alert {
    transform: translateY(-10px);
  }
  .el-drawer__body {
    padding: 20px 10px 5px;
    overflow-y: scroll;
    word-wrap: break-word;
    word-break: normal;
    .el-timeline {
      padding: 10px;
      .el-timeline-item {
        &:last-child {
          padding-bottom: 0;
        }
      }
    }
  }
  .orders-details {
    padding: 10px;
    .el-row {
      margin-bottom: 20px;
      .el-col-6 {
        line-height: 40px;
        font-size: 15px;
      }
      .el-col-18 {
        line-height: 40px;
        font-size: 15px;
      }
    }
  }
  .address-react {
    width: 100%
  }
}
</style>