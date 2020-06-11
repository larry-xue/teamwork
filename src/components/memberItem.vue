<template>
  <div>
    <div
      class="memberItem"
    >
      <div class="cover">
        <el-avatar :src="item.avatar"></el-avatar>
        <span>{{ item.name }}</span>
      </div>
      <el-popover
        placement="right"
        width="80"
        :visible.sync="outerVisible"
      >
        <div class="optItem" @click="semdWordToMan">
          下发任务
        </div>
        <div class="optItem">
          他的任务
        </div>
        <i class="el-icon-more" slot="reference"></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: [
    'item',
  ],
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      teamInfo: (state) => state.teamInfo,
      isSendTask: (state) => state.isSendTask,
    }),
  },
  data() {
    return {
      outerVisible: false,
    };
  },
  methods: {
    semdWordToMan() {
      if (this.userInfo.id === this.teamInfo.leader_id) {
        // 打开任务框
        this.$store.commit('changeSendtask');
        console.log(this.$props.item);
      } else {
        this.$message({
          type: 'error',
          message: '你不是队长，无权操作',
        });
      }
    },
  },
};
</script>

<style scoped>

  .memberItem {
    position: relative;
    width: 80%;
    height: 70px;
    margin: 0 auto;
    margin-top: 20px;
    padding: 10px;
    background-color: #fff;
    justify-content: space-around;
    align-items: center;
    transition: .3s ease;
  }

  .memberItem .cover {
    display: flex;
    align-items: center;
    width: 80%;
    overflow: hidden;
  }

  .memberItem:hover {
    background-color: rgb(232,237,250);
  }


  .memberItem i {
    position: absolute;
    right: 10px;
    top: 40%;
    cursor: pointer;
  }

  .optItem {
    height: 30px;
    transition: ease-in-out .3s;
    line-height: 30px;
    cursor: pointer;
    text-align: center;
    padding-bottom: 10px;
  }

  .optItem:hover {
    background-color: #eee;
  }
</style>
