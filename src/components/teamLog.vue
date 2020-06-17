<template>
    <div class="team-log">
        <el-card>
            <div slot="header" style="margin-bottom: 20px">
                <h3 style="float: left">团队日志</h3>
                <el-button style="float: right; padding: 3px 0" type="text"
                icon="el-icon-refresh-right" @click="queryLog(1)"></el-button>
            </div>
            <div class="log-body">
                <vue-scroll
                    slot="refresh-start"
                    ref="body"
                >
                    <div class="log-item"
                      v-for="item in logs"
                      :key="item.datetime"
                    >
                        <div class="user">
                            <div class="avatar">
                                <el-avatar size="small" :src="item.info.avatar"></el-avatar>
                            </div>
                            <div class="name">
                                {{ item.info.name }}
                            </div>
                        </div>
                        <div class="log-do">
                            <p>{{ item.desc }}</p>
                        </div>
                        <div class="log-time">
                            <p>{{ item.datetime }}</p>
                        </div>
                    </div>
                </vue-scroll>
                <div class="pages">
                    <el-pagination
                        small
                        :page-count="total"
                        current-page.sync="nowPage"
                        @current-change="queryLog"
                        layout="prev, pager, next"
                    >
                    </el-pagination>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
    }),
  },
  data() {
    return {
      total: 0,
      nowPage: 1,
      logs: [],
    };
  },
  mounted() {
    this.queryLog(this.nowPage);
  },
  methods: {
    queryLog(qPage) {
      this.$http.get(`/v1/teams/${this.teamInfo.id}/logs`, {
        params: {
          page: qPage,
        },
      }).then((res) => {
        const before = this.logs[0];
        const temp = res.data.data.logs;
        for (let i = 0; i < temp.length; i += 1) {
          for (let j = 0; j < this.teamInfo.members.length; j += 1) {
            if (temp[i].uid === this.teamInfo.members[j].id) {
              temp[i].info = this.teamInfo.members[j];
              // 处理时间
              const t = temp[i].datetime.split('T');
              temp[i].datetime = `${t[0]}  ${t[1]}`;
              break;
            }
          }
        }
        this.logs = temp;
        this.total = res.data.data.pages;
        this.nowPage = qPage;
        // 如果第一条时间相同则无刷新，通知一下
        if (before !== undefined && before.datetime === this.logs[0].datetime) {
          this.$message({
            message: '暂时还没有新的日志哦~',
          });
        }
      });
    },
  },
};
</script>

<style scoped>
    .team-log {
    }

    .log-body {
        width: 100%;
        height: 68vh;
        margin: 0 auto;
        position: relative;
    }

    .user {
        display: flex;
        align-items: center;
    }

    .user .name {
        padding-left: 10px;
        color: #999;
    }

    .log-do {
        padding: 10px;
        word-break: break-all;
    }

    .pages {
        width: 100%;
        display: flex;
        justify-content: center;

        position: absolute;
        bottom: -20px;
    }

    .log-time {
        font-size: 12px;
        padding-left: 10px;
        padding-bottom: 10px;
    }
</style>
