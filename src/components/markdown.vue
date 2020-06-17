<template>
    <div class="markdown">
      <div class="container">
          <mavon-editor
            v-model="content"
            ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px"/>
      </div>
      <div class="submit">
        <h3>在这里保存嗷</h3>
        <el-button type="success" size="medium" plain @click="submit">保存</el-button>
      </div>
      <el-dialog
        :visible.sync="openSubmit"
        width="50%">
        <h3>保存markdown文档:</h3>
        <el-divider></el-divider>
        <el-input maxlength="30" v-model.trim="mdName" placeholder="请输入文档名称"></el-input>
        <el-divider></el-divider>
        <el-button type="primary" @click="localSave">保存文档</el-button>
      </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { mavonEditor } from 'mavon-editor';
import Storage from '../storage/storage';
import 'mavon-editor/dist/css/index.css';

export default {
  computed: {
    ...mapState({
      nowMDId: (state) => state.nowMDId,
      mdList: (state) => state.mdList,
      userInfo: (state) => state.userInfo,
      nowOpenMDText: (state) => state.nowOpenMDText,
    }),
  },
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
      if (this.mdName === '') {
        this.$message({
          message: '文档名不能为空！',
        });
      } else if (this.nowMDId !== '') {
        // 更新md
        const markdown = Storage.localGet('markdown');
        markdown[this.nowMDId] = this.content;
        Storage.localSet('markdown', markdown);
        // 更新名称
        const mdList = Storage.localGet('mdList');
        for (let i = 0; i < mdList.length; i += 1) {
          if (mdList[i].id === this.nowMDId) {
            mdList[i].name = this.mdName;
            Storage.localSet('mdList', mdList);
            break;
          }
        }
        this.$message({
          message: '保存成功！',
        });
        this.openSubmit = false;
      } else {
        // 以当前时间作为id
        // 先用id存文档
        const Tid = Date.parse(new Date());
        const markdown = Storage.localGet('markdown');
        markdown[Tid] = this.content;
        Storage.localSet('markdown', markdown);
        // 插入到list
        const mdList = Storage.localGet('mdList');
        mdList.push({
          name: this.mdName,
          creator: this.userInfo.name,
          id: Tid,
        });
        Storage.localSet('mdList', mdList);
        this.$message({
          message: '保存成功！',
        });
        // 修改当前id否则会再创建一个文档
        this.$store.commit('changeNowMDId', {
          id: Tid,
        });
        this.openSubmit = false;
      }
    },
    // 提交
    submit() {
      this.openSubmit = true;
    },
  },
  mounted() {
    // 如果没有markdown就创建一下
    if (Storage.localGet('markdown') === null) {
      Storage.localSet('markdown', {});
    }
    if (Storage.localGet('mdList') === null) {
      Storage.localSet('mdList', []);
    }
    //
    // localStorage: markdown & mdList
    // markdown: { 1: doc1, 2: doc2 }
    // mdList: [ {creator: 'aaa', id: 1, name: 'docname} ]
    //
    // 如果有mdId则从localstorage中找出文档
    if (this.nowMDId !== '') {
      const mdList = Storage.localGet('mdList');
      for (let i = 0; i < mdList.length; i += 1) {
        if (mdList[i].id === this.nowMDId) {
          const markdown = Storage.localGet('markdown');
          if (markdown !== null) {
            this.mdName = mdList[i].name;
            this.content = markdown[this.nowMDId];
            break;
          }
        }
      }
    } else if (this.nowOpenMDText !== '') {
      this.content = this.nowOpenMDText;
    }
  },
};

// window.onbeforeunload = () => {
//   console.log(11111111111111);
//   window.alert('asd');
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
