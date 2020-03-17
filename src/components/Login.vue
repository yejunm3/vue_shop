<template>
    <div class="login_container">
        <div class="login_content">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 表单 -->
            <el-form ref="form" :model="form" class="from_box" :rules="loginCheck" label-width="80px">
                <el-form-item label="用户名:" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item class="from_button">
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                    <el-button @click="onReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        loginCheck: { // 设置表单验证
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
            ]
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(checkVal => {
            if (checkVal) {
                console.log('true')
            } else {
                console.log('err')
            }
        })
      },
      onReset() {
          this.$refs.form.resetFields();
      }
    }
}
</script>

<style lang="less" scoped>
.login_container {
    width: 100%;
    height: 100%;
    background: #2b4b6b;
    position: relative;
}
.login_content {
    width: 450px;
    height: 300px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
        width: 125px;
        height: 125px;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 1px 1px 5px #666;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: -125px auto 0;
        transform: translateY(50%);
        img {
            width: 70%;
        }
    }
}
.from_box {
    margin: 90px 30px 0 0;
    .from_button {
        button {
            min-width: 110px;
            &:last-child {
                margin-left: 70px;
            }
        }
    }
}
</style>