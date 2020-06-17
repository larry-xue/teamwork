<template>
    <div class="fill_qs">
      <el-card>
          <div slot="header">
            <h1>{{ question.title }}</h1>
            <div style="padding: 10px">{{ question.desc }}</div>
          </div>
          <div class="showQS">
            <div class="show-item"
              v-for="item in answers"
              :key="item.qid"
            >
                <div class="header">
                    {{item.qid}}.{{item.qs.desc}}
                </div>
              <div
                v-if="item.type === 1"
              >
              <!-- 单选题 -->
                  <div
                    class="item-opt"
                    v-for="option in item.qs.options"
                    :key="option.oid">
                    <el-radio-group v-model="item.ans">
                        <el-radio
                        :label="option.oid"
                        >{{ letter[option.oid] }}.{{option.desc}}</el-radio>
                    </el-radio-group>
                  </div>
              </div>
              <div v-else-if="item.type === 2">
                  <!-- 多选题 -->
                  <div
                    class="item-opt"
                    v-for="option in item.qs.options"
                    :key="option.oid"
                  >
                    <el-checkbox-group v-model="item.ans">
                        <el-checkbox :label="option.oid"
                        >{{ letter[option.oid] }}.{{option.desc}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
              </div>
              <div v-else-if="item.type === 3">
                <!-- 填空题 -->
                <div
                  style="padding: 0 auto;"
                >
                  <el-input v-model.trim="item.ans"
                    type="textarea"
                    resize="none"
                    maxlength="500"
                    show-word-limit
                  ></el-input>
                </div>
              </div>
            </div>
            <div class="submit"
               @click="submitQS"
              >
                  <el-button type="success">提交问卷</el-button>
            </div>
          </div>
      </el-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      teamInfo: (state) => state.userInfo,
      question: (state) => state.question,
    }),
  },
  methods: {
    // eslint-disable-next-line consistent-return
    submitQS() {
    //   console.log(this.answers);
      for (let i = 0; i < this.answers.length; i += 1) {
        console.log(this.answers[i].ans);
        if (this.answers[i].ans === '') {
          this.$message({
            message: `第${this.answers[i].qid}题还未填写！`,
            type: 'warning',
          });
          return false;
        }
      }
      const send = [];
      for (let i = 0; i < this.answers.length; i += 1) {
        send.push({
          qid: i + 1,
          type: this.answers[i].type,
          ans: this.answers[i].ans,
        });
      }
      this.$http.post(`/v1/questionnaires/${this.question.id}`, {
        answers: send,
      }).then((res) => {
        console.log(res);
      });
    },
  },
  data() {
    return {
      QS: [],
      answers: [],
      letter: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    };
  },
  mounted() {
    this.$http.get(`/v1/questionnaires/${this.question.id}`).then((res) => {
      this.QS = res.data.data;
      console.log(this.QS);
      // 动态添加答案数组
      for (let i = 0; i < res.data.data.length; i += 1) {
      // a
        this.answers.push({
          qid: i + 1,
          type: this.QS[i].type,
          ans: this.QS[i].type === 2 ? [] : '',
          qs: this.QS[i],
        });
      }
      console.log(this.answers);
    });
  },
};
</script>

<style scoped>
  .fill_qs {
    margin: 0 auto;
    width: 60vw;
  }

  .header {
      height: 30px;
  }

  .item-opt {
      height: 30px;
  }

  .submit {
      margin-top: 30px;
      display: flex;
      justify-content: center;
  }
</style>
