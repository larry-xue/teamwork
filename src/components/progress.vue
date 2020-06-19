// 这是用于显示签到的组件
<template>
  <div class="progress">
    <div class="progress-wrapper">
      <el-progress type="circle" :percentage="hadSign" :width="250"></el-progress>
      <div class="time">{{teamInfo.check_s}} -- {{teamInfo.check_e}}</div>
    </div>
    <div class="process-other">
      <div class="pic" @click="signIn">
        <!-- @click="signIn" -->
        <span >点我签到唷~~</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
      presentSign: (state) => state.presentSign,
    }),
    hadSign() {
      if (this.presentSign === 0) {
        return 0;
      }
      console.log(Number(((this.presentSign / this.teamInfo.members.length) * 100).toFixed(2)));
      return Number(((this.presentSign / this.teamInfo.members.length) * 100).toFixed(2));
    },
  },
  data() {
    return {
    };
  },
  methods: {
    signIn() {
      const d = new Date();
      const nowDay = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      // 先判断是否已经打卡
      this.$http.get(`/v1/teams/${this.teamInfo.id}/attendances`, {
        params: {
          date: nowDay,
          self: true,
        },
      }).then((res) => {
        if (res.data.data.punctual) {
          this.$message({
            message: '你今天已经打过卡了!',
          });
        }
        if (JSON.stringify(res.data.data) === '{}') {
          // 今天还未打卡
          console.log(this.teamInfo.check_s, this.teamInfo.check_e);
          // 判断时间
          let start = this.teamInfo.check_s.split(':');
          start = Number(start[0]) * 3600 + Number(start[1] * 60) + Number(start[2]);
          let end = this.teamInfo.check_e.split(':');
          end = Number(end[0]) * 3600 + Number(end[1] * 60) + Number(end[2]);
          const now = d.getMinutes() * 60 + d.getHours() * 3600 + d.getSeconds() * 60;
          if (start <= now && now <= end) {
            // 顺利打卡
            this.$http.post(`/v1/teams/${this.teamInfo.id}/attendances`).then((response) => {
              console.log(response);
              this.$message({
                type: 'success',
                message: '打卡成功!',
              });
              this.$store.commit('changePresentSign', {
                present: this.presentSign + 1,
              });
            });
          } else {
            this.$message({
              type: 'warning',
              message: '当前不是打卡时间!',
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
  .progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .progress .time {
    padding: 14px;
    text-align: center;
  }

  .process-other {
    padding-right: 30px;
    align-self: flex-start;
  }

  .pic {
    width: 20vh;
    height: 20vh;
    position: relative;
    margin-top: 40%;
    background-image: url('../assets/caomei.jpg');
    background-size: 100%;
    color: #aaa;
    cursor: pointer;
  }

  .pic span {
    position: absolute;
    bottom: -20px;
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
  }
</style>
