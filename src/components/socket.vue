<template>
    <div class="socket-wrapper">
        <div class="chat">
            <vue-scroll
                slot="refresh-start"
                ref="body"
            >
            <div class="chat-body" id="chat_body">
                <div
                    v-for="(item, index) in CHAT.megBox"
                    :key="index"
                >
                  <div v-if="item.type===1"
                    :class="item.uid === userInfo.id ? 'chat-item chat-myself' : 'chat-item'"
                     class="chat-item"
                  >
                      <div class="item-avatar" :title="item.name">
                          <el-avatar size="small" :src="item.avatar"></el-avatar>
                      </div>
                      <div class="item-sayings">
                          <span>{{ item.meg }}</span>
                      </div>
                  </div>
                  <div v-else class="addIn-wrapper">
                    <div class="addIn">
                      <span>{{ item.name }}加入了房间....</span>
                    </div>
                  </div>
                </div>
            </div>
            </vue-scroll>
        </div>
        <div class="send">
            <div class="input">
                <el-input v-model="sendMeg"></el-input>
            </div>
            <div class="send-btn">
                <el-button @click="sendMeg2Team()" icon="el-icon-s-promotion" circle></el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
// import Storage from '../storage/storage';
import CHAT from '../socket/socket';

export default {
  watch: {
    needScroll() {
      this.scroll();
      console.log('in');
    },
  },
  mounted() {
    setTimeout(() => {
      this.scroll();
    }, 600);
  },
  data() {
    return {
      CHAT,
      sendMeg: '',
    };
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
      needScroll: (state) => state.needScroll,
    }),
  },
  methods: {
    sendMeg2Team() {
      if (this.sendMeg === '') {
        this.$message({
          message: '输入不能为空~',
        });
      } else {
        this.CHAT.send({
          meg: this.sendMeg,
          uid: this.userInfo.id,
          tid: this.teamInfo.id,
          avatar: this.userInfo.avatar,
          name: this.userInfo.name,
        });
        this.sendMeg = '';
      }
    },
    scroll() {
      this.$refs.body.scrollTo(
        {
          y: '200%',
        },
        1500,
      );
    },
  },
};
</script>>

<style scoped>
    .socket-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }

    .chat {
        height: calc(100% - 45px);
    }

    .send {
        width: 100%;
        height: 45px;
        position: absolute;
        bottom: 0;
    }

    .send .input {
        width: 89%;
        padding: 0 5px;
        float: left;
    }

    .send .send-btn {
        width: 10%;
        float: right;
    }

    .chat-body {
        overflow: hidden;
    }

    .chat-item {
        display: flex;
        float: left;
        min-width: 70%;
        max-width: 80%;
        padding: 12px;
    }

    .chat-myself {
        float: right;
        flex-direction: row-reverse;
    }

    .chat-item .item-sayings {
        padding: 6px;
        margin-left: 5px;
        margin-right: 5px;
        font-size: 14px;
        word-break: break-all;

        background-color: rgb(109,245,125);
        border-radius: 15px;
    }

    .addIn-wrapper {
      width: 100%;
    }

    .addIn {
      display: flex;
      justify-content: center;
      color: #bbb;
    }
</style>
