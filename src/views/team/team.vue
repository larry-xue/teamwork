<template>
  <div>
    <div class="nav">
      <teamNav></teamNav>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
    <el-dialog
      title="创建新团队" :visible="createTeam" @close="() => {this.createTeamChange({choose: false})}">
      <el-form :model="createInfo" :rules="rules" ref="createInfo">
        <el-form-item label="团队名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="createInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="团队简介" :label-width="formLabelWidth" prop="desc">
          <el-input
            type="textarea"
            resize="none"
            show-word-limit
            maxlength="50"
            v-model="createInfo.desc"
          ></el-input>
          </el-form-item>
        <el-form-item label="打卡时间" :label-width="formLabelWidth" prop="check">
          <el-time-select
            placeholder="起始时间"
            prop="check"
            v-model="createInfo.check_s"
            :picker-options="{
              start: '06:30',
              step: '00:15',
              end: '18:30'
            }">
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="createInfo.check_e"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '18:30',
              minTime: createInfo.check_s
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button
            class="input"
            type="info"
            size="medium"
            @click="onCreateTeam('createInfo')"
          >
            创建团队
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Storage from '../../storage/storage';
import CHAT from '../../socket/socket';
import teamNav from '../../components/nav.vue';

export default {
  components: {
    teamNav,
  },
  mounted() {
    this.CHAT.init({
      token: Storage.localGet('token'),
      tid: this.teamInfo.id,
    });
  },
  beforeDestroy() {
    this.CHAT.leave({
      uid: this.userInfo.id,
      tid: this.teamInfo.id,
      name: this.userInfo.name,
    });
  },
  data() {
    // eslint-disable-next-line no-unused-vars
    const validateTime = (rule, value, callback) => {
      const temp1 = this.createInfo.check_s.split(':');
      const temp2 = this.createInfo.check_e.split(':');
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
      CHAT,
      createInfo: {
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
      formLabelWidth: '120px',
      loading: true,
    };
  },
  computed: {
    ...mapState({
      page: (state) => state.switchPage,
      userInfo: (state) => state.userInfo,
      teamInfo: (state) => state.teamInfo,
      createTeam: (state) => state.createTeam,
      isRefresh: (state) => state.isRefresh,
    }),
  },
  methods: {
    ...mapMutations([
      'createTeamChange',
    ]),
    onCreateTeam(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.createInfo);
        if (valid) {
          this.$http.post('/v1/teams', this.createInfo).then((res) => {
            console.log(res);
            this.$store.commit('addTeamToList', {
              name: res.data.data.name,
              id: res.data.data.id,
            });
            this.$message({
              message: '新团队创建成功！，已添加至团队列表，可自行切换~',
              type: 'success',
            });
            this.createTeamChange({
              choose: false,
            });
          }).catch((err) => {
            console.log(err);
          });
        }
      });
    },
  },
  watch: {
    page(newVal) {
      console.log(newVal);
      this.$router.push({
        path: newVal,
      });
      console.log(this.$route.params);
    },
    isRefresh() {
      console.log('cjahe');
    },
  },
};
</script>

<style scoped>
  .nav {
    width: 99.9vw;
  }

  .body {
    width: 99vw;
    height: 80vh;
  }
</style>
