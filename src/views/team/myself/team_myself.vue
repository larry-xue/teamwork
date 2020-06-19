<template>
  <div class="myself">
    <div class="user-info">
      <div class="user-pic">
          <el-image
            fit="cover"
            :src="userInfo.avatar"
          >
          </el-image>
      </div>
      <div class="user-info-detail">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-say">
          <p style="padding: 5px;color:#999;font-size: 13px">id:{{userInfo.id}}</p>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="user-nav">
      <el-menu
        :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
        >
        <el-menu-item index="1" @click="toSon(1)">
          任务
        </el-menu-item>
        <el-menu-item disabled index="2">
        日程
        </el-menu-item>
        <el-menu-item index="3" @click="toSon(3)">
          设置
        </el-menu-item>
        <el-menu-item index="4" disabled>收藏</el-menu-item>
      </el-menu>
    </div>
    <el-divider></el-divider>
    <div class="user-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    toSon(e) {
      if (e === 1) {
        this.$router.push({
          name: 'todo',
        });
      } else if (e === 3) {
        this.$router.push({
          name: 'settings',
        });
      }
    },
  },
};
</script>

<style scoped>
  .myself {
    max-width: 972px;
    margin: 20px auto;
    padding: 2vw 5vw;

    background-color: whitesmoke;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .user-pic {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;

    display: flex;
    justify-content: center;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .user-info-detail {
    padding-left: 2vw;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .user-nav ul {
    display: flex;
    justify-content: space-around;
  }

  .user-nav ul li {
    width: 20%;
    padding: 0.5vw;

    text-align: center;
    cursor: pointer;

    transition: .27s ease-in-out;
  }

  .user-nav ul li:hover {
    background-color: #fff;
  }

  .user-name {
    font-size: 21px;
  }
</style>
