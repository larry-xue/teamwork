<template>
  <div id="app" v-loading.fullscreen.lock="loading">
    <router-view></router-view>
  </div>
</template>

<script>
import Storage from './storage/storage';

export default {
  mounted() {
    Storage.localSet('token', 'token');
    Storage.localSet('refresh_token', 're_token');
    // 发送验证token的请求
    // 如果token没有过期则加载页面
    if (Storage.localGet('token')) {
      this.$http.get('/user/login').then((res) => {
        console.log(res.config.headers);
        if (res.data.code === 1000 && Storage.localGet('refresh_token')) {
          // 更新token
          this.$http({
            url: '/user/login',
            method: 'get',
            headers: {
              Authorization: `${'bearer '}${Storage.localGet('refresh_token')}`,
            },
          }).then((response) => {
            console.log(response);
            Storage.localSet('token', response.data.data.access_token);
            Storage.localSet('refresh_token', response.data.data.refresh_token);
            this.$store.commit('changeRefresh');
            setTimeout(() => {
              this.loading = false;
            }, 1000);
          });
        } else {
          this.$store.commit('changeRefresh');
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      // 跳转到登录页
      this.$router.push({
        path: '/user/login',
      });
    }
  },
  data() {
    return {
      loading: true,
    };
  },
};
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'PingFang SC', 'Microsoft Yahei', sans-serif;
  }

  li {
    list-style: none;
  }

  body {
    background-color: rgb(225,224,228);
  }
</style>
