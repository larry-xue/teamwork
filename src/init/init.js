// 本文件用于在初始进入页面时引用
/*
  流程：
    1. 如果没有token则自动跳回登录页
    2. 如果有的话
      （1）先请求用户信息
      （2）再请求团队信息，默认是第一个团队，
      （3）之后再循环调用请求其他团队信息，存入teamList

    3. 关于何时初始化的问题
        增加一个bool参数，标定是否已经调用过
*/
import axios from 'axios';
import store from '../store/index';
// import router
// import router from './router';
import Storage from '../storage/storage';

let isInit = false;
// 返回登录页
function back2Login() {
  // this.$router.push({
  //   path: '/user/login',
  // });
}

// 处理一下打卡时间
// function formatTime(t) {
//   // eslint-disable-next-line radix
//   let hour = String(parseInt(t / 3600));
//   let min = String((t / 60) % 60);
//   if (hour.length < 2) {
//     hour = `0${hour}`;
//   }
//   if (min.length < 2) {
//     min = `0${min}`;
//   }
//   return `${hour}:${min}`;
// }

// 请求本人打卡&团队详情状态
function isSign(teamId) {
  // 先请求团队的
  const d = new Date();
  axios.get(`/v1/teams/${teamId}/attendances`, {
    params: {
      date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
    },
  }).then((signRes) => {
    store.commit('changePresentSign', {
      present: signRes.data.data.present,
    });
  }).catch((err) => {
    console.log(err);
  });
  // 个人
  axios.get(`/v1/teams/${teamId}/attendances`, {
    params: {
      date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      self: true,
    },
  }).then((res) => {
    store.commit('changeSignStatus', {
      sign: res.data.data.punctual,
    });
  });
}

function queryTeamInfo(teamId) {
  axios.get(`/v1/teams/${teamId[0]}`).then((response) => {
    store.commit('updateNowTeam', response.data.data);
    // 将信息push进teamList
    const teamInfo = response.data.data;
    isSign(teamInfo.id);
    // teamInfo.start = formatTime(teamInfo.check_s);
    // teamInfo.end = formatTime(teamInfo.check_e);
    store.commit('pushTeam2List', teamInfo);
    store.state.nowTeam = response.data.data.name;
  }).catch((errTeam) => {
    console.log(errTeam);
  });
  // 然后去请求其他团队的信息
  for (let i = 1; i <= teamId.length - 1; i += 1) {
    axios.get(`/v1/teams/${teamId[i]}`).then((response) => {
      const teamInfo = response.data.data;
      // teamInfo.start = formatTime(teamInfo.check_s);
      // teamInfo.end = formatTime(teamInfo.check_e);
      store.commit('pushTeam2List', teamInfo);
    });
  }
}

// eslint-disable-next-line consistent-return
function init() {
  if (isInit) {
    return false;
  }
  if (Storage.localGet('token') === null) {
    // 返回登录页
    back2Login();
  } else {
  // axios.get('https://www.fastmock.site/mock/df920649f50c9cd2392aa7389a2504d3/teamwork/v1/users').then((res) => {
    axios.get('/v1/users').then((res) => {
      store.commit('updateUserInfo', res.data.data);
      // 初始化群组信息
      console.log(res);
      isInit = true;
      // axios.get('https://www.fastmock.site/mock/df920649f50c9cd2392aa7389a2504d3/teamwork/v1/teams').then((response) => {
      queryTeamInfo(res.data.data.team_id);
    }).catch((err) => {
      console.log(err.response.statusText);
      // token过期
      if (err.response.statusText === 'FORBIDDEN') {
        // token过期
        // 如果存有refresh_token
        if (Storage.localGet('refresh_token') !== null) {
          Storage.localRemove('token');
          console.log('in');
          axios.get('/v1/users/token').then((res) => {
            isInit = true;
            console.log(res);
            Storage.localSet('token', res.data.data.access_token);
            Storage.localSet('refresh_token', res.data.data.refresh_token);
            // token更新完刷新页面
            window.location.reload();
          }).catch((error) => {
            console.log(error);
          });
        } else {
          back2Login();
        }
      }
    });
  }
}

export default init;
