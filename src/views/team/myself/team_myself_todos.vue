<template>
  <div class="todos">
    <div class="wrapper-todos">
      <el-collapse accordion @change="changeType">
        <el-collapse-item title="未完成:" name="1">
          <div class="todos-wrapper-some">
           <vue-scroll
              slot="refresh-start"
              ref="body"
            >
              <el-collapse>
                <el-collapse-item
                  v-for="item in userTodosNotDo"
                  :key="item.id"
                  :title="item.title"
                >
                  <div class="todo-desc">
                    <span><strong>任务描述: </strong></span>{{ item.desc }}
                  </div>
                  <div class="todo-deadline">
                    <i class="el-icon-time">{{ item.deadline }}</i>
                    <div style="float: right; padding-right: 20px;">
                      <el-button size="mini" type="primary"
                        @click="gotoSubmit(item)">去提交任务</el-button>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </vue-scroll>
          </div>
        <el-divider></el-divider>
        <el-pagination
          :total="totalDo"
          background
          :current-page.sync="currentPageTodo"
          @current-change="queryAnotherPage"
          layout="prev, pager, next">
        </el-pagination>
        </el-collapse-item>
        <el-collapse-item title="已完成" name="2">
          <div class="todos-wrapper-some">
           <vue-scroll
              slot="refresh-start"
              ref="body"
            >
              <el-collapse>
                <el-collapse-item
                  v-for="item in userTodosDone"
                  :key="item.id"
                  :title="item.title"
                >
                  <div class="todo-desc">
                    <span><strong>任务描述: </strong></span>{{ item.desc }}
                  </div>
                  <div class="todo-deadline">
                    <i class="el-icon-time">{{ item.deadline }}</i>
                  </div>
                  <div style="float: right; padding-right: 20px;">
                    <el-button size="mini" type="primary"
                      @click="gotoSubmit(item)">修改任务提交</el-button>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </vue-scroll>
          </div>
          <el-divider></el-divider>
          <el-pagination
            :total="totalDone"
            background
            :current-page.sync="currentPageDone"
            @current-change="queryAnotherPage"
            layout="prev, pager, next">
        </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  mounted() {
    // this.queryTasks({
    //   status: 2,
    //   uid: this.userInfo.id,
    // });
    console.log(this.userInfo);
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      teamInfo: (state) => state.teamInfo,
    }),
  },
  data() {
    return {
      userTodosNotDo: [],
      userTodosDone: [],
      totalDone: 0,
      totalDo: 0,
      currentPageTodo: 1,
      currentPageDone: 1,
      currentCollapse: '',
      storeCurrentPage: 1,
    };
  },
  methods: {
    // 去提交任务
    gotoSubmit(item) {
      this.$message({
        type: 'success',
        message: '任务已经选择！快去提交吧！',
        showClose: true,
      });
      this.$store.commit('changeSubmitTask', item);
    },
    changeType(val) {
      this.currentCollapse = val;
      if (this.userTodosNotDo.length === 0 && val === '1') {
        this.queryTasks({
          uid: this.userInfo.id,
          status: 0,
        });
      } else if (this.userTodosDone.length === 0 && val === '2') {
        this.queryTasks({
          uid: this.userInfo.id,
          status: 1,
        });
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
      this.storeCurrentPage = val;
      let stat = 1;
      // this.currentPageDone = val;
      if (this.currentCollapse === '1') {
        stat = 0;
        // this.currentPageTodo = val;
      }
      console.log(this.currentCollapse);
      this.queryTasks({
        page: val,
        status: stat,
        uid: this.userInfo.id,
      });
    },
  },
};
</script>

<style scoped>
  .todos {
    width: 100%;
    background-color: #fff;
  }

  .wrapper-todos {
    width: 90%;
    margin: 0 auto;
  }

  .todos-wrapper-some {
    width: 90%;
    margin: 0 auto;
    height: 400px;
  }

  .todo-desc {
    font-size: 19px;
  }

  .todo-deadline {
    font-size: 17px;
  }
</style>
