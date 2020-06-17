<template>
  <div class="work">
    <div class="navMenu">
      <vue-scroll
        slot="refresh-start"
        ref="body"
      >
      <h2 style="margin-bottom: 10px; color: #bbb">本地文库:</h2>
      <div class="doc-list">
        <el-card shadow="hover">
          <h3 slot="header">
            <span>markdown</span>
            <i style="float: right;padding: 3px 0;cursor: pointer" class="el-icon-document-add"
              @click="toCreatDoc('markdown')"
            ></i>
          </h3>
          <div class="md-list">
            <div class="doc-item"
              v-for="item in mdList"
              :key="item.id"
            >
              <h4 :title="item.name">{{item.name}}</h4>
              <div>
                <span>{{item.creator}}</span>
                <el-popover
                  placement="right"
                  trigger="click"
                  >
                <p class="doc-edit-item"
                @click="openAndEdit(item,'markdown')">编辑</p>
                <p class="doc-edit-item"
                @click="deleteThisDoc(item, 'markdown')"
                >删除</p>
                <i class="el-icon-more-outline" slot="reference"></i>
                </el-popover>
              </div>
            </div>
          </div>
        </el-card>
        <el-card shadow="hover">
         <h3 slot="header">
            <span>富文本</span>
            <i style="float: right;padding: 3px 0;cursor: pointer" class="el-icon-document-add"
              @click="toCreatDoc('word')"
            ></i>
          </h3>
          <div class="word-list">
            <div class="doc-item"
              v-for="item in wordList"
              :key="item.id"
            >
              <h4 :title="item.name">{{item.name}}</h4>
              <div>
                <span>{{item.creator}}</span>
                <el-popover
                  placement="right"
                  trigger="click"
                  >
                  <p class="doc-edit-item"
                  @click="openAndEdit(item,'word')">编辑</p>
                  <p class="doc-edit-item"
                  @click="deleteThisDoc(item, 'word')"
                  >删除</p>
                  <i class="el-icon-more-outline" slot="reference"></i>
                </el-popover>
                </div>
            </div>
          </div>
        </el-card>
      </div>
      </vue-scroll>
    </div>
    <div class="worksheet">
      <div class="folderNav">
        <h3 class="folderName">
          团队文件库
        </h3>
        <div class="uploadFile">
          <el-button type="danger" size="mini"
            @click="tryToUpdate">提交任务文件</el-button>
        </div>
      </div>
      <el-divider></el-divider>

      <div class="worksheetFile">
        <!-- 展示文件 -->
        <el-card shadow="hover">
          <h4 slot="header">markdown</h4>
          <div class="file-item"
            v-for="(item, index) in wordFiles"
            :key="index"
          >
            {{item.name}}
          </div>
        </el-card>
        <el-card shadow="hover" style="margin-top: 20px;">
          <h4 slot="header">富文本</h4>
          <div class="file-item"
            v-for="(item, index) in mdFiles"
            :key="index"
          >
            {{item.name}}
          </div>
        </el-card>
        <el-card shadow="hover" style="margin-top: 20px;">
          <h4 slot="header">其他文件</h4>
          <div class="file-item"
            v-for="(item, index) in otherFiles"
            :key="index"
          >
            {{item.name}}
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog title="提交任务文件"
               :visible.sync="dialogVisible"
               width="50%">
      <el-form :model="uploadFile">
        <el-form-item label="上传文件类型：">
          <el-select v-model="uploadFile.type">
            <el-option
              v-for="item in options"
              :key="item.type"
              :label="item.desc"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 根据选择的不同显示不同内容 -->
        <el-form-item
          label="本地markdown文档："
          v-show="uploadFile.type === 1">
          <!-- 上传markdown --- 渲染md列表 -->
          <el-select v-model="uploadFile.storeLocal">
            <el-option
              v-for="item in mdList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="本地富文本："
          v-show="uploadFile.type === 2">
          <el-select v-model="uploadFile.storeLocal">
            <el-option
              v-for="item in wordList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="其他文件："
          v-show="uploadFile.type === 3">
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :before-upload="realUpload"
            :file-list="fileList"
            :multiple="false"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
             <div slot="tip" style="color: #bbb">一次只能上传一个，且不超过20M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否确定完成：">
          <el-switch
            v-model="uploadFile.finish"
          >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 10px;"
            size="small" type="success" @click="submitUpload">提交 | 修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Storage from '../../../storage/storage';

