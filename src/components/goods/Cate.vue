<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" class="treeTable" @click="getCateDialog">添加分类</el-button>
        </el-col>

        <!-- 表格 -->
        <tree-table
          class="treeTable"
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border
        >
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color:lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
          <template slot="ope" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editCateList(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCateList(scope.row)">删除</el-button>
          </template>
        </tree-table>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3,6,9,12]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogVisibleClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 用来指定数据源 -->
          <!-- props 指定数据配置对象 -->
          <!-- v-model 选中的父级id -->
          <!-- change 选择改变后触发事件 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
        :model="editCateListForem"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateListForem.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 6,
        pagenum: 1,
        pagesize: 6
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'

        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'ope'
        }
      ],
      // 控制添加分分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 控制编辑分分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },

      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 编辑分类列表
      editCateListForem: {}

    };
  },
  created () {
    this.getCateList();
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo });

      if (res.meta.status !== 200) { return this.$message.error('请求失败!'); }
      // console.log(res);
      // 列表赋值
      this.cateList = res.data.result;
      // 总数赋值
      this.total = res.data.total;
    },
    handleSizeChange (newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange (newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    getCateDialog () {
      // 获取腹肌分类的数据列表
      this.getParentCateList();
      // 在展示出对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get(
        'categories', { params: { type: 2 } });

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级元素列表失败！');
      }

      this.parentCateList = res.data;
    },
    // 父级分类改变时
    parentCateChange () {
      // console.log(this.selectedKeys);
      // 如果 selectedKeys.length > 0 证明选中的父级分类
      // 反之 就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级id分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮添加新对话框
    addCate () {
      this.$refs.addCateFormRef.validate(async vali => {
        if (!vali) { return; }
        const { data: res } = await this.$http.post('categories', this.addCateForm);

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!');
        }

        this.$message.success('添加分类成功');
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 监听对话框关闭事件 ,重置表单数据
    addCateDialogVisibleClose () {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 编辑列表事件处理
    async editCateList (editId) {
      const { data: res } = await this.$http.get(`categories/${editId.cat_id}`);
      if (res.meta.status !== 200) { return; }
      this.editCateListForem = res.data;
      this.editCateDialogVisible = true;
    },
    // 点击确认编辑数据
    editCateInfo () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return '';
        // 用put 请求更新数据
        const { data: res } = await this.$http.put(`categories/${this.editCateListForem.cat_id}`, { cat_name: this.editCateListForem.cat_name });
        if (res.meta.status !== 200) { return this.$message.error('请求失败'); }
        this.$message.success('编辑分类数据成功！');
        this.getCateList();
        this.editCateDialogVisible = false;
      }
      );
    },
    async deleteCateList (Id) {
      const confirmCate = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmCate !== 'confirm') { return this.$message.info('已取消删除！'); }
      const { data: res } = await this.$http.delete(`categories/${Id.cat_id}`);
      if (res.meta.status !== 200) { return this.$message.error('删除失败！'); }
      this.$message.success('已经成功删除！');
      this.getCateList();
    }

  }
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
