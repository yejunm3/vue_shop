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
      <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeLeave">
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
            <el-cascader v-model="addGoods.goods_cat" :options="shopsList" :props="shopsListProps" @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 2 这里先循环数组的每一项，再循环其中的attr_vals -->
        <el-tab-pane label="动态参数" name="1">
          <el-row v-for="item in activeCateList" :key="item.attr_id" class="cateCheckBox">
            <el-col :span="5">{{item.attr_name}}</el-col>
            <el-col :span="19">
              <el-checkbox-group v-model="item.attr_vals_check">
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
              <el-checkbox-group v-model="item.attr_vals_check">
                <el-checkbox v-for="(checkbox, i) in item.attr_vals" :label="checkbox" :key="i">{{checkbox}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 4 -->
        <el-tab-pane label="商品图片" name="3" class="tab-pane-specil">
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headerObj"
            list-type="picture"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <!-- 5 -->
        <el-tab-pane label="商品介绍" name="4" class="tab-pane-specil">
          <quill-editor v-model="addGoods.goods_introduce"></quill-editor>
          <el-row>
            <el-button type="primary" @click="handleAddGoods">添加商品</el-button>
            <el-button @click="handleCancelAdd">返回列表</el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialog" center>
      <el-image :src="previewPath"  style="width: 100%;"></el-image>
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'
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
      /**
       * 图片上传配置token
       * 图片预览dialog
       * 图片预览路径
       */
      headerObj: {
        Authorization : window.sessionStorage.getItem('token')
      },
      previewDialog: false,
      previewPath: ''
    }
  },
  methods: {
    async getShopsList() {
      const { data: res } = await this.$axios.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.shopsList = res.data
    },
    // 表单预校验
    getFormCheck() {
      let formdata = ''
      this.$refs.addGoodsForm.validate(res => { formdata = res })
      return formdata
    },
    // tabs跳转回调
    beforeLeave(newVal, oldVal) {
      if (oldVal === '0' && !this.getFormCheck()) return false
    },
    // 获取checkbox多选值
    async handleChange() {
      // 动态参数
      const { data: res } = await this.$axios.get(`categories/${this.addGoods.goods_cat[2]}/attributes`, { params: { sel : 'many' } })
      if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(' ')
        item.attr_vals_check = []
      })
      this.activeCateList = res.data
      // 静态属性
      const { data: res2 } = await this.$axios.get(`categories/${this.addGoods.goods_cat[2]}/attributes`, { params: { sel : 'only' } })
      if (res2.meta.status !== 200) return this.$message.error('获取静态属性失败')
      res2.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(' ')
        item.attr_vals_check = []
      })
      this.staticCateList = res2.data
    },
    // 文件预览
    handlePreview(file) {
      this.previewDialog = true
      this.previewPath = file.response.data.url
    },
    // 文件删除
    handleRemove(file) {
      this.addGoods.pics.forEach((item, i) => {
        if (item.pic === file.response.data.tmp_path) {
          this.addGoods.pics.splice(i, 1)
        }
      })
    },
    // 上传成功
    handleSuccess(response) {
      this.addGoods.pics.push({ 'pic' :  response.data.tmp_path})
    },
    // 提交添加商品（复制一份数据进行操作）
    async handleAddGoods() {
      let newAddGoods = _.cloneDeep(this.addGoods)
      newAddGoods.goods_cat = newAddGoods.goods_cat.join(',')
      // 
      this.activeCateList.forEach(item => {
        if (item.attr_vals_check.length !== 0) {
          newAddGoods.attrs.push({ 'attr_id': item.attr_id, 'attr_value': item.attr_vals_check.join(',') })
        }
      })
      this.staticCateList.forEach(item => {
        if (item.attr_vals_check.length !== 0) {
          newAddGoods.attrs.push({ 'attr_id': item.attr_id, 'attr_value': item.attr_vals_check.join(',') })
        }
      })
      const { data: res } = await this.$axios.post('goods', newAddGoods)
      console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加失败')
      return this.$message.success('添加成功')
    },
    // 取消添加商品
    handleCancelAdd() {
      this.$router.push({ path: 'goods' })
    }
    // 
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
    .el-col-19 {
      padding-left: 20px;
      .el-checkbox {
        margin-bottom: 15px;
        .el-checkbox__label {
          font-size: 15px;
        }
      }
    }
  }
  .tab-pane-specil {
    padding-left: 20px;
  }
  .quill-editor {
    margin-bottom: 15px;
    .ql-editor {
      min-height: 250px;
    }
  }
}
</style>
