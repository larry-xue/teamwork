<template>
    <div class="markdown">
      <div class="container">
          <mavon-editor
            v-model="content"
            ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px"/>
      </div>
      <div class="submit">
        <h3>在这里提交嗷</h3>
        <el-button type="success" size="medium" plain @click="submit">提交</el-button>
      </div>
      <el-dialog
        :visible.sync="openSubmit"
        width="50%">
        <h3>保存markdown文档:</h3>
        <el-divider></el-divider>
        <el-input maxlength="30" v-model="mdName" placeholder="请输入文档名称"></el-input>
        <el-divider></el-divider>
        <el-button type="primary" @click="localSave">保存文档</el-button>
      </el-dialog>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor';
import Storage from '../storage/storage';
import 'mavon-editor/dist/css/index.css';

export default {
  name: '',
  props: [],
  components: {
    mavonEditor,
  },
  data() {
    return {
      content: '',
      html: '',
      configs: {},
      openSubmit: false,
      mdName: '',
    };
  },
  methods: {
    // 将图片上传到服务器，返回地址替换到md中
    // eslint-disable-next-line no-unused-vars
    $imgAdd() {
      this.$message({
        message: '抱歉！暂不支持图片上传！请插入链接！',
      });
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    // 保存
    localSave() {
      // 存到本地localStorage---markdown
      if (Storage.localGet('markdown') === null) {
        Storage.localSet('markdown', []);
      }
      const prv = Storage.localGet('markdown');
      // 先遍历
      console.log(prv);
    },
    // 提交
    submit() {
      this.openSubmit = true;
    },
  },
  mounted() {

  },
};
</script>

<style scoped>
  .submit {
    position: absolute;
    right: 47vw;
    display: flex;
    flex-direction: column;
  }

  .submit h3 {
    margin: 30px auto;
  }
</style>
