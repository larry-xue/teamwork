<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import INIT from './init/init';

export default {
  mounted() {
    INIT.INIT();
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
