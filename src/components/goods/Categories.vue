<template>
  <div class="shop-sort">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button @click="showAddDialog">添加商品</el-button>
      <!-- 表格 -->
      <zk-table 
        :data="sortList"
        :columns="columns"
        :border="true"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
      >
        <!-- valid -->
        <template slot="valid" slot-scope="scope">
          <span class="el-icon-close" v-if="scope.row.cat_deleted"></span>
          <span class="el-icon-check" v-else></span>
        </template>
        <!-- level -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">1级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level===1">2级</el-tag>
          <el-tag type="danger" v-else>3级</el-tag>
        </template>
        <!-- option -->
        <template slot="option" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditSort(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteSort(scope.row.cat_id)"></el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="sortPage.pagenum"
        :page-size="sortPage.pagesize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog title="添加商品分类" :visible.sync="addDialog" @close="resetAddSort" center>
      <el-form ref="addSortForm" label-width="80px" label-position="right" :model="addSortMsg" :rules="addSortRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addSortMsg.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类层级" prop="cat_pid">
          <el-cascader v-model="cascaderValue" :options="cascaderList" :props="cascaderProps" @change="getCascaderValue"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSort">立即添加</el-button>
          <el-button @click="resetAddSort">全部重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 初始数据
      sortList: [],
      sortPage: {
        type: [],
        pagenum: 1,
        pagesize: 5
      },
      total: null,
      // 树状表格数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '分类id',
          prop: 'cat_id'
        },
        {
          label: '父级id',
          prop: 'cat_pid'
        },
        {
          label: '是否有效',
          type: 'template',   // 渲染为自定义列
          template: 'valid' // 指定插槽名称 相当于设置了 <slot name="isvalid"></slot>
        },
        {
          label: '当前层级',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      /**
       * 添加商品弹窗
       * 添加商品信息
       * 添加商品校验
       */
      addDialog: false,
      addSortMsg: {
        cat_name: '',
        cat_pid: '',
        cat_level: '',
      },
      addSortRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        cat_pid: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ]
      },
      /**
       * 所有下拉列表
       * 下拉列表的值（返回cat_pid和cat_level）
       * 下拉列表配置
       */
      cascaderList: [],
      cascaderValue: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true
      }
    }
  },
  methods: {
    /**
     * 获取当前页的数据
     * 改变当前页码
     * 改变每页显示条数
     */
    async getShopSort() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.sortPage
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.sortList = res.data.result
      this.total = res.data.total
    },
    handleCurrentChange(value) {
      this.sortPage.pagenum = value
      this.getShopSort()
    },
    handleSizeChange(value) {
      this.sortPage.pagesize = value
      this.getShopSort()
    },
    /**
     * 获取下拉列表所有内容
     * 根据返回值获取父级id、等级
     */
    async getCascaderList() {
      const { data: res } = await this.$axios.get('categories')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取下拉列表失败')
      this.cascaderList = res.data
    },
    getCascaderValue(value) {
      if (value.length === 1) {
        this.addSortMsg.cat_pid = 0
        this.addSortMsg.cat_level = value.length
      } else {
        this.addSortMsg.cat_pid = value[value.length - 2]
        this.addSortMsg.cat_level = value.length - 1
      }
      // console.log(value)
      console.log(this.addSortMsg)
    },
    /**
     * 添加分类dialog展现
     * 提交添加分类表单
     * 重置添加分类表单
     */
    showAddDialog() {
      this.addDialog = !this.addDialog
    },
    addSort() {
      this.$refs.addSortForm.validate(async formdata => {
        if (formdata) {
          const { data: res } = await this.$axios.post('categories', this.addSortMsg)
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.getShopSort()
          this.showAddDialog()
          this.$message.success('添加分类成功')
        }
      })
    },
    resetAddSort() {
      this.$refs.addSortForm.resetFields()
      this.cascaderValue = []
      this.addSortMsg.cat_pid = ''
      this.addSortMsg.cat_level = ''
    },
    // 
    showEditSort(scope) {
      console.log(scope)
    },
    // 删除分类
    async deleteSort(id) {
      this.$confirm('是否删除此分类', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        const { data: res } = await this.$axios.delete('categories/' + id)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除分类失败')
        this.getShopSort()
        this.$message.success('删除分类成功')
      })
      .catch(() => {
        this.$message.info('已取消操作')
      })
    }
  },
  created() {
    this.getShopSort()
    this.getCascaderList()
  }
}
</script>

<style lang="less">
.shop-sort {
  .el-form {
    width: 80%;
    margin: 0 auto;
  }
  .el-breadcrumb {
    margin-bottom: 10px;
  }
  .zk-table {
    margin: 10px 0;
    font-size: 14px;
    color: #606266;
    .zk-table--firstProp-header-inner {
      padding-left: 12px;
    }
  }
}

</style>
