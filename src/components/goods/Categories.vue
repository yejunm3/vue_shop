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
    <el-dialog title="添加商品分类" :visible.sync="addDialog" @closed="resetAddSort" center>
      <el-form ref="addSortForm" label-width="80px" label-position="right" :model="addSortMsg" :rules="addSortRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addSortMsg.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="选择父级">
          <el-cascader v-model="cascaderValue" :options="cascaderList" :props="cascaderProps" @change="getCascaderValue"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSort">立即添加</el-button>
          <el-button @click="resetAddSort">全部重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog title="编辑商品分类" :visible.sync="editDialog" @closed="resetEditSort" center>
      <el-form ref="editSortForm" label-width="80px" label-position="right" :model="editSortMsg" :rules="editSortRules">
        <el-form-item label="分类ID">
          <el-input v-model="editSortMsg.cat_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editSortMsg.cat_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editSort">提交修改</el-button>
          <el-button @click="resetEditSort">重置修改</el-button>
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
          type: 'template', // 渲染为自定义列
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
      },
      /**
       * 添加商品弹窗
       * 添加商品信息（设置默认值）
       * 添加商品校验
       */
      addDialog: false,
      addSortMsg: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addSortRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      /**
       * 修改商品弹窗
       * 修改商品信息
       * 修改商品校验
       */
      editDialog: false,
      editSortMsg: {
        cat_id: '',
        cat_name: ''
      },
      editSortRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      }
      // 
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
     *  1）不选择，为第一级，父级id和等级均为"0"
     *  2）选择一级，为第二级，父级id为上一级id（第一级的），等级为"1"
     *  3）选择二级、三级，均为第三级，父级id为上一级id（第二级的，没有第三级），等级为"2"
     */
    async getCascaderList() {
      const { data: res } = await this.$axios.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取下拉列表失败')
      this.cascaderList = res.data
    },
    getCascaderValue(value) {
      if (value.length === 1) {
        this.addSortMsg.cat_pid = value[0]
        this.addSortMsg.cat_level = 1
      } else {
        this.addSortMsg.cat_pid = value[1]
        this.addSortMsg.cat_level = 2
      }
      console.log(value)
      console.log(this.addSortMsg)
    },
    /**
     * 添加分类dialog展现（此时获取下拉列表）
     * 提交添加分类表单
     * 重置添加分类表单
     */
    showAddDialog() {
      this.addDialog = true
      this.getCascaderList()
    },
    addSort() {
      this.$refs.addSortForm.validate(async formdata => {
        if (formdata) {
          const { data: res } = await this.$axios.post('categories', this.addSortMsg)
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.getShopSort()
          this.addDialog = false
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
    /**
     * 编辑分类dialog展现
     * 提交编辑分类表单
     * 重置编辑分类表单
     */
    showEditSort(scope) {
      this.editDialog = true
      this.editSortMsg.cat_id = scope.cat_id
      this.editSortMsg.cat_name = scope.cat_name
    },
    editSort() {
      this.$refs.editSortForm.validate(async fromdata => {
        if (fromdata) {
          const { data: res } = await this.$axios.put('categories/' + this.editSortMsg.cat_id, { cat_name: this.editSortMsg.cat_name })
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('更新分类失败')
          this.getShopSort()
          this.editDialog = false
          this.$message.success('更新分类成功')
          console.log(this.editSortMsg)
        }
      })
    },
    resetEditSort() {
      this.$refs.editSortForm.resetFields()
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
