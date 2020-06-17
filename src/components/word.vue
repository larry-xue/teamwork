<template>
<!-- 写在开头--word基本上就是markdown的复刻（指存储的实现以及编辑） -->
  <div>
    <el-card style="height: 610px;">
      <quill-editor
        v-model="content" ref="myQuillEditor" style="height: 500px;" :options="editorOption">
        <!-- 自定义toolar -->
        <div id="toolbar" slot="toolbar">
          <!-- Add a bold button -->
          <button class="ql-bold" title="加粗">Bold</button>
          <button class="ql-italic" title="斜体">Italic</button>
          <button class="ql-underline" title="下划线">underline</button>
          <button class="ql-strike" title="删除线">strike</button>
          <button class="ql-blockquote" title="引用"></button>
          <button class="ql-code-block" title="代码"></button>
          <button class="ql-header" value="1" title="标题1"></button>
          <button class="ql-header" value="2" title="标题2"></button>
          <!--Add list -->
          <button class="ql-list" value="ordered" title="有序列表"></button>
          <button class="ql-list" value="bullet" title="无序列表"></button>
          <!-- Add font size dropdown -->
          <select class="ql-header" title="段落格式">
            <option selected>段落</option>
            <option value="1">标题1</option>
            <option value="2">标题2</option>
            <option value="3">标题3</option>
            <option value="4">标题4</option>
            <option value="5">标题5</option>
            <option value="6">标题6</option>
          </select>
          <select class="ql-size" title="字体大小">
            <option value="10px">10px</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px" selected>16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
          </select>
          <select class="ql-font" title="字体">
            <option value="SimSun">宋体</option>
            <option value="SimHei">黑体</option>
            <option value="Microsoft-YaHei">微软雅黑</option>
            <option value="KaiTi">楷体</option>
            <option value="FangSong">仿宋</option>
            <option value="Arial">Arial</option>
          </select>
          <!-- Add subscript and superscript buttons -->
          <select class="ql-color" value="color" title="字体颜色"></select>
          <select class="ql-background" value="background" title="背景颜色"></select>
          <select class="ql-align" value="align" title="对齐"></select>
          <button class="ql-clean" title="还原"></button>
          <!-- You can also add your own -->
        </div>
      </quill-editor>
    </el-card>
      <div class="submit">
        <h3>在这里保存嗷</h3>
        <el-button type="success" size="medium" plain @click="submit">保存</el-button>
      </div>
      <el-dialog
        :visible.sync="openSubmit"
        width="50%">
        <h3>保存富文本文档:</h3>
        <el-divider></el-divider>
        <el-input maxlength="30" v-model.trim="wordName" placeholder="请输入文档名称"></el-input>
        <el-divider></el-divider>
        <el-button type="primary" @click="localSave">保存文档</el-button>
      </el-dialog>
  </div>
</template>

<script>
import {
  Quill,
  quillEditor,
} from 'vue-quill-editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'quill/dist/quill.core.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'quill/dist/quill.snow.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'quill/dist/quill.bubble.css';

// 引入font.css
import '../assets/font.css';
import { mapState } from 'vuex';
import Storage from '../storage/storage';

// 自定义字体大小
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px'];
Quill.register(Size, true);

// 自定义字体类型
const fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
  '宋体', '黑体',
];
const Font = Quill.import('formats/font');
Font.whitelist = fonts;
Quill.register(Font, true);

export default {
  name: 'FuncFormsEdit',
  components: {
    quillEditor,
  },
  computed: {
    ...mapState({
      nowWordId: (state) => state.nowWordId,
      wordList: (state) => state.mdList,
      userInfo: (state) => state.userInfo,
      nowOpenWordText: (state) => state.nowOpenWordText,
    }),
  },
  data() {
    return {
      content: '',
      editorOption: {
        placeholder: '请输入',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: '#toolbar',
          },
        },
      },
      openSubmit: false,
      wordName: '',
    };
  },
  methods: {
    quillSubmit() {
      // this.content = html;
      this.openSubmit = true;
    },
    // 将图片上传到服务器，返回地址替换到md中
    // eslint-disable-next-line no-unused-vars
    $imgAdd() {
      this.$message({
        message: '抱歉！暂不支持图片上传！请插入链接！',
      });
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 word 解析后的结果[html]
      this.html = render;
    },
    // 保存
    localSave() {
      if (this.wordName === '') {
        this.$message({
          message: '文档名不能为空！',
        });
      } else if (this.nowWordId !== '') {
        // 更新md
        const word = Storage.localGet('word');
        word[this.nowWordId] = this.content;
        Storage.localSet('word', word);
        // 更新名称
        const wordList = Storage.localGet('wordList');
        for (let i = 0; i < wordList.length; i += 1) {
          if (wordList[i].id === this.nowMDId) {
            wordList[i].name = this.wordName;
            Storage.localSet('wordList', wordList);
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
        const word = Storage.localGet('word');
        word[Tid] = this.content;
        Storage.localSet('word', word);
        // 插入到list
        const wordList = Storage.localGet('wordList');
        wordList.push({
          name: this.wordName,
          creator: this.userInfo.name,
          id: Tid,
        });
        Storage.localSet('wordList', wordList);
        this.$message({
          message: '保存成功！',
        });
        // 和md相似
        this.$store.commit('changeNowWordId', {
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
    // 如果没有word就创建一下
    if (Storage.localGet('word') === null) {
      Storage.localSet('word', {});
    }
    if (Storage.localGet('wordList') === null) {
      Storage.localSet('wordList', []);
    }
    //
    // localStorage: word & wordList
    // word: { 1: doc1, 2: doc2 }
    // wordList: [ {creator: 'aaa', id: 1, name: 'docname} ]
    //
    // 如果有mdId则从localstorage中找出文档
    if (this.nowWordId !== '') {
      const wordList = Storage.localGet('wordList');
      for (let i = 0; i < wordList.length; i += 1) {
        if (wordList[i].id === this.nowWordId) {
          const word = Storage.localGet('word');
          if (word !== null) {
            this.wordName = wordList[i].name;
            console.log(wordList[i]);
            this.content = word[this.nowWordId];
            break;
          }
        }
      }
    } else if (this.nowOpenWordText !== '') {
      this.content = this.nowOpenWordText;
    }
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
