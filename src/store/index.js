import Vue from 'vue';
import Vuex from 'vuex';
import Storage from '../storage/storage';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginMethod: 'account',
    switchPage: '/teamwork/team/myself',
    // 用户信息
    userInfo: {
      username: '',
      avatar: '',
      id: '',
      teamList: [],
      name: '',
    },
    // 团队信息
    teamInfo: {
      id: '',
      desc: '',
      leader_id: '',
      members: [
        {
          id: 1,
          name: 'azoux',
          avatar: 'https://pic3.zhimg.com/v2-c073bf0fa922e7c131d070a79cb933dd_im.jpg',
        },
        {
          id: 2,
          name: 'azoux',
          avatar: 'https://pic3.zhimg.com/v2-c073bf0fa922e7c131d070a79cb933dd_im.jpg',
        },
        {
          id: 3,
          name: ' 阿三大苏打阿萨',
          avatar: 'https://pic3.zhimg.com/v2-c073bf0fa922e7c131d070a79cb933dd_im.jpg',
        },
        {
          id: 4,
          name: '完颜阿骨打',
          avatar: 'https://pic3.zhimg.com/v2-c073bf0fa922e7c131d070a79cb933dd_im.jpg',
        },
        {
          id: 5,
          name: 'azasdasdasdoux',
          avatar: '//i1.hdslb.com/bfs/face/33e1596178b102469c9e2daa0619179eb1223fb5.jpg@77w_78h_1c_100q.webp',
        },
        {
          id: 6,
          name: 'aasdasdasdzoux',
          avatar: 'https://pic3.zhimg.com/v2-c073bf0fa922e7c131d070a79cb933dd_im.jpg',
        },
        {
          id: 7,
          name: 'azoux',
          avatar: 'https://pic3.zhimg.com/v2-c073bf0fa922e7c131d070a79cb933dd_im.jpg',
        },

      ],
      inv_url: 'https://pic3.zhimg.com/v2-c073bf0fa922e7c131d070a79cb933dd_im.jpg',
      check_s: '',
      check_e: '',
    },
    createTeam: false,
    // 是否刷新token
    isRefresh: false,
  },
  mutations: {
    createTeamChange(state, payload) {
      state.createTeam = payload.choose;
      console.log('sadasd');
    },
    changePage(state, payload) {
      state.switchPage = payload.name;
    },
    changeRefresh(state) {
      state.isRefresh = true;
    },
    updateUserInfo(state, payload) {
      state.userInfo = payload;
      Storage.localSet('userInfo', state.userInfo);
      console.log(payload);
    },
    updateNowTeam(state, payload) {
      state.teamInfo = payload;
    },
    addTeamToList(state, payload) {
      state.teamList.push(payload);
    },
  },
  actions: {
  },
  modules: {
  },
});

export default store;
