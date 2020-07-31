<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 进度条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs标签页 -->
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="cateClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                clearable
                expand-trigger="hover"
                v-model="addFrom.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- active 表示图片上传到后台的api地址 -->
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" width="50%" :visible.sync="pictureVisible">
      <img :src="previewPath" class="dialogPicture" />
    </el-dialog>
  </div>
</template>
//
<script>
import _ from 'lodash';

export default {
  data () {
    return {
      activeIndex: '0',
      // 添加表单数据验证对象
      addFrom: {
        goods_name: '2',
        goods_price: '2',
        goods_weight: '2',
        goods_number: '2',
        // 商品所属的分类数据
        goods_cat: [],
        // 上传的图片临时路径
        pics: [],
        // 商品描述详情
        goods_introduce: '',
        attrs: []
      },
      // 数据验证规则
      addFromRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品名称', trigger: 'blur' }]
      },
      // 获取categories数据
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态数据
      manyTableData: [],
      // 静态数据
      onlyTableData: [],
      upLoadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片路径
      previewPath: '',
      // 图片预览开关
      pictureVisible: false
    };
  },
  created () {
    this.getCateList();
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) { return this.$message.error('获取数据失败'); }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    // 验证数据
    errorOptions (res) {
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败!');
      }
      return res;
    },
    // 级联选择器选中项变化 , 会触发这个函数
    handleChange () {
      // console.log(this.addFrom.goods_cat);
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = [];
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addFrom.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类');
        return false;
      }
    },
    // 点击tabs时发起数据请求
    async cateClicked () {
      // console.log(this.activeIndex);
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } });
        this.errorOptions(res);
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
        });
        this.manyTableData = res.data;
        // console.log(this.manyTableData);
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } });
        this.errorOptions(res);
        this.onlyTableData = res.data;
        // console.log(this.onlyTableData);
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url;
      console.log(this.previewPath);
      this.pictureVisible = true;
    },
    // 处理图片移除操作的
    handleRemove (file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addFrom.pics.findIndex(x => x.pic === filePath);
      this.addFrom.pics.splice(i, 1);
      // console.log(this.addFrom);
    },
    // 处理图片上传成功的钩子
    handleSuccess (response) {
      // console.log(response);
      // 1 拼接得到一个对象
      const picsInfo = { pic: response.data.tmp_path };
      // 2 将对象数据传入addFrom
      this.addFrom.pics.push(picsInfo);
      // console.log(this.addFrom);
    },
    add () {
      // 表单校验,
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请添加必要的表单项目');
        }
        // 业务逻辑
        // 深拷贝addFrom
        const from = _.cloneDeep(this.addFrom);
        from.goods_cat = from.goods_cat.join(',');
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addFrom.attrs.push(newInfo);
        });
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addFrom.attrs.push(newInfo);
        });
        from.attrs = this.addFrom.attrs;
        console.log(this.onlyTableData);
        console.log(this.manyTableData);
        // if (this.onlyTableData.length !== 0 && this.manyTableData.length !== 0) {
        const { data: res } = await this.$http.post('goods', from);
        console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error('创建商品失败!');
        }
        this.$message.success('添加商品成功');
        this.$router.push('/goods');
        // }
      });
    }
  },
  computed: {
    // 获取ID
    cateId () {
      if (this.addFrom.goods_cat.length === 3) {
        return this.addFrom.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.dialogPicture {
  width: 100%;
  height: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>
