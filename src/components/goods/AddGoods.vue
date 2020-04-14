<template>
  <div class="addShops">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-form ref="addGoodsForm" :model="addGoods" :rules="addGoodsRules" label-width="100px">
      <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeLeave" @tab-click="tabClick">
        <!-- 1 -->
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoods.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model.number="addGoods.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model.number="addGoods.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model.number="addGoods.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader v-model="addGoods.goods_cat" :options="shopsList" :props="shopsListProps"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 2 这里先循环数组的每一项，再循环其中的attr_vals -->
        <el-tab-pane label="动态参数" name="1">
          <el-row v-for="item in activeCateList" :key="item.attr_id" class="cateCheckBox">
            <el-col :span="5">{{item.attr_name}}</el-col>
            <el-col :span="19">
              <el-checkbox-group v-model="item.attr_vals_check" @change="changeCheckBox">
                <el-checkbox v-for="(checkbox, i) in item.attr_vals" :label="checkbox" :key="i">{{checkbox}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 3 -->
        <el-tab-pane label="静态属性" name="2">
          <el-row v-for="item in staticCateList" :key="item.attr_id" class="cateCheckBox">
            <el-col :span="5">{{item.attr_name}}</el-col>
            <el-col :span="19">
              <el-checkbox-group v-model="item.attr_vals_check" @change="changeCheckBox">
                <el-checkbox v-for="(checkbox, i) in item.attr_vals" :label="checkbox" :key="i">{{checkbox}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 4 -->
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headerObj"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品介绍" name="4">商品介绍</el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      /**
       * 下拉列表
       * 下拉列表配置
       */
      shopsList: [],
      shopsListProps: {
        label: 'cat_name',
        value: 'cat_id',
      },
      /**
       * 添加商品
       * 添加商品校验
       */
      addGoods: {
        goods_name: '测试名称',
        goods_price: 100,
        goods_number: 100,
        goods_weight: 100,
        goods_cat: [],
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      addGoodsRules: {
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
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      /**
       * 商品动态参数
       * 商品静态属性
       */
      activeCateList: [],
      staticCateList: [],
      // 图片上传配置token
      headerObj: {
        Authorization : window.sessionStorage.getItem('token')
      }
    }
  },
  methods: {
    async getShopsList() {
      const { data: res } = await this.$axios.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.shopsList = res.data
    },
    // 表单检查
    getFormCheck() {
      let formdata = ''
      this.$refs.addGoodsForm.validate(res => { formdata = res })
      return formdata
    },
    /**
     * tabs切换回调
     * tabs点击触发
     */
    beforeLeave(newVal, oldVal) {
      if (oldVal === '0' && !this.getFormCheck()) return false
    },
    async tabClick() {
      // 1
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(`categories/${this.cate_id}/attributes`, { params: { sel : 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
          item.attr_vals_check = []
        })
        this.activeCateList = res.data
      // 2
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(`categories/${this.cate_id}/attributes`, { params: { sel : 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
          item.attr_vals_check = []
        })
        this.staticCateList = res.data
      }
    },
    changeCheckBox(value) {
      console.log(value)
    },
    /**
     * 文件预览
     * 文件删除
     * 文件删除成功回调
     */
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    handleSuccess(response) {
      console.log(response) // 响应信息
      this.addGoods.pics.push(
        { 'pic' :  response.data.tmp_path}
      )
      console.log(this.addGoods)
    }
    // 
  },
  computed: {
    cate_id() {
      return this.addGoods.goods_cat ? this.addGoods.goods_cat[2] : ''
    }
  },
  created() {
    this.getShopsList()
  }
}
</script>

<style lang="less">
.addShops {
  .el-breadcrumb {
    margin-bottom: 10px;
  }
  .cateCheckBox {
    margin-bottom: 10px;
    .el-col-5 {
      font-size: 15px;
      padding-left: 25px;
    }
    .el-checkbox {
      margin-bottom: 15px;
      .el-checkbox__label {
        font-size: 15px;
      }
    }
  }
  .el-upload {
    padding-left: 20px;
  }
  .el-upload-list {
    padding-left: 20px;
  }
}
</style>
