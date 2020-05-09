<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form class="login_form">
        <!-- 用户名 -->
        <el-form-item>
          <el-input prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button class="login_enter" type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>

        <el-form-item></el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login'
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
.login_enter {
  // margin: 0 10px;
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 80px;
  margin-top: 30px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
