<template>
  <div>
    <nav>
      <div class="logo">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{teamInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>切换团队</el-dropdown-item>
             <el-dropdown-item
              v-for="team in teamList"
              :key="team.id"
             >
               {{ team.name }}
             </el-dropdown-item>
             <el-divider></el-divider>
            <el-dropdown-item
              command="create"
            >
              创建新团队
            </el-dropdown-item>
            <el-dropdown-item command='logout'>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <ul class="nav-menu">
        <li @click="switchPage('/team/library')">文库</li>
        <li @click="switchPage('/team/calendar')">日历</li>
        <li @click="switchPage('/team/member')">团队</li>
        <li @click="switchPage('/team/affair')">办公</li>
        <li @click="switchPage('/team/myself/todos')">自己</li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import Storage from '../storage/storage';

export default {
  computed: {
    ...mapState({
      createTeam: (state) => state.createTeam,
      teamList: (state) => state.teamList,
      teamInfo: (state) => state.teamInfo,
    }),
  },
  data() {
    return {
    };
  },
  methods: {
    handleCommand(e) {
      // 调整Boolean值 以便正常关闭窗口
      if (e === 'create') {
        this.createTeamChange({
          choose: true,
        });
      } else if (e === 'logout') {
        // 登出--先清除localstorage的数据，然后跳转页面
        // Storage.localRemove('token');
        // Storage.localRemove('refresh_token');
        // Storage.localRemove('userInfo');
        // Storage.localRemove('teamInfo');
        // 跳转
        this.$router.push({
          name: 'login',
        });
      }
    },
    switchPage(pagename) {
      this.$store.commit({
        type: 'changePage',
        name: pagename,
      });
    },
    ...mapMutations([
      'createTeamChange',
    ]),
  },
};
</script>

<style scoped>
  nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 5vw;
    height: 80px;

    background: whitesmoke;
  }

  .logo {
    font-size: 24px;
    font-weight: 600;
    color: black;
    flex: 1;
    justify-self: left;
  }

  .nav-menu {
    flex: 1;

    display: flex;
    justify-content: space-between;
    max-width: 550px;
  }

  .nav-menu li {
    color: black;
    cursor: pointer;
  }
</style>