export default {
  computed: {
    ...mapState({
      nowMdId: (state) => state.nowMdId,
      nowWordId: (state) => state.nowWordId,
      mdList: (state) => state.mdList,
      wordList: (state) => state.wordList,
      teamInfo: (state) => state.teamInfo,
      gotoSubmitTask: (state) => state.gotoSubmitTask,
    }),
  },
  data() {
    return {
      fileList: [],
      mdFiles: [],
      wordFiles: [],
      otherFiles: [],
      dialogVisible: false,
      uploadFile: {
        text: '',
        type: '',
        finish: false,
        storeLocal: '',
      },
      // 选择上传文件类型
      options: [
        {
          type: 1,
          desc: 'markdown文档',
        },
        {
          type: 2,
          desc: '富文本',
        },
        {
          type: 3,
          desc: '其他文件',
        },
        {
          type: 4,
          desc: '本任务无需上传文件',
        },
      ],
    };
  },
  methods: {
    // 删除本地文档
    deleteThisDoc(item, name) {
      let docList;
      let doc;
      let tempName = 'wordList';
      if (name === 'word') {
        docList = Storage.localGet('wordList');
        doc = Storage.localGet('word');
      } else {
        docList = Storage.localGet('mdList');
        doc = Storage.localGet('markdown');
        tempName = 'mdList';
      }
      for (let i = 0; i < docList.length; i += 1) {
        if (docList[i].id === item.id) {
          docList.splice(i, 1);
          doc[item.id] = undefined;
          // 重新存储
          Storage.localSet(name, doc);
          Storage.localSet(tempName, docList);
          // 更新store中的数组
          if (name === 'word') {
            this.$store.commit('changeNowWordId', docList);
          } else {
            this.$store.commit('changemdList', docList);
          }
          this.$message({
            message: '删除成功！',
          });
          break;
        }
      }
    },
    // 是否打开提交对话框
    tryToUpdate() {
      if (JSON.stringify(this.gotoSubmitTask) !== JSON.stringify({})) {
        this.dialogVisible = true;
      } else {
        this.$message({
          message: '请先到 自己->任务页 选择要提交的任务！',
          type: 'warning',
        });
      }
    },
    // 上传文件
    realUpload(file) {
      // 读取文件大小
      const fileSize = file.size;
      console.log(fileSize);
      if (fileSize > 1048576 * 20) {
        this.$message({
          type: 'error',
          showClose: true,
          duration: 3000,
          message: '文件不能大于 20M!',
        });
      } else {
        // formData
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 3);
        fd.append('name', file.name);
        fd.append('finish', this.uploadFile.finish);
        this.$http.post(`/v1/tasks/${this.gotoSubmitTask.id}`, fd).then((res) => {
          console.log(res);
          return false;
        });
      }
    },
    submitUpload() {
      if (this.uploadFile.type === '' || this.uploadFile.type === 4) {
        // 只修改finish
        this.$http.post(`/v1/tasks/${this.gotoSubmitTask.id}`, {
          finish: this.uploadFile.finish,
          name: '',
        }).then(() => {
          this.$message({
            message: '上传成功！',
            type: 'success',
          });
        });
        // 上传markdown
      } else if (this.uploadFile.type === 1) {
        if (this.uploadFile.storeLocal === '') {
          this.$message({
            message: '请选择文档后再上传！',
          });
        } else {
          const markdown = Storage.localGet('markdown');
          const md = markdown[this.uploadFile.storeLocal.id];
          this.$http.post(`/v1/tasks/${this.gotoSubmitTask.id}`, {
            type: 1,
            name: this.uploadFile.storeLocal.name,
            finish: this.uploadFile.finish,
            text: md,
          }).then(() => {
            this.$message({
              message: '上传成功！',
              type: 'success',
            });
          });
        }
        // 上传富文本
      } else if (this.uploadFile.type === 2) {
        if (this.uploadFile.storeLocal === '') {
          this.$message({
            message: '请选择文档后再上传！',
          });
        } else {
          const word = Storage.localGet('word');
          const wd = word[this.uploadFile.storeLocal.id];
          this.$http.post(`/v1/tasks/${this.gotoSubmitTask.id}`, {
            type: 2,
            name: this.uploadFile.storeLocal.name,
            finish: this.uploadFile.finish,
            text: wd,
          }).then(() => {
            this.$message({
              message: '上传成功！',
              type: 'success',
            });
          });
        }
      } else if (this.uploadFile.type === 3) {
        // 提交文件
        this.$refs.upload.submit();
      }
      // 先判断是否有需要提交的任务
    },
    toCreatDoc(e) {
      if (e === 'markdown') {
        this.$store.commit('changeNowMDId', {
          id: '',
        });
        this.$router.push({
          name: 'markdown',
        });
      } else {
        this.$router.push({
          name: 'word',
        });
        this.$store.commit('changeNowMDId', {
          id: '',
        });
      }
    },
    openAndEdit(item, e) {
      if (e === 'markdown') {
        this.$store.commit('changeNowMDId', {
          id: item.id,
        });
        this.$router.push({
          name: 'markdown',
        });
      } else {
        this.$store.commit('changeNowWordId', {
          id: item.id,
        });
        this.$router.push({
          name: 'word',
        });
      }
    },
  },
  mounted() {
    if (Storage.localGet('mdList') !== null) {
      this.$store.commit('changemdList', Storage.localGet('mdList'));
    }
    if (Storage.localGet('wordList') !== null) {
      this.$store.commit('changeWordList', Storage.localGet('wordList'));
    }
    if (JSON.stringify(this.gotoSubmitTask) !== JSON.stringify({})) {
      this.uploadFile.finish = this.gotoSubmitTask.finish;
    }
  },
};
</script>


<style scoped>
  .upload {
    margin-top: 12px;
  }

  .work {
    width: 100%;
    margin-top: 20px;
    padding-left: 20px;
    display: flex;
  }

  .work .navMenu {
    width: 25%;
    height: 80vh;
    background-color: #fff;
    min-width: 250px;
    padding: 10px;
    position: relative;
  }

  /* .tree {
  } */

  .work .worksheet {
    width: 70%;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
  }

  .worksheet .folderNav {
    display: flex;
    justify-content: space-between;
  }

  .worksheetSide {
    position: absolute;
    right: 9%;
    top: 15%;
  }

  .createDoc {
    position: absolute;
    left: 100px;
    bottom: 20px;
  }

  .doc-item {
    margin-top: 10px;
    padding: 3px;
    transition: all .2s ease;
  }

  .doc-item:hover {
    background-color: #eef;
  }

  .doc-item div {
    margin-top: 5px;
  }

  .doc-item div i {
    float: right;
    cursor: pointer;
  }

  .doc-edit-item {
    padding: 3px 0;
    cursor:pointer;
    text-align: center;
  }

  .doc-edit-item:hover {
    background-color: #ddd;
  }
</style>
