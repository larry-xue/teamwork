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
              <div
                @click="switchTeam(team)"
              >
               {{ team.name }}
              </div>
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
      <div class="user-nav">
        <el-menu
        background-color="whitesmoke"
        class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" @click="switchPage('/team/library')">
          文库
        </el-menu-item>
        <el-menu-item index="2" @click="switchPage('/team/calendar')">
          日历
        </el-menu-item>
        <el-menu-item index="3" @click="switchPage('/team/member')">
          团队
        </el-menu-item>
        <el-menu-item index="4" @click="switchPage('/team/affair')">
          办公
        </el-menu-item>
        <el-menu-item index="5" @click="switchPage('/team/myself/todos')">
          团队
        </el-menu-item>
      </el-menu>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Storage from '../storage/storage';

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
      activeIndex: '1',
    };
  },
  methods: {
    highLigntNowPage() {

    },
    // eslint-disable-next-line consistent-return
    switchTeam(team) {
      console.log(team.id);
      if (team.id === this.teamInfo.id) {
        this.$message({
          message: '无需切换，当前团队即是所选择的',
        });
        return false;
      }
      // 切换团队
      this.$http.get(`/v1/teams/${team.id}`).then((response) => {
        this.$store.commit('updateNowTeam', response.data.data);
        // 更新本地数据
        Storage.localSet('teamInfo', response.data.data);
        this.$message({
          message: '正在切换团队中......',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
    },
    handleCommand(e) {
      // 调整Boolean值 以便正常关闭窗口
      if (e === 'create') {
        this.createTeamChange({
          choose: true,
        });
      } else if (e === 'logout') {
        this.$confirm('登出后将清除本地文档, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
        // 登出--先清除localstorage的数据，然后跳转页面
          localStorage.clear();
          // 跳转
          this.$router.push({
            name: 'login',
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登出',
          });
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


  .user-nav ul {
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .user-nav ul li {
    width: 20%;
    padding: 0.5vw;

    text-align: center;
    cursor: pointer;

    transition: .27s ease-in-out;
  }
</style>
