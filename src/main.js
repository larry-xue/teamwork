import Vue from 'vue';
import ElementUI from 'element-ui';
import './theme/index.css';
import axios from 'axios';
import vuescroll from 'vuescroll';
import router from './router';
import store from './store';
import Storage from './storage/storage';
import App from './App.vue';

Vue.config.productionTip = true;

Vue.use(ElementUI);

Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://47.107.32.138';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'form-data';
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use((config) => {
  let token = Storage.localGet('token');
  const axiosConfig = config;
  if (token) {
    token = `${'Bearer '}${token}`;
    axiosConfig.headers.Authorization = token;
  }
  return axiosConfig;
}, (err) => {
  console.log(err);
});


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

Vue.use(vuescroll, {
  ops: {
    vuescroll: {
      mode: 'native',
      sizeStrategy: 'percent',
      detectResize: true,
    },
    scrollPanel: {
      scrollingY: true,
      scrollingX: false,
      speed: 200,
      easing: 'easeInOutQuart',
      verticalNativeBarPos: 'right',
      maxHeight: undefined,
      maxWidth: undefined,
    },
    rail: {
      background: '#01a99a',
      opacity: 0,
      size: '6px',
      gutterOfSide: '2px',
    },
    bar: {
      showDelay: 500,
      onlyShowBarOnScroll: true,
      keepShow: false,
      background: '#c1c1c1',
      opacity: 1,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: false,
      size: '6px',
      disable: false,
    },
  }, // 在这里设置全局默认配置
  name: 'vue-scroll', // 在这里自定义组件名字，默认是vueScroll
});
