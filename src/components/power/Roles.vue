<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button @click="showAddRoles">添加角色</el-button>
      <el-table :data="rolesList" stripe>
        <el-table-column type="expand">
          <!--  -->
          <template slot-scope="scope">
            <!-- 1 -->
            <el-row v-for="(child1, i) in scope.row.children" :key="child1.id" :class="i===0?'':'divider'">
              <el-col :span="4">
                <el-tag @close="closeHandle(scope.row, child1.id)" closable>{{child1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 2 -->
                <el-row v-for="child2 in child1.children" :key="child2.id">
                  <el-col :span="6">
                    <el-tag type="warning" @close="closeHandle(scope.row, child2.id)" closable>{{child2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 3 -->
                    <el-tag type="danger" v-for="child3 in child2.children" :key="child3.id" @close="closeHandle(scope.row, child3.id)" closable>{{child3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <!--  -->
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-s-tools" @click="showChangeRoles(scope.row)">修改权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加弹窗 -->
    <el-dialog title="添加角色信息" :visible.sync="addRolesDialog" @closed="resetAddRoles" center>
      <el-form 
        ref="addRolesForm"
        label-width="90px"
        label-position="right"
        :model="addRoles" 
        :rules="addRolesCheck"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddRoles">立即创建</el-button>
          <el-button @click="resetAddRoles">全部清空</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title="添加角色信息" :visible.sync="editRolesDialog"  @closed="resetEditRoles" center>
      <el-form 
        ref="editRolesForm"
        label-width="90px"
        label-position="right"
        :model="editRoles" 
        :rules="editRolesCheck"
      >
        <el-form-item label="角色id">
          <el-input v-model="editRoles.roleId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditRoles">完成编辑</el-button>
          <el-button @click="resetEditRoles">重置编辑</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改权限 -->
    <el-dialog title="修改角色权限" :visible.sync="changeRolesDialog" @closed="hideChangeRoles" left>
      <el-tree 
      ref="rolesTreeList"
      :data="rolesTree" 
      :props="rolesTreeProps"
      :default-expand-all="true"
      :default-checked-keys="rolesTreeChecked"
      node-key="id"
      show-checkbox
      ></el-tree>
      <el-row class="button-group" type="flex" justify="end">
        <el-button type="primary" @click="allotRolesTree">完成修改</el-button>
        <el-button @click="hideChangeRoles">取消修改</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 添加弹窗
      addRolesDialog: false,
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      addRolesCheck: {
        roleName: [ { required: true, message: '请输入角色名称', trigger: 'blur' } ]
      },
      // 修改弹窗
      editRolesDialog: false,
      editRoles: '',
      editRolesCheck: {
        roleName: [ { required: true, message: '请输入角色名称', trigger: 'blur' } ]
      },
      // 修改权限
      changeRolesDialog: false,
      rolesTree: '',
      // 树形控件绑定对象
      rolesTreeProps: {
          children: 'children',
          label: 'authName'
      },
      // 树形控件默认选中
      rolesTreeChecked: [],
      rolesTreeId: ''
    }
  },
  methods: {
    // 获取列表
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    // 删除tags
    async closeHandle(rowMsg, rightId) {
      console.log(rightId)
      // 
      this.$confirm('是否删除此条权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        const { data: res } = await this.$axios.delete(`roles/${rowMsg.id}/rights/${rightId}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        rowMsg.children = res.data
        this.$message.success(res.meta.msg)
      })
      .catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 添加弹窗展示
    showAddRoles() {
      this.addRolesDialog = true
    },
    // 清空添加弹窗
    resetAddRoles() {
      this.$refs.addRolesForm.resetFields()
    },
    // 提交添加弹窗
    submitAddRoles() {
      this.$refs.addRolesForm.validate(async formdata => {
        if (!formdata) return
        const { data: res } = await this.$axios.post('roles', this.addRoles)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.addRolesDialog = false
        this.$message.success(res.meta.msg)
      })
    },
    // 编辑弹窗展示
    async showEditRoles(id) {
      const { data: res } = await this.$axios.get(`roles/${id}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRoles = res.data
      this.editRolesDialog = true
    },
    // 清空编辑弹窗
    resetEditRoles() {
      this.$refs.editRolesForm.resetFields()
    },
    // 提交编辑弹窗
    submitEditRoles() {
      this.$refs.editRolesForm.validate(async formdata => {
        if (!formdata) return
        const { data: res } = await this.$axios.put(
          'roles/' + parseInt(this.editRoles.roleId),
          {
            roleName: this.editRoles.roleName,
            roleDesc: this.editRoles.roleDesc
          }
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('编辑失败')
        this.getRolesList()
        this.editRolesDialog = false
        this.$message.success('编辑成功')
      })
    },
    // 删除角色
    deleteRoles(id) {
      this.$confirm('是否删除此角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        const { data: res } = await this.$axios.delete(`roles/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.$message.success(res.meta.msg)
      })
      .catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 展示权限弹窗
    async showChangeRoles(scopeMsg) {
      this.getRolesTreeChecked(scopeMsg, this.rolesTreeChecked)
      this.rolesTreeId = scopeMsg.id
      // console.log(this.rolesTreeChecked)
      // console.log(this.rolesTreeId)
      // 
      const { data: res } = await this.$axios.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesTree = res.data
      this.changeRolesDialog = true
    },
    // 递归获取获取第3级嵌套的id
    getRolesTreeChecked(node, arr) {
      if (!node.children) {
        arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getRolesTreeChecked(item, arr)
        })
      }
    },
    // 取消权限弹窗
    hideChangeRoles() {
      this.rolesTreeChecked = []
      this.rolesTreeId = ''
      this.changeRolesDialog = false
    },
    // 提交修改权限
    allotRolesTree() {
      // console.log(this.$refs.rolesTreeList.getCheckedKeys())
      // console.log(this.$refs.rolesTreeList.getHalfCheckedNodes())
      // 这里使用展开运算符 将 已选中节点和半选中节点合并为一个数组
      let allotList = [
        ...this.$refs.rolesTreeList.getCheckedKeys(),
        ...this.$refs.rolesTreeList.getHalfCheckedKeys()
      ]
      // console.log(allotList.join(','))
      this.$axios.post(
        `roles/${this.rolesTreeId}/rights`,
        {
          rids: allotList.join(',')
        }
      ).then(res => {
        console.log(res)
        if (res.data.meta.status !== 200) {
          this.$message.error('更新权限失败')
        } else {
          this.getRolesList()
          this.hideChangeRoles()
          this.$message.success('更新权限成功')
        }
      })
    }
    // 
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.divider {
  border-top: 1px solid #DCDFE6;
  padding-top: 10px;
}
.el-form {
  width: 80%;
  margin: 0 auto;
}
.button-group {
  margin-top: 30px;
}
</style>
