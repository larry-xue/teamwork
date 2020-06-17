<template>
    <div class="questionnaire">
        <div class="question-left">
            <!-- 动态添加题目 -->
            <el-card>
                <div class="add-question-item" style="margin: 0"
                    @click="addNewQs(1)"
                >
                    <i class="el-icon-document-add"></i>
                    添加单选题
                </div>
                <div class="add-question-item"
                    @click="addNewQs(2)"
                >
                    <i class="el-icon-s-help"></i>
                    添加多选题
                </div>
                <div class="add-question-item"
                    @click="addNewQs(3)"
                >
                    <i class="el-icon-chat-line-square"></i>
                    添加填空题
                </div>
            </el-card>
        </div>
        <div class="question-right">
            <div class="page-header">
                <h2>创建新问卷：</h2>
            </div>
            <el-divider></el-divider>
            <div class="pahe-body">
              <div class="input-qs-info">
                  <div class="info-title">
                    <div style="padding-bottom: 10px;">请输入问卷标题：💕</div>
                    <el-input
                        size="mini"
                        clearable
                        v-model.trim="sendQuestion.title" maxlength="32" show-word-limit></el-input>
                  </div>
                  <div class="info-desc">
                    <div style="padding: 10px 0;">请输入问卷描述：💕</div>
                    <el-input
                        size="mini"
                        clearable
                        v-model.trim="sendQuestion.desc" maxlength="128" show-word-limit></el-input>
                  </div>
                  <div  style="margin: 10px 0;" class="info-deadline">
                    <span>请选择问卷截至时间：💕  </span>
                      <el-date-picker
                      :editable="false"
                      :picker-options="pickerOptions"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        v-model="sendQuestion.deadline"
                        type="datetime"
                        placeholder="选择日期时间"
                        default-time="12:00:00">
                      </el-date-picker>
                  </div>
              </div>
              <el-divider></el-divider>
              <div class="input-qs-qs">
                  <div
                    v-for="item in sendQuestion.questions"
                    :key="item.qid"
                  class="qs-qs-item">
                  <el-card shadow="hover">
                    <div slot="header">
                      <span>{{item.qid}}.{{item.desc}} {{ selectType[item.type] }}</span>
                      <div class="moreOpt-qs">
                          <i @click="openEdit(item.qid, item)" class="el-icon-edit"></i>
                          <el-popover
                            placement="top"
                            width="160"
                            trigger="click"
                            v-model="sure2Deletevisible">
                            <p>确定删除这个问题吗？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini"
                                    type="text" @click="sure2Deletevisible = false">取消</el-button>
                                <el-button type="primary"
                                    size="mini" @click="deleteThisQS(item.qid)">确定</el-button>
                            </div>
                            <i slot="reference" class="el-icon-delete"></i>
                            </el-popover>
                      </div>
                    </div>
                    <div v-if="item.type !== 3">
                      <div
                        v-for="qs in item.options"
                        :key="qs.oid"
                      >
                        {{letter[qs.oid]}}. {{qs.desc}}
                      </div>
                    </div>
                  </el-card>
                  </div>
              </div>
            </div>
            <div class="page-foot">
              <el-divider></el-divider>
              <div class="submit-all-qs">
                <el-button @click="submitAllQS" type="warning" >发布问卷</el-button>
              </div>
            </div>
        </div>
        <!-- 问题添加 -->
        <el-dialog
            :title="'当前正在' + nowSay.title + nowCreateQsType + ' : '" :visible.sync="showCreateQs">
            <div class="qs-header">
                <p style="padding-bottom: 10px;">请输入问题：</p>
                <el-input
                    type="textarea"
                    resize="none"
                    v-model="question.qs"
                    maxlength="128"
                    clearable
                    rows="4"
                    show-word-limit
                    size="medium"
                    suffix-icon="el-icon-edit"></el-input>
            </div>
            <div class="one-or-more"
                v-if="nowCreateQsType !== '填空题'"
            >
                <div
                    v-for="(item, index) in OneOptions"
                    :key="index"
                >
                    <div class="qs-desc-item">
                        <div class="desc-item-order">
                            <span>
                                {{ letter[item.oid] }}  :
                            </span>
                            <i style="cursor: pointer"
                                @click="delThisOption(item.oid - 1)"
                                class="el-icon-delete"></i>
                        </div>
                        <div v-show="!item.show"
                            class="desc-item-desc" @click="item.show = !item.show">
                            {{ item.desc ==='' ? '双击我即可编辑...' : item.desc }}
                        </div>
                        <div class="input-qs-one">
                            <el-input
                                v-show="item.show"
                                size="mini"
                                @blur="item.show = !item.show"
                                @click="item.show = !item.show"
                                type="textarea"
                                resize="none"
                                v-model="item.desc" maxlength="128" show-word-limit></el-input>
                        </div>
                    </div>
                </div>
                <div class="add-qs-item">
                    <el-button type="primary"
                        icon="el-icon-plus" @click="addQSItem" circle></el-button>
                    <span>(添加选项)</span>
                </div>
            </div>
            <div
                v-else-if="nowCreateQsType === '多选题'"
                class="one-or-more"
            >
                duo
            </div>
            <div class="add-btn">
                <el-button size="medium" type="primary"
                    v-show="mode === 0"
                    @click="addQuestion">{{nowSay.button}}题目</el-button>
                <el-button size="medium" type="primary"
                    v-show="mode === 1"
                    @click="editThisQS">{{nowSay.button}}题目</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';

