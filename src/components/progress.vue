// 这是用于显示签到的组件
<template>
  <div class="progress">
    <el-progress type="circle" :percentage="hadSign" :width="250"></el-progress>
    <div class="time">{{teamInfo.check_s}} -- {{teamInfo.check_e}}</div>
    <div class="sign">
      <el-button
      size="medium" type="success" @click="signIn" circle icon="el-icon-check"></el-button>
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
      isSign: (state) => state.isSign,
      presentSign: (state) => state.presentSign,
    }),
    hadSign() {
      console.log(this.presentSign);
      if (this.presentSign === 0) {
        return 0;
      }
      return (this.presentSign / this.teamInfo.members.length) * 100;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    signIn() {
      if (this.isSign) {
        this.$message({
          type: 'info',
          message: '你今天已经打过卡啦',
        });
      } else {
        this.$http.post(`/v1/teams/${this.teamInfo.id}/attendances`).then((res) => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '打卡成功!',
          });
          this.$store.commit('changeSignStatus', {
            sign: true,
          });
          console.log('asd');
          this.$store.commit('changePresentSign', {
            present: this.presentSign + 1,
          });
        });
      }
    },
  },
};
</script>

<style scoped>
  .progress {
    max-width: 250px;
    margin: 0 auto;
  }

  .progress .sign {
    width: 30px;
    margin: 0 auto;
  }

  .progress .time {
    margin: 0 auto;
    padding: 14px;
    text-align: center;
  }
</style>
