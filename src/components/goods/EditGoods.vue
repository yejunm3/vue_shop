<template>
  <div class="edit-list">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-form ref="editGoodsForm" :model="editGoods" :rules="editGoodsRules" label-width="80px">
        <el-form-item label="商品id">
          <el-input v-model="id" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoods.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoods.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoods.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoods.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-button @click="details = true">查看详情</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditGoods">立即修改</el-button>
          <el-button type="info" @click="cancleEditGoods">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 弹窗 -->
    <el-drawer :with-header="false" :visible.sync="details">
      <el-alert title="详情介绍" type="info" show-icon center></el-alert>
      <div v-html="editGoods.goods_introduce"></div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      details: false,
      editGoods: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: '',
        attrs: ''
      },
      editGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getGoodsInfo() {
      const { data: res } = await this.$axios.get('goods/' + this.id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品参数失败')
      this.editGoods.goods_name = res.data.goods_name
      this.editGoods.goods_price = res.data.goods_price
      this.editGoods.goods_number = res.data.goods_number
      this.editGoods.goods_weight = res.data.goods_weight
      this.editGoods.goods_introduce = res.data.goods_introduce
      this.editGoods.pics = res.data.pics
      this.editGoods.attrs = res.data.attrs
    },
    cancleEditGoods() {
      this.$router.push({ path: 'goods' })
    },
    submitEditGoods() {
      this.$refs.editGoodsForm.validate(async formdata => {
        if (!formdata) return
        const { data: res } = await this.$axios.put('goods/' + this.id, this.editGoods) 
        console.log(res)
        if (res !== 200) return this.$message.error('编辑商品失败')
        this.$message.error('编辑商品失败')
      })
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getGoodsInfo()
  }
}
</script>

<style lang="less">
.edit-list {
  .el-breadcrumb {
    margin-bottom: 10px;
  }
  .el-alert {
    transform: translateY(-10px);
  }
  .el-drawer__body {
    padding: 20px;
    overflow-y: scroll;
    word-wrap: break-word;
    word-break: normal;
    img {
      max-width: 100%;
      vertical-align: top;
    }
  }
}
</style>
