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
          <el-button @click="detailsFlag = true">查看详情</el-button>
        </el-form-item>
        <!-- 图片 -->
        <el-form-item label="商品图片" class="image-list">
          <el-image v-for="(item, i) in imageList" :key="i" :src="item" @click="showImageList(i)"></el-image>
          <el-image-viewer :url-list="newImageList" v-if="imageListFlag" :on-close="closeImageList"></el-image-viewer>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditGoods">立即修改</el-button>
          <el-button type="info" @click="cancleEditGoods">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 弹窗 -->
    <el-drawer :with-header="false" :visible.sync="detailsFlag">
      <el-alert title="详情介绍" type="info" show-icon center></el-alert>
      <div v-html="editGoods.goods_introduce"></div>
    </el-drawer>
  </div>
</template>

<script>
// 导入组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  data() {
    return {
      /**
       * 商品id
       * 右侧详情展开
       * 编辑表单内容
       * 编辑表单校验
       */
      id: '',
      detailsFlag: false,
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
      },
      /**
       * 大图列表展开
       * 小图列表
       * 大图列表
       */
      imageListFlag: false,
      imageList: [],
      imageViewList: [], // 发起请求时存储
      newImageList: []   // 每次点击时再渲染
    }
  },
  methods: {
    /**
     * 获取商品信息
     * 取消 路由跳转
     * 提交商品信息
     */
    async getGoodsInfo() {
      const { data: res } = await this.$axios.get('goods/' + this.id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品参数失败')
      // 获取商品参数
      this.editGoods.goods_name = res.data.goods_name
      this.editGoods.goods_price = res.data.goods_price
      this.editGoods.goods_number = res.data.goods_number
      this.editGoods.goods_weight = res.data.goods_weight
      this.editGoods.goods_introduce = res.data.goods_introduce
      this.editGoods.pics = res.data.pics
      this.editGoods.attrs = res.data.attrs
      // 获取缩略图列表
      res.data.pics.forEach((item, i) => {
        this.imageList[i] = item.pics_sma_url
        this.imageViewList[i] = item.pics_big_url
      })
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
    },
    /**
     * 展现商品view
     * 关闭商品view
     */
    showImageList(i) {
      // 使用i作为数组分割，.slice(0,2) => arr[0],arr[1] .slice(2,5) => arr[2],arr[3],arr[4]，再合并为一个数组
      this.newImageList = [
        ...this.imageViewList.slice(i, this.imageViewList.length),
        ...this.imageViewList.slice(0, i)
      ]
      this.imageListFlag = true
    },
    closeImageList() {
      this.imageListFlag = false
    }
    // 
  },
  components: {
    ElImageViewer
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
  .image-list {
    .el-form-item__content {
      display: flex;
      .el-image {
        padding-right: 10px;
        img {
          vertical-align: top;
        }
      }
    }
  }
}
</style>
