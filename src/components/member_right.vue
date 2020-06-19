// member页，右边栏
<template>
  <div>
    <div style="height: 80vh; padding: 5px; padding-bottom: 20px">
      <vue-scroll
        slot="refresh-start"
        ref="body"
      >
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            打卡情况查询<i class="header-icon el-icon-info"></i>
          </template>
          <el-date-picker
            v-model="queryAttendancesDate"
            align="right"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button
            style="margin-top: 10px"
            type="primary" size="mini" @click="queryAttendancesDetail">查询具体打卡情况</el-button>
          <el-divider></el-divider>
          <el-card>
            <div slot="header">
              {{ showAttendancesDate }} 打卡情况：
            </div>
            <div class="attendances-item"
              v-for="item in showAttendancesMember"
              :key="item.id"
            >
              <div>{{ item.name }}</div>
              <div v-if="item.punctual">已打卡</div>
              <div v-else style="color: #bbb">未打卡</div>
            </div>
          </el-card>
        </el-collapse-item>
        <el-collapse-item title="团队信息">
          <el-card class="box-card">
            <div>
              团队名称：{{ teamInfo.name }}
            </div>
            <div>
              团队简介：{{ teamInfo.desc }}
            </div>
          </el-card>
        </el-collapse-item>
        <el-collapse-item title="团队管理">
          <el-divider></el-divider>
          <el-button type="primary" @click="changeBoss" size="mini">转让 | 邀请 | 移除</el-button>
          <el-button type="warning" @click="delTeam" size="mini">删除团队</el-button>
          <el-divider></el-divider>
          <div class="invite">邀请码：{{ teamInfo.inv_url }}</div>
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
                placeholder="团队简介至少大于3个字符"
                maxlength="50"
                v-model="changeTeamInfo.desc"
              ></el-input>
              </el-form-item>
            <el-form-item label="打卡时间" prop="check">
              <br />
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
              <br />
              <el-time-select
                style="width: 100px;"
                placeholder="结束时间"
                v-model="changeTeamInfo.check_e"
                :picker-options="{
                  start: '06:30',
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
                @click="onUpdateTeam('changeTeamInfo')"
              >
                提交修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      </vue-scroll>
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
import Storage from '../storage/storage';

export default {
  mounted() {
    const d = new Date();
    this.queryAttendancesDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
    }),
  },
  data() {
    return {
      changeTeamInfo: {
        name: '',
        desc: '',
        check_s: '',
        check_e: '',
      },
      rules: {
        name: [
          {
            required: false,
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
            required: false,
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
            trigger: 'change',
          },
        ],
      },
      seeTeamAction: false,
      inv_man_id: '',
      multipleSelection: [],
      //
      queryAttendancesDate: '',
      showAttendancesDate: '',
      showAttendancesMember: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  methods: {
    queryAttendancesDetail() {
      if (this.queryAttendancesDate) {
        const send = {
          date: this.queryAttendancesDate,
        };
        if (this.userInfo.id === this.teamInfo.leader_id) {
          send.spec = true;
        } else {
          send.self = true;
        }
        // 请求具体打卡信息
        this.$http.get(`/v1/teams/${this.teamInfo.id}/attendances`, {
          params: send,
        }).then((res) => {
          console.log(res);
          this.showAttendancesDate = this.queryAttendancesDate;
          const resData = res.data.data;
          // 处理返回的结果---由于后台只记录了当日打卡了的人的，并没有记录没有打卡的
          // 并且团队成员的加入时间也没有记录，所以在显示过往打卡记录时，晚加入的成员都没有打卡，这是一个比较明显的失误
          const resultArr = [];
          for (let i = 0; i < this.teamInfo.members.length; i += 1) {
            // 直接两遍循环过滤了，量不是很大
            // 最终希望拿到的数组是每项为{ id， name，打卡情况 }
            resultArr.push({
              id: this.teamInfo.members[i].id,
              name: this.teamInfo.members[i].name,
              punctual: false,
            });
            for (let k = 0; k < resData.length; k += 1) {
              if (this.teamInfo.members[i].id === resData[k].uid) {
                resultArr[resultArr.length - 1].punctual = true;
                resData.splice(k, 1);
                break;
              }
            }
          }
          this.showAttendancesMember = resultArr;
          console.log(resultArr);
        }).catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          });
        });
        console.log(send);
      } else {
        this.$message({
          message: '请选择打卡日期',
        });
      }
    },
    // eslint-disable-next-line consistent-return
    onUpdateTeam(formName) {
      // eslint-disable-next-line consistent-return
      if (this.teamInfo.leader_id !== this.userInfo.id) {
        this.$message({
          message: '你不是管理员！无法修改',
          type: 'warning',
        });
        return false;
      }
      // eslint-disable-next-line consistent-return
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const sendInfo = {};
          if (this.changeTeamInfo.name.trim() !== '') {
            sendInfo.name = this.changeTeamInfo.name.trim();
          }
          if (this.changeTeamInfo.desc.trim() !== '' && this.changeTeamInfo.desc.trim().length > 3) {
            sendInfo.desc = this.changeTeamInfo.desc.trim();
          }
          if (this.changeTeamInfo.check_s && this.changeTeamInfo.check_e) {
            sendInfo.check_s = this.changeTeamInfo.check_s;
            sendInfo.check_e = this.changeTeamInfo.check_e;
          }
          if (sendInfo === {}) {
            return false;
          }
          console.log(sendInfo);
          this.$http.patch(`/v1/teams/${this.teamInfo.id}`, sendInfo).then((res) => {
            console.log(res);
            this.$message({
              type: 'info',
              message: '团队信息修改成功!',
            });
            // 请求最新团队信息
            this.$http.get(`/v1/teams/${this.teamInfo.id}`).then((response) => {
              this.$store.commit('updateNowTeam', response.data.data);
              Storage.localSet('teamInfo', response.data.data);
              this.$store.commit('addTeamToList', {
                name: response.data.data.name,
                id: response.data.data.id,
              });
            });
          }).catch((err) => {
            console.log(err);
          });
        }
      });
    },
    // eslint-disable-next-line consistent-return
    chnageBossToOteher() {
      // eslint-disable-next-line max-len
      if (this.userInfo.id === this.teamInfo.members.leader_id || this.multipleSelection.length !== 1) { return false; }
      this.$http.post(`/v1/teams/${this.teamInfo.id}`, {
        uid: Number(this.multipleSelection[0].id),
        action: 3,
      }).then((res) => {
        console.log(res);
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // eslint-disable-next-line consistent-return
    fireThisGuy() {
      // eslint-disable-next-line max-len
      if (this.userInfo.id === this.teamInfo.members.leader_id || this.multipleSelection.length !== 1) { return false; }
      this.$http.post(`/v1/teams/${this.multipleSelection[0].id}`, {
        uid: Number(this.inv_man_id),
        action: 2,
      }).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.$message({
            type: 'warning',
            message: '踢出成功',
          });
        }
      }).catch((err) => {
        this.$message({
          type: 'warning',
          message: err,
        });
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
          console.log(res);
          this.$store.commit('updateNowTeam', res.data.data);
          Storage.localSet('teamInfo', res.data.data);
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
        this.$http.delete(`/v1/teams/${this.teamInfo.id}`, {
          inv: this.teamInfo.inv_url,
        }).then((res) => {
          console.log(res);
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
        this.$http.post(`/v1/teams/${this.teamInfo.id}`, {
          uid: Number(this.inv_man_id),
          action: 1,
        }).then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
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
  },
};
</script>

<style scoped>
  .attendances-item {
    display: flex;
    justify-content: space-between;
  }
</style>
