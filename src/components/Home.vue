/* eslint-disable quote-props */
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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#d3d3d3"
          text-color="#909399"
          active-text-color="skyblue"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in meniulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index=" '/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="SaveNavState( '/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main class="login-right">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      meniulist: [],
      iconObj: {
        // eslint-disable-next-line quote-props
        '125': 'iconfont icon-people_fill',
        // eslint-disable-next-line quote-props
        '103': 'iconfont icon-supply',
        // eslint-disable-next-line quote-props
        '101': 'iconfont icon-commodity',
        // eslint-disable-next-line quote-props
        '102': 'iconfont icon-document_fill',
        // eslint-disable-next-line quote-props
        '145': 'iconfont icon-computer_fill'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的空地址
      activePath: ''
    };
  },
  name: 'Home',
  created () {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout () {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus');
      // console.log(res);

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.meniulist = res.data;
      console.log(this.meniulist);
    },
    // 点击按钮切换菜单折叠与展开
    toggleClick () {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接激活的状态
    SaveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
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

.el-aside {
  .el-menu {
    border-right: none;
  }
}

.iconfont {
  margin-right: 10px;
}

.login-right {
  // background-color: rgb(231, 231, 231);
}

.toggle-button {
  background-color: #d4d4d4;
  padding-top: 10px;
  margin-top: 35px;
  font-size: 15px;
  height: 25px;
  text-align: center;
  color: #909399;
  letter-spacing: 0.2em;
  cursor: pointer;
  border: 0;
}
</style>
