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
      username: 'username',
      avatar: '',
      id: '',
      name: 'name',
    },
    teamList: [],
    nowTeam: '',
    // 团队信息
    teamInfo: {
      id: '',
      desc: 'desc',
      name: 'teamname',
      leader_id: '',
      isNormalLogin: false,
      members: [

      ],
      inv_url: '',
      check_s: '',
      check_e: '',
    },
    createTeam: false,
    // 是否刷新token
    isRefresh: false,
    // 是否打开下发任务框
    isSendTask: false,
    // 本人是否已经打卡&团队打卡人数
    isSign: false,
    // 当前打卡总数
    presentSign: 0,
    // 当前被查看任务成员的id
    nowQueryId: '',
    // 接收任务的成员
    nowReceiveUser: {},
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
      console.log('now userInfo');
      console.log(payload);
    },
    updateNowTeam(state, payload) {
      state.teamInfo = payload;
      // 处理一下邀请码
      const invUrl = state.teamInfo.inv_url.split('=');
      // eslint-disable-next-line prefer-destructuring
      state.teamInfo.inv_url = invUrl[1];
      console.log(invUrl);
      console.log('now teamInfo');
      console.log(payload);
    },
    addTeamToList(state, payload) {
      state.teamList.push(payload);
    },
    changeNormalLogin(state) {
      state.isNormalLogin = false;
    },
    pushTeam2List(state, payload) {
      // 用于添加团队进入；列表，便于后续切换
      state.teamList.push(payload);
      console.log(state.teamList);
    },
    changeSendtask(state) {
      state.isSendTask = !state.isSendTask;
    },
    changeSignStatus(state, payload) {
      state.isSign = payload.sign;
    },
    changePresentSign(state, payload) {
      state.presentSign = payload.present;
      console.log(state.presentSign);
    },
    changeNowQueryId(state, payload) {
      state.nowQueryId = payload.id;
    },
    changeNowReceiveUser(state, payload) {
      state.nowReceiveUser = payload;
    },
  },
  actions: {
  },
  modules: {
  },
});

export default store;
