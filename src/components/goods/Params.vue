<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意 : 只允许第三级分类设置相关参数 ！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类 :</span>
          <el-cascader
            expandTrigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  size="small"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row) "
                >{{ item }}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  id="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  size="small"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row) "
                >{{ item }}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  id="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template src slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="addParams"
        :rules="addParamsrules"
        ref="addParamsruleForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTrendsParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="editParams"
        :rules="editParamsrules"
        ref="editParamsruleForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTrendsParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 被激活页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      // 添加参数对话框
      addParamsDialogVisible: false,
      // 添加参数对话框数据
      addParams: {
        attr_name: ''
      },
      // 添加表单验证规则
      addParamsrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editParamsDialogVisible: false,
      // 修改表单数据对象
      editParams: {
        attr_name: ''
      },
      // 修改表单验证规则对象
      editParamsrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getCateList();
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败！');
      }
      this.cateList = res.data;
    },
    // 级联选择框选中项变化, 触发该函数
    handleChange () {
      this.getParamsData();

      // 当级联选择器为空时重新加载数据
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
      }
    },
    // tab 点击页签事件
    handleClick () {
      this.getParamsData();
      console.log(this.activeName);
    },
    // 获取参数列表数据
    async getParamsData () {
      // 三级分类选项
      // console.log(this.selectedCateKeys);
      // 根据所选分类的Id ， 和当前所处面板 ， 获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return '';
      }

      res.data.forEach(items => {
        items.attr_vals = items.attr_vals ? items.attr_vals.split(',') : [];
        // 控制文本的显示与隐藏
        items.inputVisible = false;
        // 控制输入框的值
        items.inputValue = '';
      });

      // 检测获取的数据是动态参数还是静态参数
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
      // console.log(this.manyTableData);
    },
    // 监听添加对话框的关闭事件
    addDialogClosed () {
      this.$refs.addParamsruleForm.resetFields();
    },
    // 点击按钮添加参数
    addTrendsParams () {
      this.$refs.addParamsruleForm.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParams.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！');
        }
        this.$message.success('添加参数成功！');
        this.getParamsData();
        this.addParamsDialogVisible = false;
      });
    },
    // 点击编辑事件
    async showEditDialog (attrId) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        { attr_sel: this.activeName }
      );

      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败!');
      }
      this.editParams = res.data;
      this.editParamsDialogVisible = true;
    },
    // 表单关闭时清空对话框
    editDialogClosed () {
      this.$refs.editParamsruleForm.resetFields();
    },
    // 点击按钮修改参数
    editTrendsParams () {
      this.$refs.editParamsruleForm.validate(async valid => {
        if (!valid) {
          return '';
        }
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParams.attr_id}`,
          { attr_name: this.editParams.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('参数修改失败!');
        }
        this.$message.success('参数修改成功!');
        this.getParamsData();
        this.editParamsDialogVisible = false;
      });
    },
    // 删除参数事件
    async removeParams (attrId) {
      const confirm = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);

      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除!');
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败!');
      }
      this.$message.success('删除参数成功!!');
      this.getParamsData();
    },
    // 文本框失去焦点,或按下Enter键都会触发
    async handleInputConfirm (row) {
      console.log(row);

      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      // 如果没有return 则将数据
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;

      this.saveAttrVals(row);
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join()
      });

      if (res.meta.status !== 200) { return this.$message.error('修改参数失败!!'); }
      this.$message.success('修改参数成功!!');
    },
    // 点击按钮展示文本输入框
    showInput (row) {
      row.inputVisible = true;
      // 让文本框自动获取焦点
      // $nextTick 方法的作用 , 就是当页面上的元素被重新渲染之后,才会指定回调函数中的代码
      // 个人理解:相当于DOM渲染完之前后就会 回调NextTick函数, 相当于是一个钩子
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  },
  computed: {
    isBtnDisabled () {
      // 结果为true时禁用按钮 ，为false 时启用按钮
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态切换标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数';
      } else {
        return '静态属性';
      }
    }
  }
};
</script>

<style lang="less" scope>
.cat_opt {
  margin: 15px 0;
  .el-cascader {
    margin-left: 15px;
    width: 30%;
  }
}
.el-tag {
  margin: 10px;
}

#input-new-tag {
  width: 90px;
}
</style>
