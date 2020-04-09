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
        <!-- 1 -->
        <el-tab-pane label="动态参数" name="only">
          <el-button plain :disabled="isDisabledButton" @click="showAddParams">添加动态参数</el-button>
          <el-table :data="activeParams" border>
            <!-- 下拉 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                {{scope.row}}
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="120"></el-table-column>
            <el-table-column prop="attr_id" label="参数id" width="120"></el-table-column>
            <el-table-column prop="cat_id" label="所属分类" width="120"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 2 -->
        <el-tab-pane label="静态属性" name="many">
          <el-button plain :disabled="isDisabledButton" @click="showAddParams">添加静态属性</el-button>
          <el-table :data="staticParams" border>
            <!-- 下拉 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                {{scope.row}}
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="120"></el-table-column>
            <el-table-column prop="attr_id" label="参数id" width="120"></el-table-column>
            <el-table-column prop="cat_id" label="所属分类" width="120"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  -->
      </el-tabs>
    </el-card>
    
    <!-- 添加弹窗 -->
    <el-dialog title="添加参数" :visible.sync="addParamsDialog" @closed="resetAddParams" center>
      <el-form :model="addParams" :rules="addParamsRules" label-width="80px" ref="addParamsForm">
        <el-form-item label="参数类型">
          <el-input v-model="addParams.attr_sel" disabled></el-input>
        </el-form-item>
        <el-form-item :label="isInputName" prop="attr_name">
          <el-input v-model="addParams.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="参数选项" v-show="addParams.attr_sel === 'many'">
          <el-input v-model="addParams.attr_vals"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddParams">立即添加</el-button>
          <el-button @click="showAddParams">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog title="修改参数" :visible.sync="editParamsDialog" @closed="resetEditParams" center>
      <el-form :model="editParams" :rules="editParamsRules" label-width="80px" ref="editParamsForm">
        <el-form-item label="分类id">
          <el-input v-model="shopsId" disabled></el-input>
        </el-form-item>
        <el-form-item label="参数id">
          <el-input v-model="editParamsAttrId" disabled></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-input v-model="editParams.attr_sel" disabled></el-input>
        </el-form-item>
        <el-form-item :label="isInputName" prop="attr_name">
          <el-input v-model="editParams.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="参数选项" v-show="editParams.attr_sel === 'many'">
          <el-input v-model="editParams.attr_vals"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditParams">立即修改</el-button>
          <el-button @click="editParamsDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      shopsId: '',
      attributeType: 'only',
      // 下拉列表
      shopsList: [],
      shopsListProps: {
        label: 'cat_name',
        value: 'cat_id',
        emitPath: false
      },
      // 参数表格
      activeParams: [],
      staticParams: [],
      // 添加参数
      addParamsDialog: false,
      addParams: {
        attr_name: '',
        attr_sel: 'only',
        attr_vals: ''
      },
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入分类参数', trigger: 'blur' }
        ]
      },
      // 编辑参数
      editParamsDialog: false,
      editParamsAttrId: '',
      editParams: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入分类参数', trigger: 'blur' }
        ]
      }
      // 
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
    },
    /**
     * 展现添加弹窗
     * 提交添加弹窗
     * 重置添加弹窗
     */
    showAddParams() {
      this.addParamsDialog = !this.addParamsDialog
    },
    submitAddParams() {
      this.$refs.addParamsForm.validate(async formdata => {
        if (!formdata) return
        const { data: res } = await this.$axios.post(`categories/${this.shopsId}/attributes`, this.addParams)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.showAddParams()
        this.getAttributesList()
        this.$message.success('添加参数成功')
      })
    },
    resetAddParams() {
      this.$refs.addParamsForm.resetFields()
    },
    /**
     * 展现编辑弹窗
     * 重置编辑弹窗
     */
    showEditParams(scope) {
      this.editParamsAttrId = scope.attr_id
      this.editParams.attr_name = scope.attr_name
      this.editParams.attr_sel = scope.attr_sel
      this.editParams.attr_vals = scope.attr_vals
      this.editParamsDialog = true
    },
    submitEditParams() {
      this.$refs.editParamsForm.validate(async formdata => {
        if (formdata) {
          const { data: res } = await this.$axios.put(`categories/${this.shopsId}/attributes/${this.editParamsAttrId}`, this.editParams)
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('更新失败')
          this.getAttributesList()
          this.editParamsDialog = false
          this.$message.success('删除成功')
        }
      })
    },
    resetEditParams() {
      this.$refs.editParamsForm.resetFields()
    },
    // 删除参数
    async deleteParams(attrid) {
      this.$confirm('是否删除此参数', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${this.shopsId}/attributes/${attrid}`)
        console.log(res)
        if (res.meta.status !== 200) this.$message.error('删除失败')
        this.getAttributesList()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('取消操作')      
      })
    }
  },
  computed: {
    // 判断按钮是否禁用
    isDisabledButton() {
      if (this.shopsId !== '') return false
      return true
    },
    // 判断弹窗显示文字
    isInputName() {
      if (this.attributeType === 'only') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  watch: {
    // 赋值addParams中的attr_sel
    attributeType: function(newval) {
      this.addParams.attr_sel = newval
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
.el-form {
  width: 80%;
  margin: 0 auto;
}
</style>
