<template>
  <div class="affair">
    <div class="chatList">
      <div class="searchMember">
        <el-input
          v-model="searchMember" placeholder="搜索" @change="onSearch" clearable></el-input>
      </div>
      <vue-scroll
       slot="refresh-start"
       ref="body"
      >
      <memberItem
        v-for="item in teamInfo.members"
        :key="item.id"
        :item="item"
      ></memberItem>
      </vue-scroll>
    </div>
    <div class="memberTodoList">
      <div class="headerForTodos">
        <h3>当前正在查看 {{ nowWatchUser }} 的任务</h3>
        <el-button type="danger" size="mini" @click="queryAllMemberTasks">查看全部成员的任务</el-button>
      </div>
      <el-divider></el-divider>
      <div class="showTodos">
        <vue-scroll
          slot="refresh-start"
          ref="body"
        >
          <el-collapse accordion @change="changeType">
            <el-collapse-item title="未完成" name="1">
              <el-pagination
                :total="totalDo"
                background
                :current-page.sync="currentPageTodo"
                @current-change="queryAnotherPage"
                layout="prev, pager, next">
              </el-pagination>
              <el-card
                style="margin-top: 5px;"
                v-for="item in userTodosNotDo"
                :key="item.id"
                shadow="hover">
                <div class="todo-item">
                  <h5>{{ item.title }}</h5>
                  <p>{{ item.desc }}</p>
                </div>
                <div class="more-info" style="float: right; cursor: pointer;">
                  <el-tooltip class="item" effect="dark" content="查看详情 & 修改" placement="right">
                    <i class="el-icon-more" @click="queryDeailTask(item)"></i>
                  </el-tooltip>
                </div>
              </el-card>
            </el-collapse-item>
            <el-collapse-item title="已完成" name="2">
             <el-pagination
                :total="totalDone"
                background
                :current-page.sync="currentPageDone"
                @current-change="queryAnotherPage"
                layout="prev, pager, next">
              </el-pagination>
              <el-card
                v-for="item in userTodosDone"
                :key="item.id"
                shadow="hover">
                <!-- http://47.107.32.138/archives/61bca6a7d5404211acfb2d4de067b78c.xls -->
                <div class="todo-item">
                  <h5>{{ item.title }}</h5>
                  <p>{{ item.desc }}</p>
                </div>
                <div class="more-info" style="float: right; cursor: pointer;">
                  <el-tooltip class="item" effect="dark" content="查看详情 & 修改" placement="right">
                    <i class="el-icon-more" @click="queryDeailTask(item)"></i>
                  </el-tooltip>
                </div>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </vue-scroll>
      </div>
    </div>
    <!-- 下达任务的表单 -->
    <el-dialog
      title="下发任务："
      modal
      @close="closeSendTask"
      :visible="isSendTask">
      <h3>当前正在给 {{ nowReceiveUser.name }} 下发任务</h3>
      <el-form :model="sendTask" :rules="rules" ref="sendTask">
        <el-form-item label="主题" prop="title">
          <el-input v-model.trim="sendTask.title"></el-input>
        </el-form-item>
        <el-form-item label="任务详情：" prop="desc">
          <el-input
            show-word-limit
            maxlength="50"
            resize="none"
            type="textarea"
            v-model="sendTask.desc"></el-input>
        </el-form-item>
        <el-form-item label="截至日期：">
          <el-date-picker
            v-model="sendTask.deadline"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
          >
          </el-date-picker>
          <span style="color: #bbb;margin-left: 10px">( 默认时间为当天晚上12点 )</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendTask2Guy('sendTask')">下发任务</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑任务&删除&detail -->
    <el-dialog
      :visible.sync="isEditUserTodo"
    >
      <div class="cover-opt" style="margin-top: 20px;">
        <h3 style="float: left; margin-top: -10px;">编辑任务：</h3>
        <el-button type="warning" @click="delTask">删除任务</el-button>
      </div>
      <!-- 编辑任务 -->
      <div class="edittask">
        <el-form :model="nowEditUser" :rules="rules" ref="nowEditUser">
          <el-form-item label="主题" prop="title">
            <el-input v-model.trim="nowEditUser.title"></el-input>
          </el-form-item>
          <el-form-item label="任务详情：" prop="desc">
            <el-input
              show-word-limit
              maxlength="50"
              resize="none"
              type="textarea"
              v-model="nowEditUser.desc"></el-input>
          </el-form-item>
          <el-form-item label="截至日期：">
            <el-date-picker
              v-model="nowEditUser.deadline"
              type="datetime"
              value-format="yyyy-MM-ddTHH:mm:ss"
            >
            </el-date-picker>
            <span style="color: #bbb;margin-left: 10px">( 默认时间为当天晚上12点 )</span>
          </el-form-item>
          <el-form-item label="当前负责人id：" prop="assignee" style="width: 200px">
            <el-input v-model="nowEditUser.assignee"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editTask('nowEditUser')">修改任务</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-divider></el-divider>
      <el-switch
        inactive-text="当前是否完成："
        v-model="nowEditUser.finish"
        active-color="#13ce66"
        disabled
        inactive-color="#fdd">
      </el-switch>
      <el-card style="margin-top: 30px;" shadow="hover">
        <div slot="header">当前已提交的任务文件：</div>
        <div
          v-for="(item, index) in nowEditUser.archives"
          :key="index"
        >
        <div style="margin-top: 5px;">
            <el-link :href="'http://47.107.32.138' + item.archive_url"
              icon="el-icon-document-copy" type="primary">
              {{ item.name }}
            </el-link>
            <span
              v-if="item.type == 3"
              style="float: right; cursor: pointer; color: #bbb"
              @click="copy($event, `http://47.107.32.138${item.archive_url}`)"
            >
              点击复制分享</span>
            <span v-else
              style="float: right; cursor: pointer; color: #bbb"
              @click="previewDoc(item)"
            >
              点击预览
            </span>
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Clipboard from 'clipboard';
import memberItem from '../../../components/memberItem.vue';

