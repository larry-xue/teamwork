<template>
  <div class="member">
    <div class="chatList">
      <div class="searchMember">
        <el-input
          v-model="searchMember" placeholder="搜索" @change="onSearch" clearable></el-input>
      </div>
      <vue-scroll
       slot="refresh-start"
       ref="body"
      >
        <div
          class="memberItem"
          v-for="item in  teamMember"
          :key="item.id"
        >
          <div class="cover">
            <el-avatar :src="item.avatar"></el-avatar>
            <span>{{ item.name }}</span>
          </div>
          <i class="el-icon-more"></i>
        </div>
      </vue-scroll>
    </div>
    <div class="member-wrapper">
      <div class="member-wrapper-some">
        <div class="onTime">
          onTime
        </div>
        <div class="question">
          question
        </div>
      </div>
      <div class="question-show">
        show
      </div>
    </div>
    <div class="team-some">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          一致性 Consistency<i class="header-icon el-icon-info"></i>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
      <el-collapse-item title="团队管理">
        <el-divider></el-divider>
        <el-button type="primary" @click="changeBoss">转让 | 邀请 | 移除</el-button>
        <el-button type="warning" @click="delTeam">删除团队</el-button>
        <el-divider></el-divider>
        <div class="invite">{{ userInfo.inv_url }}</div>
        <el-button type="primary" size="mini" @click="updateInvUrl">点击刷新</el-button>
      </el-collapse-item>
      <el-collapse-item title="团队信息修改">
        <el-form :model="changeTeamInfo" ref="changeTeamInfo" :rules="rules">
          <el-form-item label="团队名称" prop="name">
            <el-input v-model.trim="changeTeamInfo.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="团队简介" prop="desc">
            <el-input
              type="textarea"
              resize="none"
              show-word-limit
              maxlength="50"
              v-model="changeTeamInfo.desc"
            ></el-input>
            </el-form-item>
          <el-form-item label="打卡时间" prop="check">
            <el-time-select
              style="width: 100px;"
              placeholder="起始时间"
              prop="check"
              v-model="changeTeamInfo.check_s"
              :picker-options="{
                start: '06:30',
                step: '00:15',
                end: '18:30'
              }">
            </el-time-select>
            <el-time-select
              style="width: 100px;"
              placeholder="结束时间"
              v-model="changeTeamInfo.check_e"
              :picker-options="{
                start: '06:00',
                step: '00:15',
                end: '18:30',
                minTime: changeTeamInfo.check_s
              }">
            </el-time-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="input"
              type="info"
              size="medium"
              @click="onCreateTeam('changeTeamInfo')"
            >
              提交修改
            </el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    </div>
    <el-dialog
      width="30%"
      :visible.sync="seeTeamAction">
     <el-divider content-position="left">手动邀请</el-divider>
      <el-input
        v-model="inv_man_id" style="width: 200px" placeholder="请输入邀请人的账号"></el-input>
      <el-button type="primary" @click="inviteOnHand">邀请加入</el-button>
      <el-divider content-position="left">移除成员 | 转让职务</el-divider>
      <el-table
        ref="multipleTable"
        :data="teamInfo.members"
        tooltip-effect="dark"
         height="300"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="头像"
        >
      <template slot-scope="scope">
        <el-avatar :src="scope.row.avatar"></el-avatar>
      </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
      </el-table>
      <el-button
        style="margin-top: 30px;" @click="chnageBossToOteher" type="primary">转让职务</el-button>
      <el-button type="primary" @click="fireThisGuy">踢出团队</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  mounted() {
    console.log(this.teamInfo);
    this.teamMember = this.teamInfo.members;
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
    }),
  },
  data() {
    // eslint-disable-next-line no-unused-vars
    const validateTime = (rule, value, callback) => {
      const temp1 = this.changeTeamInfo.check_s.split(':');
      const temp2 = this.changeTeamInfo.check_e.split(':');
      const start = Number(temp1[0]) * 60 + Number(temp1[1]);
      const end = Number(temp2[0]) * 60 + Number(temp2[1]);

      // eslint-disable-next-line no-restricted-globals
      if (isNaN(start)) {
        callback(new Error('请选择起始时间'));
      // eslint-disable-next-line no-restricted-globals
      } else if (isNaN(end)) {
        callback(new Error('请选择结束时间'));
      } else if (start > end) {
        callback(new Error('起始时间不能晚于结束时间'));
      } else {
        callback();
      }
    };
    return {
      searchMember: '',
      teamMember: '',
      changeTeamInfo: {
        name: '',
        desc: '',
        check_s: '',
        check_e: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入团队名',
            trigger: 'change',
          },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 10 个字符之间',
            trigger: 'blur',
          },
        ],
        desc: [
          {
            required: true,
            message: '请输入团队简介',
            trigger: 'change',
          },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符之间',
            trigger: 'blur',
          },
        ],
        check: [
          {
            validator: validateTime,
            trigger: 'change',
          },
        ],
      },
      seeTeamAction: false,
      inv_man_id: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      multipleSelection: [],
    };
  },
  methods: {
    onSearch() {
      console.log(this.$store.state.teamInfo);
    },
    onCreateTeam(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.patch('/v1/teams', this.changeTeamInfo).then((res) => {
            console.log(res);
            this.$store.commit('addTeamToList', {
              name: res.data.data.name,
              id: res.data.data.id,
            });
          }).catch((err) => {
            console.log(err);
          });
        }
      });
    },
    // eslint-disable-next-line consistent-return
    changeBoss() {
      this.seeTeamAction = true;
      if (this.$store.state.userInfo.id === this.$store.state.teamInfo.leader_id) {
        // 打开列表
      } else {
        this.$message({
          message: '你不是管理员，无法操作',
          type: 'warning',
        });
        return false;
      }
    },
    // eslint-disable-next-line consistent-return
    updateInvUrl() {
      if (this.userInfo.id === this.teamInfo.leader_id) {
        this.$http.put('/v1/teams/join', {
          inv: this.teamInfo.inv_url,
        }).then((res) => {
          this.$store.commit('updateNowTeam', res.data.data);
        });
      } else {
        this.$message({
          message: '你不是管理员，无法操作',
          type: 'warning',
        });
        return false;
      }
    },
    // eslint-disable-next-line consistent-return
    delTeam() {
      if (this.userInfo.id === this.teamInfo.leader_id) {
        this.$http.put(`/v1/teams/${this.userInfo.id}`, {
          inv: this.teamInfo.inv_url,
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: '团队已经删除成功了',
            });
          }
        });
      } else {
        this.$message({
          message: '你不是管理员，无法操作',
          type: 'warning',
        });
        return false;
      }
    },
    inviteOnHand() {
      if (this.inv_man_id !== '') {
        this.$http.post(`/v1/teams/${this.userInfo.id}`, {
          uid: this.inv_man_id,
          action: 1,
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'warning',
              message: '邀请成功',
            });
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '邀请失败',
          });
        });
      } else {
        this.$message({
          type: 'warning',
          message: '请输入你要邀请的人',
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // eslint-disable-next-line consistent-return
    chnageBossToOteher() {
      // eslint-disable-next-line max-len
      if (this.userInfo.id === this.teamInfo.members.leader_id || this.multipleSelection.length !== 1) { return false; }
      this.$http.post(`/v1/teams/${this.userInfo.id}`, {
        uid: this.inv_man_id,
        action: 3,
      }).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'warning',
            message: '转移职务成功',
          });
        }
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '转移职务失败',
        });
      });
    },
    // eslint-disable-next-line consistent-return
    fireThisGuy() {
      // eslint-disable-next-line max-len
      if (this.userInfo.id === this.teamInfo.members.leader_id || this.multipleSelection.length !== 1) { return false; }
      this.$http.post(`/v1/teams/${this.multipleSelection[0].id}`, {
        uid: this.inv_man_id,
        action: 2,
      }).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'warning',
            message: '踢出成功',
          });
        }
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '踢出失败',
        });
      });
    },
  },
};
</script>

