<template>
  <div class="member">
    <div class="member-wrapper">
      <div class="member-wrapper-some">
        <div class="onTime">
          <process></process>
        </div>
        <div class="question">
          question
        </div>
      </div>
      <div class="question-show">
        show
      </div>
    </div>
    <div class="team-some">
      <memberRight></memberRight>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '../../../components/progress.vue';
import memberRight from '../../../components/member_right.vue';

export default {
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
      isSendTask: (state) => state.isSendTask,
    }),
  },
  data() {
    return {

    };
  },
  methods: {

  },
  components: {
    memberRight,
    process,
  },
};
</script>

<style scoped>
  .member {
    width: 98%;
    height: 900px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
  }


  .member-wrapper {
    width: 85%;
    height: 100%;
    background-color: #fff;
  }

  .member-wrapper-some {
    float: left;
    width: 40%;
    height: 90%;
    margin-top: 2%;
    margin-left: 5%;
  }

  .question-show {
    float: left;
    width: 44%;
    height: 90%;
    margin-top: 5%;
    margin-left: 5%;
    background-color: springgreen;
  }

  .team-some {
    width: 20%;
    height: 100%;
    padding: 10px;
    margin-left: 1.5%;
    background-color: #fff;
  }

  .onTime {
    width: 100%;
    height: 60%;
  }
</style>
