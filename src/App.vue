<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    // 发送验证token的请求
    // 如果token没有过期则加载页面
  },
  data() {
    return {
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