<style scoped>
  .member {
    width: 98%;
    height: 700px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
  }

  .memberItem {
    position: relative;
    width: 80%;
    height: 70px;
    margin: 0 auto;
    margin-top: 20px;
    padding: 10px;
    background-color: #fff;
    justify-content: space-around;
    align-items: center;
    transition: .3s ease;
  }

  .memberItem .cover {
    display: flex;
    align-items: center;
    width: 80%;
    overflow: hidden;
  }

  .cover .el-avatar--circle {
    flex-shrink: 0;
  }

  .cover span {
    margin-left: 5px;
  }

  .memberItem:hover {
    background-color: rgb(232,237,250);
  }


  .memberItem i {
    position: absolute;
    right: 10px;
    top: 40%;
    cursor: pointer;
  }

  .searchMember {
    width: 80%;
    margin: 0 auto;
  }


  .chatList {
    width: 15%;
  }

  .member-wrapper {
    width: 65%;
    height: 100%;
    background-color: slateblue;
  }

  .member-wrapper-some {
    float: left;
    width: 40%;
    height: 90%;
    margin-top: 5%;
    margin-left: 5%;
    background-color: silver;
  }

  .question-show {
    float: left;
    width: 44%;
    height: 90%;
    margin-top: 5%;
    margin-left: 5%;
    background-color: springgreen;
  }

  .team-some {
    width: 20%;
    height: 100%;
    padding: 10px;
    background-color: snow;
  }
</style>