// default option
const options = [
  {
    oid: 1,
    desc: '',
    show: false,
  },
  {
    oid: 2,
    desc: '',
    show: false,
  },
  {
    oid: 3,
    desc: '',
    show: false,
  },
];
// 切换的话语
const switchWords = [
  {
    title: '创建',
    button: '添加',
  },
  {
    title: '编辑',
    button: '修改',
  },
];
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      sure2Deletevisible: false,
      //
      selectType: ['', '【单选题】', '【多选题】', ''],
      // 当前创建的题目类型
      nowCreateQsType: '',
      // doalog
      showCreateQs: false,
      // 创建问题时的问题
      question: {
        qs: '',
        ans: [],
      },
      // 选项数组
      OneOptions: options,
      // 选项最多支持11个--从1开始
      letter: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      // 问卷题目总列表
      sendQuestion: {
        title: '',
        desc: '',
        deadline: '',
        questions: [],
      },
      // 当前操作模式，创建或修改
      mode: 0,
      nowSay: switchWords[0],
      editQid: '',
    };
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
    }),
  },
  methods: {
    // 发布问卷
    submitAllQS() {
      // 如果问题不足一个不发布
      // 问卷信息未填,不发布
      if (this.sendQuestion.questions.length < 1) {
        this.$message({
          message: '你还没有添加问题嘞',
          type: 'warning',
        });
      } else if (this.sendQuestion.title === '' || this.desc === '' || this.sendQuestion.deadline === '') {
        this.$message({
          message: '你还未填写问卷信息!',
          type: 'warning',
        });
      } else {
        // 发布问卷
        console.log(this.teamInfo);
        this.$http.post(`/v1/teams/${this.teamInfo.id}/questionnaires`, this.sendQuestion).then(() => {
          this.$message({
            message: '问卷创建成功!',
            type: 'success',
          });
        }).catch((err) => {
          console.log(err);
          this.$message({
            message: '请从团队页进入创建问卷!',
            type: 'warning',
          });
        });
      }
    },
    editThisQS() {
      let Qtype = 3;
      if (this.nowCreateQsType === '单选题') {
        Qtype = 1;
      } else if (this.nowCreateQsType === '多选题') {
        Qtype = 2;
      }
      for (let i = 0; i < this.sendQuestion.questions.length; i += 1) {
        if (this.editQid === this.sendQuestion.questions[i].qid) {
          const optionsTemp = [];
          // 过滤show属性
          for (let k = 0; k < this.OneOptions.length; k += 1) {
            optionsTemp.push({
              oid: this.OneOptions[k].oid,
              desc: this.OneOptions[k].desc,
            });
          }
          this.sendQuestion.questions[i] = {
            qid: this.editQid,
            type: Qtype,
            desc: this.question.qs,
            options: optionsTemp,
          };
          this.$message({
            message: '修改成功！',
            type: 'success',
          });
          this.showCreateQs = false;
          break;
        }
      }
    },
    // 打开编辑的这个题目
    openEdit(qid, item) {
    // 不想再整一个dialog了--太麻烦也不值得
    // 所以选择再增加一些参数来利用创建问题的dialog
    // mode: 0/1 对应 创建/修改
    // 再整个默认的用来切换话语
      this.mode = 1;
      this.nowSay = switchWords[this.mode];
      this.showCreateQs = true;
      this.question.qs = item.desc;
      this.OneOptions = options;
      for (let i = 0; i < item.options.length; i += 1) {
        this.OneOptions[i].desc = item.options[i].desc;
      }
      if (item.type === 1) {
        this.nowCreateQsType = '单选题';
      } else if (item.type === 2) {
        this.nowCreateQsType = '多选题';
      } else {
        this.nowCreateQsType = '填空题';
      }
      this.editQid = qid;
    },
    // 删除这个题目
    deleteThisQS(qid) {
      const qsTemp = this.sendQuestion.questions;
      qsTemp.splice(qid - 1, 1);
      // 重新排序
      for (let i = 0; i < qsTemp.length; i += 1) {
        qsTemp[i].qid = i + 1;
      }
      this.sendQuestion.questions = qsTemp;
      this.$message({
        message: '删除成功！',
      });
    },
    // 增加一个问题到问卷
    // eslint-disable-next-line consistent-return
    addQuestion() {
      if (this.question.qs === '') {
        this.$message({
          message: '请确定问卷题已经填写！',
        });
        return false;
      }
      let Qtype = 1;
      if (this.nowCreateQsType === '多选题') {
        Qtype = 2;
      } else if (this.nowCreateQsType === '填空题') {
        Qtype = 3;
      }
      this.showCreateQs = false;
      if (Qtype !== 3) {
        // qid从1开始
        const optionsTemp = [];
        // 过滤show属性
        for (let i = 0; i < this.OneOptions.length; i += 1) {
          optionsTemp.push({
            oid: this.OneOptions[i].oid,
            desc: this.OneOptions[i].desc,
          });
        }
        const QS = {
          type: Qtype,
          desc: this.question.qs,
          qid: this.sendQuestion.questions.length + 1,
          options: optionsTemp,
        };
        this.sendQuestion.questions.push(QS);
        this.OneOptions = options;
      } else {
        this.sendQuestion.questions.push({
          type: 3,
          desc: this.question.qs,
          options: [],
          qid: this.sendQuestion.questions.length + 1,
        });
      }
      this.nowCreateQsType = '';
      this.question = {
        qs: '',
      };
      this.$message({
        message: '问题添加成功！',
      });
      console.log(this.sendQuestion);
    },
    // 删除单个选项
    delThisOption(oid) {
      const optionsTemp = this.OneOptions;
      optionsTemp.splice(oid, 1);
      for (let i = 0; i < optionsTemp.length; i += 1) {
        optionsTemp[i].oid = i + 1;
      }
      this.OneOptions = optionsTemp;
    },
    // 顺序增加一个选项
    addQSItem() {
    // 大概思路就是直接往题目数字加入
      const nowOrderLength = this.OneOptions.length;
      if (this.letter.length - 1 > nowOrderLength) {
        this.OneOptions.push({
          oid: nowOrderLength + 1,
          desc: '....',
          show: false,
        });
      } else {
        this.$message({
          message: `当前最多支持添加${nowOrderLength}项！`,
        });
      }
    },
    addNewQs(type) {
      // 修改mode，切换话语
      // 处理mode
      // 这里直接赋值会失败是因为拷贝的是地址，即引用，由于第一次已经拷贝过引用，所以再次拷贝引用不变
      //   this.OneOptions = options;
      for (let m = 0; m < 3; m += 1) {
        this.OneOptions[m].desc = '';
        this.OneOptions[m].show = false;
      }
      this.OneOptions = this.OneOptions.filter((item, index) => index < 3);
      this.mode = 0;
      this.nowSay = switchWords[this.mode];
      this.question.qs = '';
      this.showCreateQs = true;
      if (type === 1) {
        this.nowCreateQsType = '单选题';
      } else if (type === 2) {
        this.nowCreateQsType = '多选题';
      } else {
        this.nowCreateQsType = '填空题';
      }
    },
  },
};
</script>

