<template>
  <div class="myself">
    <div class="user-info">
      <div class="user-pic">
          <el-image
            fit="cover"
            src="https://pic2.zhimg.com/50/v2-ba20cb47fe601127f05fac1c72934d51_hd.jpg"
            :preview-src-list="['https://avatar-alioss.tower.im/0785345197ebc5c177ec?t=1589715857']">
          </el-image>
      </div>
      <div class="user-info-detail">
        <div class="user-name">Azoux</div>
        <div class="user-say">
          <el-link v-if="showSaying" href="#" type="primary">ddddd</el-link>
          <el-input v-else v-model="input" placeholder="edit"></el-input>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="user-nav">
      <el-menu
        :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
        @select="switch_user_nav">
        <el-menu-item index="1">任务</el-menu-item>
        <el-menu-item index="2">日程</el-menu-item>
        <el-menu-item index="3">
          <router-link to="/team/myself/settings">设置</router-link>
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
export default {
  data() {
    return {
      showSaying: true,
      activeIndex: '1',
    };
  },
  methods: {
    switch_user_nav(key) {
      switch (key) {
        case '1':
          console.log('test');
          break;
        case '2':
          console.log('daily');
          break;
        case '3':
          console.log('settings');
          break;
        case '4':
          console.log('collect');
          break;

        default:
          break;
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
    align-items: center;
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
</style>
