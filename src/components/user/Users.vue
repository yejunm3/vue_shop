<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="box-card-header">
        <el-input 
          v-model="queryInfo.query"
          placeholder="请输入内容"
          @keyup.native.enter="seachUsers" 
          @clear="getUsersList"
          clearable 
        ></el-input>
        <el-button icon="el-icon-search" circle @click="seachUsers"></el-button>
        <el-button round @click="dialogTableVisible = true">添加用户</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        style="width: 100%"
        :data="usersList"
        :default-sort="{ prop: 'id', order: 'ascending' }"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID" sortable></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <!--  -->
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editMathod(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteMathod(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="更改角色" placement="top-start" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-s-tools" @click="checkMathod(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--  -->
      </el-table>
      <!-- 分页 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 3, 4]"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加弹窗 -->
    <el-dialog title="添加用户" :visible.sync="dialogTableVisible" @closed="resetAddForm" center>
      <el-form 
        ref="addUsersForm"
        label-width="70px"
        label-position="left"
        :model="addUsers" 
        :rules="addUsersCheck"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsers.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUsers.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUsers.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddForm">立即创建</el-button>
          <el-button @click="resetAddForm">全部清空</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="dialogTableVisibleEdit" @closed="resetEditForm" center>
      <el-form 
        ref="editUsersForm"
        label-width="70px"
        label-position="left"
        :model="editUsers" 
        :rules="editUsersCheck"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUsers.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUsers.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm">完成修改</el-button>
          <el-button @click="resetEditForm">重置修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <el-dialog title="更改角色" :visible.sync="dialogTableVisibleCheck" @closed="rolesDialogHide" class="roles-box" center>
      <div class="roles-box-item">
        <el-row>
          <el-col :span="5">当前角色：</el-col>
          <el-col :span="19">{{usersRolesMsg.role_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">当前用户：</el-col>
          <el-col :span="19">{{usersRolesMsg.username}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">选择角色：</el-col>
          <el-col :span="19">
            <el-select v-model="usersRolesValue" placeholder="请选择">
              <el-option v-for="item in usersRolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-col :span="19">
            <el-button type="primary" @click="rolesCheckSubmit">确定</el-button>
            <el-button @click="rolesDialogHide">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--  -->
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱二级校验
    var emailPass = (rule, value, callback) => {
      const emailReg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (emailReg.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    // 自定义电话二级校验
    var mobilePass = (rule, value, callback) => {
      const mobileReg = /^[1]([3-9])[0-9]{9}$/
      if (value === '') {
        callback(new Error('请输入电话'))
      } else if (mobileReg.test(value)) {
        callback()
      } else {
        callback(new Error('电话格式不正确'))
      }
    }
    return {
      /**
       * 查询参数
       * 页码值
       * 每页显示条数
       */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: null,
      // 添加表单
      dialogTableVisible: false,
      addUsers: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUsersCheck: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: emailPass, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: mobilePass, trigger: 'blur' }
        ]
      },
      // 修改表单
      dialogTableVisibleEdit: false,
      editUsers: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editUsersCheck: {
        email: [
          { required: true, validator: emailPass, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: mobilePass, trigger: 'blur' }
        ]
      },
      /**
       * 更改角色
       * 当前行的信息
       * 请求到的列表
       * 被选中的值
       */
      dialogTableVisibleCheck: false,
      usersRolesMsg: '',
      usersRolesList: [],
      usersRolesValue: ''
      // 
    }
  },
  methods: {
    // 获取用户列表
    async getUsersList() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 监听分页 页码值变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getUsersList()
    },
    // 监听分页 下拉变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 修改用户状态 失败时值取反
    async changeState(stateMsg) {
      const { data: res } = await this.$axios.put(`users/${stateMsg.id}/state/${stateMsg.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        stateMsg.mg_state = !stateMsg.mg_state
        return this.$message.error('更新状态失败')
      } else {
        this.$message.success('更新状态成功')
      }
    },
    // 搜索功能
    seachUsers() {
      this.getUsersList()
    },
    // 重置添加表单
    resetAddForm() {
      this.$refs.addUsersForm.resetFields()
    },
    // 提交添加表单
    submitAddForm() {
      this.$refs.addUsersForm.validate(async formdata => {
        if (!formdata) return
        const { data: res } = await this.$axios.post('users', this.addUsers)
        console.log(res)
        if (res.meta.status === 201 ) {
          this.getUsersList()
          this.dialogTableVisible = false
          this.$message.success(res.meta.msg)
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    // 修改用户信息
    editMathod(editMsg) {
      this.dialogTableVisibleEdit = true
      this.editUsers.id = editMsg.id
      this.editUsers.username = editMsg.username
      this.editUsers.email = editMsg.email
      this.editUsers.mobile = editMsg.mobile
    },
    // 重置修改表单
    resetEditForm() {
      this.$refs.editUsersForm.resetFields()
    },
    // 提交修改表单
    submitEditForm() {
      this.$refs.editUsersForm.validate(async formdata => {
        if (!formdata) return
        const { data: res } = await this.$axios.put(
          `users/${this.editUsers.id}`,
          {
            email: this.editUsers.email,
            mobile: this.editUsers.mobile
          }
        )
        console.log(res)
        if (res.meta.status === 200) {
          this.getUsersList()
          this.dialogTableVisibleEdit = false
          this.$message.success(res.meta.msg)
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    // 删除用户信息
    deleteMathod(id) {
      this.$confirm('该信息将会被永久删除', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        const { data: res } = await this.$axios.delete(`users/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getUsersList()
        this.$message.success(res.meta.msg)
      })
      .catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 分配角色弹窗
    async checkMathod(scopeMsg) {
      console.log(scopeMsg)
      this.usersRolesMsg = scopeMsg
      this.usersRolesValue = scopeMsg.role_name
      this.dialogTableVisibleCheck = true
      // 
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.usersRolesList = res.data
      console.log(this.usersRolesList)
    },
    // 重置分配弹窗
    rolesDialogHide() {
      this.dialogTableVisibleCheck = false
    },
    // 发起更改请求
    async rolesCheckSubmit() {
      const { data: res } = await this.$axios.put(
        `users/${this.usersRolesMsg.id}/role`,
        {
          rid: this.usersRolesValue
        }
      )
      console.log(res)
      if (res.meta.status !==200) return this.$message.error(res.meta.msg)
      this.getUsersList()
      this.rolesDialogHide()
      this.$message.success(res.meta.msg)
    }
    // 
  },
  created() {
    this.getUsersList()
  }
}
</script>

<style lang="less">
.users {
  .el-breadcrumb {
    margin-bottom: 10px;
  }
  .el-card__header {
    padding: 15px 20px;
    .box-card-header {
      display: flex;
      .el-input {
        width: 50%;
        margin-right: 10px;
      }
    }
  }
  .el-table {
    margin-bottom: 15px;
  }
  .el-form {
    width: 80%;
    margin: 0 auto;
  }
  .roles-box {
    .el-dialog {
      width: 40%;
      .roles-box-item {
        width: 80%;
        margin: 0 auto;
        font-size: 16px;
        line-height: 40px;
        .el-button {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