<style scoped>

    .questionnaire {
        width: 95vw;
        margin: 0 auto;
    }

    .question-left {
        width: 20%;
        margin-top: 50px;
        position: fixed;
        top: 0;
    }

    .add-question-item {
        margin-top: 30px;
        padding: 20px;
        transition: all .3s ease-in-out;
        cursor: pointer;
    }

    .add-question-item:hover {
        background-color: #ddd;
    }

    .question-right {
        width: 70%;
        min-height: 80vh;
        margin-left: 23%;
        margin-top: 30px;
        padding: 10px;
        background-color: #fff;
    }

    .page-header {
        padding: 10px;
    }

    .qs-header {
        padding: 10px;
    }

    .add-btn {
        display: flex;
        justify-content: center;
    }

    .qs-desc-item {
        height: 110px;
        padding-left: 10px;
    }

    .desc-item-desc {
        padding: 10px;
        cursor: pointer;
        /* padding-top: 20px; */
    }

    .desc-item-order {
        width: 99%;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background-color: #eee;
    }

    .input-qs-one {
        padding: 8px;
    }

    .add-qs-item {
        padding-left: 10px;
        color: #aaa;
    }

    .add-qs-item span {
        padding-left: 10px;
    }

    .moreOpt-qs {
      float: right;
      padding: 3px 0;
    }

    .moreOpt-qs i {
      padding-left: 8px;
      cursor: pointer;
    }

    .submit-all-qs {
        display: flex;
        justify-content: center;
    }
</style>
