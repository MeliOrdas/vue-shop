<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->

    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesVisibel = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二和三级权限 -->
              <el-col :span="19">
                <!-- 通过For循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="showEditRoles(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="marning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户添加对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesVisibel" width="40%" @close="addRolseClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item label="角色名称" prop="rolesName">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisibel = false">取 消</el-button>
        <el-button type="primary" @click="addRolse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editRolesVisible" width="40%">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="rolesForm" label-width="80px">
        <el-form-item label="角色名称" prop="rolesName">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolseInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        :default-checked-keys="defKeys"
        default-expand-all
        show-checkbox
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showSetRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 控制添加用户对话框的显示与隐藏
      addRolesVisibel: false,
      // 添加用户表单数据
      addForm: {
        roleDesc: '',
        roleName: ''
      },
      editRolesVisible: false,
      // 查询用户信息对象
      rolesForm: {},
      // 分配权限对话框
      showSetRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      rightsListChildren: [],
      defKeys: []

    };
  },
  created () {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) return this.$message.error('获取角色列表信息失败');
      // this.$message.success('获取列表成功');
      // 数据赋值
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },

    // 监听对话框关闭事件
    addRolseClosed () {
      this.$refs.addFormRef.resetFields();
    },
    // 添加新角色
    async addRolse () {
      // 发起网络请求
      const { data: res } = await this.$http.post('roles', this.addForm);
      // 打印所有新角色
      console.log(res);
      if (res.meta.status !== 201) return this.$message.error('添加新角色失败');
      this.$message.success('添加新角色成功');
      // 隐藏添加新角色对话框
      this.addRolesVisibel = false;
      // 刷新数据列表
      this.getRolesList();
    },
    // 删除新角色
    async removeRolesById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // 取消删除的信息
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除');
      }
      // 发起删除用户请求
      const { data: res } = await this.$http.delete('roles/' + id);
      if (res.meta.status !== 200) return this.$message.error('删除失败');
      this.$message.success('删除成功');
      // 刷新列表
      this.getRolesList();
    },
    // 发起修改角色信息请求
    async showEditRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id);

      if (res.meta.status !== 200) { return this.$message.error('查询角色失败'); }
      this.rolesForm = res.data;
      this.editRolesVisible = true;
    },
    // 修改角色信息
    async editRolseInfo () {
      // 发起角色编辑事件
      const { data: res } = await this.$http.put('roles/' + this.rolesForm.roleId, { roleDesc: this.rolesForm.roleDesc, roleName: this.rolesForm.roleName });
      if (res.meta.status !== 200) return this.$message.error('更新用户失败');
      // 关闭对话框
      this.editRolesVisible = false;
      // 刷新列表
      this.getRolesList();
      // 提示修改成功
      this.$message.success('修改成功！');
    },
    // 弹框提示用户是否删除权限
    async removeRightById (roleId, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if (confirmResult !== 'confirm') return this.$message.info('取消删除');

      const { data: res } = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`);

      if (res.meta.status !== 200) return this.$message.error('删除权限失败!');

      // this.getRolesList() 相当于赋值刷新数据 , 实现不让页面闭合
      roleId.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog (roles) {
      const { data: res } = await this.$http.get('rights/tree');

      if (res.meta.status !== 200) { return this.$message.error('获取列表失败'); }
      // 获取到的权限数据保存到data中
      this.rightsList = res.data;
      // 递归获得三级权限的id
      this.getLeafKeys(roles, this.defKeys);

      this.showSetRightDialogVisible = true;
    },
    // 通过递归的形式,获取角色下所有三级权限的id,并保存到defKeys 数组中
    getLeafKeys (node, arr) {
      // 如果当权 node 节点不包括children属性 , 则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    setRightDialogClose () {
      this.defKeys = [];
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
