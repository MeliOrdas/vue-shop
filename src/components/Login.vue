<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" class="login_form" :model="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-key" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>

        <el-form-item></el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 登陆表单数据绑定对象
      loginForm: {
        username: 'zs',
        password: '123'
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证账号（数组）
        username: [
          { required: false, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '账号长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码（数组）
        password: [
          { required: false, message: '请输入账号', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 点击重置
    resetLoginForm () {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
/*登陆界面样式*/
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
}
/* 登录框 */
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 0 10px #ddd;
  /* 登录框图片 */
  .avatar_box {
    height: 150px;
    width: 150px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    /* 图片 */
    img {
      border-radius: 50%;
      height: 100%;
      width: 100%;
      background-color: #eee;
    }
  }
}

.login_form {
  margin-top: 25%;
  width: 100%;
  bottom: 0;
  padding: 0 80px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
