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
    // 当前打开的markdown文档id
    nowMDId: '',
    // 当前打开的md文档
    nowOpenMDText: '',
    // markdown文档列表
    mdList: [],
    // 当前打开的富文本文档id
    nowWordId: '',
    // 当前打开的富文本
    nowOpenWordText: '',
    // 富文本文档列表
    wordList: [],
    // 去提交任务
    gotoSubmitTask: {},
  },
  mutations: {
    createTeamChange(state, payload) {
      state.createTeam = payload.choose;
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
      // 由于不是用url识别团队的...所以就默认每次都将数组的第一个作为当前团队
      // 如果当前团队更新了的话...就shift unshift
      // 或者说切换团队了的话
      state.teamList.shift();
      state.teamList.unshift(payload);
    },
    changeNormalLogin(state) {
      state.isNormalLogin = false;
    },
    pushTeam2List(state, payload) {
      // 用于添加团队进入；列表，便于后续切换
      state.teamList.push(payload);
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
    changeNowMDId(state, payload) {
      state.nowMDId = payload.id;
    },
    changemdList(state, payload) {
      state.mdList = payload;
    },
    changeNowWordId(state, payload) {
      state.nowWordId = payload.id;
    },
    changeWordList(state, payload) {
      state.wordList = payload;
    },
    changeSubmitTask(state, payload) {
      state.gotoSubmitTask = payload;
    },
    changeNowOpenMDText(state, payload) {
      state.nowOpenMDText = payload.text;
      state.nowMDId = '';
    },
    changeNowOpenWordText(state, payload) {
      state.nowOpenWordText = payload.text;
      state.nowWordId = '';
    },
  },
  actions: {
  },
  modules: {
  },
});

export default store;