export default {
  mounted() {
    const d = new Date();
    // 补0
    const day = (d.getDate()) < 9 ? `0${d.getDate() + 1}` : d.getDate() + 1;
    const month = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
    this.sendTask.deadline = `${d.getFullYear()}-${month}-${day}T00:00:00`;
    console.log(this.sendTask.deadline);
  },
  components: {
    memberItem,
  },
  watch: {
    nowQueryId(newVal) {
      // 查看他的信息
      for (let i = 0; i < this.teamInfo.members.length; i += 1) {
        if (this.teamInfo.members[i].id === newVal) {
          this.nowWatchUser = this.teamInfo.members[i].name;
          this.$message({
            message: `你当前正在查看${this.teamInfo.members[i].name}的任务`,
            type: 'success',
          });
        }
      }
      this.userTodosNotDo = [];
      this.userTodosDone = [];
      this.isNowQueryUser = true;
      let stat = 0;
      if (this.currentCollapse === '2') {
        stat = 1;
      }
      this.queryTasks({
        uid: Number(newVal),
        status: stat,
      });
    },
  },
  data() {
    return {
      searchMember: '',
      sendTask: {
        title: '',
        desc: '',
        deadline: '',
      },
      nowWatchUser: '全部成员',
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'change',
          },
          {
            username: 'asd',
            answers: [
              {
                type: 1,
                ans: 'A',
              },
              {
                type: 2,
                ans: 'asdadwd',
              },
            ],
          },
          {
            max: 50,
            min: 3,
            message: '内容长度在3-30之间',
            trigger: 'blur',
          },
        ],
        desc: [
          {
            required: true,
            message: '请输入任务内容',
            trigger: 'change',
          },
          {
            max: 50,
            min: 3,
            message: '内容长度在3-50之间',
            trigger: 'blur',
          },
        ],
        assignee: [
          {
            required: true,
            message: '请输入负责人id',
          },
        ],
      },
      currentCollapse: '',
      isNowQueryUser: false,
      userTodosNotDo: [],
      userTodosDone: [],
      currentPageTodo: 1,
      currentPageDone: 1,
      storeCurrentPage: 1,
      totalDone: 0,
      totalDo: 0,
      //
      isEditUserTodo: false,
      nowEditUser: {},
      checkBeforeSendEdit: {},
    };
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
      isSendTask: (state) => state.isSendTask,
      nowQueryId: (state) => state.nowQueryId,
      nowReceiveUser: (state) => state.nowReceiveUser,
    }),
  },
  methods: {
    // 文档预览
    previewDoc(item) {
      console.log(item);
      const url = item.archive_url.split('/').pop();
      this.$http.get(`/v1/archives/${url}`).then((res) => {
        // 先判断是哪一种--再对呀操作
        console.log(item);
        if (item.type === 1) {
          // md
          this.$store.commit('changeNowOpenMDText', {
            text: res.data,
          });
          const routeUrl = this.$router.resolve({
            name: 'markdown',
          });
          window.open(routeUrl.href, '_blank');
        } else {
          // word
          this.$store.commit('changeNowOpenWordText', {
            text: res.data,
          });
          const routeUrl = this.$router.resolve({
            name: 'word',
          });
          window.open(routeUrl.href, '_blank');
        }
      });
    },
    copy(ee, content) {
      const clipboard = new Clipboard(ee.target, { text: () => content });
      clipboard.on('success', () => {
        this.$notify({ type: 'success', message: '复制成功', duration: 2000 });
        clipboard.destroy(); // 释放内存
      });
      clipboard.on('error', () => {
        this.$notify({ type: 'waning', message: '该浏览器不支持自动复制', duration: 2000 });
        clipboard.destroy();
      });
      clipboard.onClick(ee); // 事件绑定
    },
    // 用于再修改或删除后重载页面中的任务
    reloadTasks() {
      const send = {
        page: this.currentPageTodo,
        status: 1,
      };
      if (this.currentCollapse === '1') {
        send.status = 0;
      }
      // send.uid = this.nowEditUser.id;
      for (let i = 0; i < this.teamInfo.members.length; i += 1) {
        if (this.teamInfo.members[i].name === this.nowWatchUser) {
          send.uid = this.teamInfo.members[i].id;
          break;
        }
      }
      console.log(send);
      this.queryTasks(send);
    },
    editTask(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交修改
          const editSend = {
            desc: this.nowEditUser.desc,
            title: this.nowEditUser.title,
            assignee: this.nowEditUser.assignee,
            deadline: this.nowEditUser.deadline,
          };
          this.$http.patch(`/v1/tasks/${this.nowEditUser.id}`, editSend).then(() => {
            this.$message({
              type: 'success',
              message: '任务修改成功！',
            });
            this.reloadTasks();
          }).catch((err) => {
            console.log(err);
          });
        }
      });
    },
    delTask() {
      console.log(this.nowEditUser);
      this.$http.delete(`/v1/tasks/${this.nowEditUser.id}`).then(() => {
        this.$message({
          message: '任务删除成功！',
          type: 'success',
        });
        this.reloadTasks();
      }).catch((err) => {
        this.$message({
          message: err,
          type: 'error',
        });
      });
    },
    // 查看某个任务的详细信息
    queryDeailTask(item) {
      console.log(item.id);
      this.$http.get(`v1/tasks/${item.id}`).then((res) => {
        this.isEditUserTodo = true;
        this.nowEditUser = res.data.data;
      }).catch((err) => {
        console.log(err);
      });
    },
    queryAllMemberTasks() {
      this.$message({
        message: '你当前正在查看全部成员的任务',
        type: 'success',
      });
      this.isNowQueryUser = false;
      this.nowWatchUser = '全部成员';
      this.userTodosNotDo = [];
      this.userTodosDone = [];
      let stat = 0;
      if (this.currentCollapse === '2') {
        stat = 1;
      }
      this.queryTasks({
        status: stat,
      });
    },
    onSearch() {
      console.log(this.$store.state.teamInfo);
    },
    closeSendTask() {
      this.$store.commit('changeSendtask');
    },
    sendTask2Guy(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendTask.assignee = this.nowReceiveUser.id;
          console.log(this.sendTask);
          this.$http.post(`/v1/teams/${this.teamInfo.id}/tasks`, this.sendTask).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: `任务已经发送给${this.nowReceiveUser.name}`,
                type: 'success',
              });
            }
            console.log(res);
          }).catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            });
          });
        }
      });
    },
    changeType(val) {
      console.log(val);
      this.currentCollapse = val;
      const query = {};
      if (this.userTodosNotDo.length === 0 && val === '1') {
        query.status = 0;
      } else if (this.userTodosDone.length === 0 && val === '2') {
        query.status = 1;
      }
      if (this.isNowQueryUser) {
        query.uid = this.nowQueryId;
      }
      if (this.userTodosNotDo.length === 0 || this.userTodosDone.length === 0) {
        this.queryTasks(query);
      }
    },
    queryTasks(info) {
      this.$http.get(`/v1/teams/${this.teamInfo.id}/tasks`, {
        params: info,
      }).then((res) => {
        console.log(res.data.data);
        this.arrangeTodos(res.data.data.tasks, info.status, res.data.data.total);
      }).catch((err) => {
        console.log(err);
      });
    },
    arrangeTodos(receive, status, total) {
      const todos = receive;
      for (let i = 0; i < todos.length; i += 1) {
        // 处理一下时间格式
        const t = todos[i].deadline.split('T');
        todos[i].deadline = `  ${t[0]}  ${t[1]}`;
      }
      if (status === 0) {
        // 未完成
        this.totalDo = total;
        this.userTodosNotDo = todos;
        this.currentPageTodo = this.storeCurrentPage;
      } else if (status === 1) {
        console.log('in');
        this.userTodosDone = todos;
        this.totalDone = total;
        this.currentPageDone = this.storeCurrentPage;
      }
    },
    queryAnotherPage(val) {
      const query = {
        page: val,
        status: 1,
      };
      this.storeCurrentPage = val;
      // this.currentPageDone = val;
      if (this.currentCollapse === '1') {
        query.status = 0;
        // this.currentPageTodo = val;
      }
      if (this.isNowQueryUser) {
        query.uid = this.nowQueryId;
      }
      console.log(this.currentCollapse);
      this.queryTasks(query);
    },
  },
};
</script>

<style scoped>
  .affair  {
    width: 100%;
    height: 80vh;
    margin-top: 20px;
    overflow: hidden;
  }

  .chatList {
    width: 15%;
    float: left;
  }

  .searchMember {
    width: 80%;
    margin: 0 auto;
  }

  .memberTodoList {
    width: 60%;
    height: 100%;
    background-color: #fff;
    float: left;
    padding: 20px;
  }

  .memberTodoList .headerForTodos {

  }

  .showTodos {
    height: 80%;
  }

  .el-button {
    float: right;
    margin-top: -20px;
  }

  .headerForTodos h1 {
    float: left;
  }

  .edittask {
    margin-top: 40px;
  }

</style>
