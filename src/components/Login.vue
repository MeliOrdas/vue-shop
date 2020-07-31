<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
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
          <el-button type="primary" @click="login">登录</el-button>
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
        username: 'admin',
        password: '123456'
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
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data } = await this.$http.post('login', this.loginForm);
        if (data.meta.status !== 200) return this.$message.error('登陆失败');
        this.$message.success('登陆成功');
        console.log(data);
        // 传输数据中的token(钥匙) , 下次携带数据交互
        window.sessionStorage.setItem('token', data.data.token);
        // 路由跳转
        this.$router.push('/home');
      });
    }
  }
};
</script>
<style lang="less" scoped>
/*登陆界面样式*/
.login_container {
  background: url("../assets/wallhaven-q6poqd.png") no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
}
/* 登录框 */
.login_box {
  width: 450px;
  height: 300px;
  // display: flex;
  background: inherit;
  z-index: 100;
  border-radius: 10px;
  position: relative;
  overflow: hidden;

  /* 图片 */
  img {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    background-color: #eee;
  }
}
.login_box::before {
  content: "";
  background: inherit;
  box-shadow: inset 0 0 0 2000px rgba(255, 255, 255, .25);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  filter: blur(6px);
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
