<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img class="img" src="~assets/sbux.svg" alt />
        <span>后台管理系统</span>
      </div>
      <el-button class="logout-btn" @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#e7e7e7" text-color="#909399" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>导航一</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>右</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="less" scoped>
.logout-btn {
  background-color: #c6c8cd;
  border-radius: 10px;
  border: 0;
  margin-right: 30px;
}
.home-container {
  height: 100%;
  background-color: #e7e7e7;
}

.el-header {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-left: 40px;
  align-items: center;
  color: #878383;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 35px;
      font-size: 25px;
      font-family: Verdana;
    }
    > img {
      height: 100px;
      width: 100px;
      vertical-align: text-bottom;
    }
  }
}

.el-menu,
.el-main {
  margin-top: 40px;
}

.el-aside {
}

.el-main {
}
</style>
