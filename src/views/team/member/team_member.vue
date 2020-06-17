<template>
  <div class="member">
    <div class="member-wrapper">
      <div class="member-wrapper-some">
        <div class="onTime">
          <process></process>
        </div>
        <div class="asd">
        </div>
      </div>
      <div class="question">
          <!-- 问卷操作 -->
        <!-- 用于展示问卷列表 -->
        <div class="question-list">
          <el-card>
            <div slot="header" style="display: flex; justify-content: space-between;">
              <h3>问卷</h3>
              <el-button style="float: right; padding: 3px 0" type="text"
                @click="CreateQS"
              >发布问卷</el-button>
            </div>
            <div class="show-question">
            <vue-scroll
              slot="refresh-start"
              ref="body"
            >
            <el-collapse accordion>
              <el-collapse-item
                v-for="item in questionnaire"
                :key="item.id"
                :title="item.title"
              >
                <p class="qs-item-desc">
                  {{ item.desc }}
                </p>
                <p style="color: #bbb">发布时间：{{ item.datetime }}</p>
                <p style="color: #00f">截止时间：{{ item.deadline }}</p>
                <el-button size="mini" type="text"
                  @click="toSeeResult(item)"
                >查看调查结果</el-button>
                <div class="qs-item-opt">
                  <el-button type="primary" size="mini" @click="fillQS(item)">填写问卷</el-button>
                  <el-button type="text" size="mini" @click="deleteThisQS(item)">删除问卷</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-pagination
              small
              :current-page="currentPage"
              layout="prev, pager, next"
              @current-change="changeQSPage"
              :total="qsTotal">
            </el-pagination>
            </vue-scroll>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="team-some">
      <memberRight></memberRight>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '../../../components/progress.vue';
import memberRight from '../../../components/member_right.vue';

export default {
  mounted() {
    this.queryQS(1);
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
      isSendTask: (state) => state.isSendTask,
    }),
  },
  data() {
    return {
      questionnaire: [],
      qsPage: 1,
      qsTotal: 0,
      currentPage: 1,
    };
  },
  methods: {
    toSeeResult(item) {
      this.$http.get(`/v1/questionnaires/${item.id}/records`).then((res) => {
        this.$http.get(`/v1/questionnaires/${item.id}`).then((response) => {
          const info = {};
          info.qs = response.data.data;
          info.ans = res.data.data;
          info.info = item;
          this.$store.commit('changeNowQSForChart', info);
          this.$router.push({
            name: 'questionnaire_show',
          });
        });
        this.$message({
          message: '正在跳转页面中~~',
          duration: 1000,
        });
      });
    },
    fillQS(item) {
      console.log(Date.parse(item.deadline));
      console.log(Date.parse(new Date()));
      if (item.filled) {
        this.$message({
          message: '你已经填写过了~',
        });
      } else if (Date.parse(item.deadline) < Date.parse(new Date())) {
        console.log('11');
        this.$message({
          type: 'warning',
          message: '该问卷已经截至！无法填写！',
        });
      } else {
        console.log(item);
        this.$store.commit('changeQID', {
          qs: item,
        });
        this.$router.push({
          name: 'questionnaire_fill',
        });
      }
    },
    CreateQS() {
      if (this.userInfo.id === this.teamInfo.leader_id) {
        this.$router.push({
          name: 'questionnaire_cr',
        });
      } else {
        this.$message({
          message: '你不是管理员！无权发布问卷',
        });
      }
    },
    deleteThisQS(item) {
      if (this.teamInfo.leader_id === this.userInfo.id) {
        this.$http.delete(`/v1/questionnaires/${item.id}`).then((res) => {
          console.log(res);
          this.$message({
            message: '删除成功！',
            type: 'success',
          });
        });
        this.queryQS(1);
      } else {
        this.$message({
          type: 'warning',
          message: '你不是管理员！没有删除权限',
        });
      }
    },
    changeQSPage(val) {
      this.queryQS(val);
    },
    queryQS(queryPage) {
      this.$http.get(`/v1/teams/${this.teamInfo.id}/questionnaires`, {
        params: {
          page: queryPage,
        },
      }).then((res) => {
        this.qsTotal = res.data.data.total;
        this.currentPage = queryPage;
        this.questionnaire = res.data.data.questionnaire;
        // 处理时间
        for (let k = 0; k < this.questionnaire.length; k += 1) {
          const t = this.questionnaire[k].datetime.split('T');
          this.questionnaire[k].datetime = `${t[0]} ${t[1]}`;
          const t2 = this.questionnaire[k].deadline.split('T');
          this.questionnaire[k].deadline = `${t2[0]} ${t2[1]}`;
        }
      });
    },
  },
  components: {
    memberRight,
    process,
  },
};
</script>

<style scoped>
  .member {
    width: 98%;
    height: 80vh;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
  }


  .member-wrapper {
    width: 85%;
    height: 100%;
    background-color: #fff;
  }

  .member-wrapper-some {
    float: left;
    width: 40%;
    height: 90%;
    margin-top: 2%;
    margin-left: 5%;
  }

  .question {
    float: left;
    width: 44%;
    height: 90%;
    margin-top: 2%;
    margin-left: 5%;
    background-color: springgreen;
  }

  .show-question {
    height: 60vh;
  }

  .team-some {
    width: 20%;
    height: 100%;
    padding: 10px;
    margin-left: 1.5%;
    background-color: #fff;
  }

  .onTime {
    width: 100%;
    height: 60%;
  }

  .qs-item-desc {
    color: #aaa;
    font-size: 10px;
  }

  .qs-item-opt {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }
</style>
