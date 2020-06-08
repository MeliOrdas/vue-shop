<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-share" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error('输入合法的邮箱'));
    };
    const checkMobile = (rule, value, cb) => {
      // 验证手机的正则表达式
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error('输入合法的手机号'));
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 15,
            message: '密码的长度在6~15之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ]
        // 控制修改用户对话框的显示与隐藏
      },
      editDialogVisible: false,
      // 查询用户信息对象
      editForm: {},
      // 修改表单验证规则对象
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入用户邮箱',
            trigger: 'blur'
          }, { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入用户手机',
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getUserList();
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败'); }
      this.userlist = res.data.users;
      this.total = res.data.total;
      // console.log(this.userlist);
      // console.log(this.total);
    },
    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变事件
    handleCurrentChange (newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听 switch 开关状态的改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
      console.log(res);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error('更新用户状态失败!');
      }
      this.$message.success('更新用户状态成功!');
    },
    // 监听添加对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields();
    },
    // 点击添加新用户
    addUser () {
      console.log(this.$refs.addFormRef);

      this.$refs.addFormRef.validate(async valid => {
        // 发起添加用户网络请求
        if (!valid) return;
        const { data: res } = await this.$http.post('users', this.addForm);
        console.log(res);

        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败');
        }
        this.$message.success('添加用户成功');
        // 隐藏 添加用户对话框
        this.addDialogVisible = false;
        // 刷新重置用户列表
        this.getUserList();
      });
    },
    // 展示编辑对应用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id);
      if (res.meta.status !== 200) { return this.$message.error('查询用户失败'); }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改用户数据请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile });
        console.log(this.editForm.id);
        console.log(res);

        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败');
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success('更新用户信息成功');
      });
    },
    // 根据id删除用户信息
    async removeUserById (id) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      // 如果用户确认删除则返回字符串 confirm
      // 如果用户取消删除返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除');
      }

      const { data: res } = await this.$http.delete('users/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败');
      }
      this.$message.success('删除成功！');
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
