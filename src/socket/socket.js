import io from 'socket.io-client';
import store from '../store/index';

const CHAT = {
  megBox: [
  ],
  init(info) {
    this.socket = io.connect('http://47.107.32.138/chat');

    this.socket.emit('join', info);

    this.socket.on('enter', (res) => {
      console.log('enter');
      const meg = res;
      meg.type = 2;
      const { members } = store.state.teamInfo;
      for (let i = 0; i < members.length; i += 1) {
        if (members[i].id === meg.uid) {
          meg.name = members[i].name;
          this.megBox.push(meg);
          break;
        }
      }
    });

    this.socket.on('chat', (res) => {
      console.log('chat');
      console.log(res);
      const meg = res;
      meg.type = 1;
      this.megBox.push(meg);
      store.commit('changeNeedScroll');
    });
  },
  leave(info) {
    this.socket.emit('exit', info);
  },
  send(info) {
    this.socket.emit('chat', info);
  },
};
export default CHAT;
