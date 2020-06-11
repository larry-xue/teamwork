<template>
  <div class="affair">
    <div class="chatList">
      <div class="searchMember">
        <el-input
          v-model="searchMember" placeholder="搜索" @change="onSearch" clearable></el-input>
      </div>
      <vue-scroll
       slot="refresh-start"
       ref="body"
      >
      <memberItem
        v-for="item in teamInfo.members"
        :key="item.id"
        :item="item"
      ></memberItem>
      </vue-scroll>
    </div>
    <div class="memberTodoList">
      123
    </div>
    <!-- 下达任务的表单 -->
    <el-dialog
    title="下发任务："
      @close="closeSendTask"
      :visible="isSendTask">
      <el-form :model="sendTask" :rules="rules" ref="sendTask">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="sendTask.title"></el-input>
        </el-form-item>
        <el-form-item label="任务详情：" prop="desc">
          <el-input
            show-word-limit
            maxlength="50"
            resize="none"
            type="textarea"
            v-model="sendTask.desc"></el-input>
        </el-form-item>
        <el-form-item label="截至日期：">
          <el-date-picker
            v-model="sendTask.deadline"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
          >
          </el-date-picker>
          <span style="color: #bbb;margin-left: 10px">( 默认时间为当天晚上12点 )</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendTask2Guy('sendTask')">下发任务</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import memberItem from '../../../components/memberItem.vue';

export default {
  mounted() {
    const d = new Date();
    // 补0
    const day = (d.getDate()) < 9 ? `0${d.getDate() + 1}` : d.getDate() + 1;
    const month = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
    this.sendTask.deadline = `${d.getFullYear()}-${month}-${day}T00:00:00`;
    console.log(this.sendTask.deadline);
  },
  components: {
    memberItem,
  },
  data() {
    return {
      searchMember: '',
      sendTask: {
        title: '',
        desc: '',
        deadline: '',
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'change',
          },
          {
            username: 'asd',
            answers: [
              {
                type: 1,
                ans: 'A',
              },
              {
                type: 2,
                ans: 'asdadwd',
              },
            ],
          },
          {
            max: 50,
            min: 3,
            message: '内容长度在3-30之间',
            trigger: 'blur',
          },
        ],
        desc: [
          {
            required: true,
            message: '请输入任务内容',
            trigger: 'change',
          },
          {
            max: 50,
            min: 3,
            message: '内容长度在3-50之间',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
      isSendTask: (state) => state.isSendTask,
    }),
  },
  methods: {
    onSearch() {
      console.log(this.$store.state.teamInfo);
    },
    closeSendTask() {
      this.$store.commit('changeSendtask');
    },
    sendTask2Guy(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendTask.assignee = this.userInfo.id;
          console.log(this.sendTask);
          this.$http.post(`/v1/teams/${this.teamInfo.id}/tasks`, this.sendTask).then((res) => {
            console.log(res.data);
          });
        }
      });
    },
  },
};
</script>

<style scoped>

  .affair  {
    width: 100%;
    height: 800px;
    margin-top: 50px;
    overflow: hidden;
  }

  .chatList {
    width: 15%;
    float: left;
  }

  .searchMember {
    width: 80%;
    margin: 0 auto;
  }

  .memberTodoList {
    width: 60%;
    height: 100%;
    background-color: #fff;
    float: left;
  }

</style>
