<template>
  <div class="calendar">
    <div class="calendar-left" v-loading="loading">
      <el-calendar v-model="nowDate" v-if="showCalendar">
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <div class="day-container" :day="data.day">
            {{ data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? '✔️' : ''}}
            <div class="daily-month"
              v-if="Number(data.day.split('-')[1]) === curentMonth"
            >
              <div class="daily-day"
                v-if="schedules[Number(data.day.split('-')[2])] !== undefined"
              >
              <vue-scroll
                slot="refresh-start"
                ref="body"
              >
                <div class="show-daily"
                  v-for="item in schedules[Number(data.day.split('-')[2])]"
                  :key="item.index"
                >
                <i class="el-icon-s-flag"
                  :style="item.color"
                ></i>
                {{ item.desc }}
                </div>
              </vue-scroll>
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
    <div class="calendar-right"  v-loading="loadingLeft">
      <h2>日程</h2>
      <div class="todoMore">
      </div>
      <div class="todos">
        <div style="margin: 25px 0;"></div>
        <vue-scroll
          slot="refresh-start"
          ref="body"
          style="
            margin-top: 10px;
            margin-left: 20px;
            "
        >
          <el-card shadow="always">
            <div v-for="item in todos"
              class="text item"
              :class="item.class"
              :key="item.id">
              <el-popover
                placement="top-start"
                width="215"
                trigger="hover"
              >
                <div class="todoOpt">
                  <el-button type="warning" size="mini" @click="openEditTodo(item)">编辑</el-button>
                  <el-button type="danger"  size="mini" @click="delTodoItem(item)">删除</el-button>
                  <el-button type="success"  size="mini"
                    @click="copy($event, item.desc)">复制</el-button>
                </div>
                 <el-link
                  :underline="false"
                  type="primary"
                  slot="reference"
                >
                  {{ item.desc }}
                </el-link>
              </el-popover>
              </div>
            </el-card>
        </vue-scroll>
    </div>
      <div div class="addNewTodo">
        <el-button
          type="warning"
          size="medium"
          icon="el-icon-edit"
          @click="dialogFormVisible = true"
        >添加日程</el-button>
      </div>
    </div>
    <el-dialog title="添加日程" :visible.sync="dialogFormVisible"
    >
      <el-form :model="addTodo" :rules="rules" ref="addTodo">
        <el-form-item label="日程内容：" prop="desc">
          <el-input
          show-word-limit
          maxlength="32"
          resize="none"
          type="textarea"
          v-model="addTodo.desc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日程重要性：" prop="urgency">
          <el-radio-group v-model="addTodo.urgency">
            <el-radio label="3"  text-color="FA8072">非常重要</el-radio>
            <el-radio label="2"  text-color="#FFD700">很重要</el-radio>
            <el-radio label="1"  text-color="#F0FFF0">一般</el-radio>
          </el-radio-group>
          </el-form-item>
        <el-form-item label="开始时间：" prop="time" >
          <el-date-picker
            v-model="addTodo.time"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            class="input"
            type="info"
            size="medium"
            @click="submitTodo('addTodo')"
          >
            添加日程
          </el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title="编辑日程"
               :visible.sync="dialogVisibleEdit"
               >
      <el-form :model="editTodo" :rules="rules" ref="editTodo">
        <el-form-item label="日程内容：" prop="desc">
          <el-input
          show-word-limit
          maxlength="50"
          resize="none"
          type="textarea"
          v-model="editTodo.desc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日程重要性：" prop="urgency">
          <el-radio-group v-model="editTodo.urgency">
            <el-radio label="3"  text-color="FA8072">非常重要</el-radio>
            <el-radio label="2"  text-color="#FFD700">很重要</el-radio>
            <el-radio label="1"  text-color="#F0FFF0">一般</el-radio>
          </el-radio-group>
          </el-form-item>
        <el-form-item label="开始时间：" prop="time" >
          <el-date-picker
            v-model="editTodo.time"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            class="input"
            type="info"
            size="medium"
            @click="editTodoItem('editTodo')"
          >
            提交修改
          </el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Clipboard from 'clipboard';

export default {
  watch: {
    nowDate(newVal) {
      const day = new Date(newVal);
      console.log(day.getMonth() + 1, day.getFullYear());
      this.curentYear = day.getFullYear();
      this.curentMonth = day.getMonth() + 1;
      this.updateTodos();
    },
    curentMonth() {
      this.updateCalendar();
    },
  },
  mounted() {
    this.updateCalendar();
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    updateTodos() {
      // 更新右边栏的todo项目
      const day = new Date(this.nowDate);
      if (this.schedules[day.getDate()] !== undefined) {
        this.todos = this.schedules[day.getDate()];
        for (let i = 0; i < this.todos.length; i += 1) {
          if (this.todos[i].urgency === 1) {
            this.todos[i].class = 'green';
          } else if (this.todos[i].urgency === 2) {
            this.todos[i].class = 'yellow';
          } else if (this.todos[i].urgency === 3) {
            this.todos[i].class = 'red';
          }
        }
      } else {
        this.todos = [];
      }
    },
    // eslint-disable-next-line consistent-return
    editTodoItem(formName) {
      if (this.userInfo.id !== this.teamInfo.leader_id) {
        this.$message({
          type: 'warning',
          message: '你不是管理员，无法操作',
        });
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.patch(`/v1/schedules/${this.editTodo.id}`, {
            desc: this.editTodo.desc,
            start: this.editTodo.time[0],
            end: this.editTodo.time[1],
            urgency: Number(this.editTodo.urgency),
          }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'info',
                message: '日程编辑成功！~正在重新加载日程····',
              });
              this.dialogVisibleEdit = false;
              this.updateCalendar();
            }
          }).catch((err) => {
            this.$message({
              type: 'warning',
              message: err,
            });
          });
        }
      });
    },
    openEditTodo(item) {
      if (this.userInfo.id !== this.teamInfo.leader_id) {
        this.$message({
          type: 'warning',
          message: '你不是管理员，无法操作',
        });
      } else {
        this.dialogVisibleEdit = true;
        this.editTodo = {
          desc: item.desc,
          time: [
            item.start,
            item.end,
          ],
          id: item.id,
          urgency: String(item.urgency),
        };
      }
    },
    copy(ee, content) {
      console.log(ee);
      const clipboard = new Clipboard(ee.target, { text: () => content });
      clipboard.on('success', () => {
        this.$notify({ type: 'success', message: '复制成功', duration: 2000 });
        clipboard.destroy(); // 释放内存
      });
      clipboard.on('error', () => {
        this.$notify({ type: 'waning', message: '该浏览器不支持自动复制', duration: 2000 });
        clipboard.destroy();
      });
      clipboard.onClick(ee); // 事件绑定
    },
    delTodoItem(item) {
      if (this.teamInfo.leader_id !== this.userInfo.id) {
        this.$message({
          type: 'warning',
          message: '你不是管理员，无法操作',
        });
      } else {
        console.log(item);
        this.$http.delete(`/v1/schedules/${item.id}`).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'info',
              message: '删除成功··正在重新加载····',
            });
          }
          this.updateCalendar();
        }).catch((err) => {
          this.$message({
            type: 'warning',
            message: err,
          });
        });
      }
    },
    // eslint-disable-next-line consistent-return
    submitTodo(formName) {
      if (this.userInfo.id !== this.teamInfo.leader_id) {
        this.$message({
          type: 'warning',
          message: '你不是管理员，无法操作',
        });
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(`/v1/teams/${this.teamInfo.id}/schedules`, {
            desc: this.addTodo.desc,
            start: this.addTodo.time[0],
            end: this.addTodo.time[1],
            urgency: Number(this.addTodo.urgency),
          }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'info',
                message: '日程添加成功！',
              });
              this.addTodo = {
                desc: '',
                urgency: '1',
                time: '',
              };
              this.dialogFormVisible = false;
              this.updateCalendar();
            }
          }).catch((err) => {
            this.$message({
              type: 'warning',
              message: err,
            });
          });
        }
      });
    },
    updateCalendar() {
      // 请求当月日程
      this.schedules = {};
      this.showCalendar = false;
      this.loading = true;
      this.loadingLeft = true;
      // this.$http.get('https://www.fastmock.site/mock/df920649f50c9cd2392aa7389a2504d3/teamwork/teams/schedules', {
      this.$http.get(`/v1/teams/${this.teamInfo.id}/schedules`, {
        params: {
          year: this.curentYear,
          month: this.curentMonth,
        },
      }).then((res) => {
        console.log('日程：');
        console.log(res);
        // 处理一下日程---按日期存储

        // color是用来给flag上色的
        const color = [0, 'color: green;', 'color: yellow', 'color: red'];
        const todos = res.data.data;
        // const day = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        // for (let i = 1; i <= day; i += 1) {
        // if (todos[i].)
        // }
        for (let k = 0; k < todos.length; k += 1) {
        // 处理时间
          let start = todos[k].start.split('-');
          let end = todos[k].end.split('-');

          // 判断该事件发起时间相对于当前时间
          // 首先后台得来的数据里是当月的事件也就是说肯定是时间上小于等于当前月份的日程
          // 因此只需要判断年份是否相等 不相等则直接设为1 若相等再判断月份是否相等....
          if (Number(start[0]) === this.curentYear) {
            if (Number(start[1]) === this.curentMonth) {
              start = Number(start[2]);
            } else {
              start = 1;
            }
          } else {
            start = 1;
          }
          // 同样地..判断结束时间是否为最后一天
          if (Number(end[0]) === this.curentYear) {
            if (Number(end[1]) === this.curentMonth) {
              end = Number(end[2]);
            } else {
            // 当前月份的天数
              end = new Date(this.curentYear, this.curentMonth, 0).getDate();
            }
          } else {
            end = new Date(this.curentYear, this.curentMonth, 0).getDate();
          }

          // console.log(todos[k].urgency);
          todos[k].color = color[todos[k].urgency];
          for (let i = start; i <= end; i += 1) {
            if (this.schedules[i]) {
              this.schedules[i].push(todos[k]);
            } else {
              this.schedules[i] = [];
              this.schedules[i].push(todos[k]);
            }
          }
        }
        this.showCalendar = true;
        this.loading = false;
        this.updateTodos();
        this.loadingLeft = false;
      });
    },
    handleCheckAllChange(val) {
      this.checkedtodos = val ? this.todos : [];
      this.isIndeterminate = false;
    },
    handleCheckedtodosChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.todos.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.todos.length;
    },
  },
  data() {
    return {
      curentMonth: new Date().getMonth() + 1,
      curentYear: new Date().getFullYear(),
      dialogFormVisible: false,
      dialogVisibleEdit: false,
      showCalendar: false,
      loading: true,
      loadingLeft: true,
      addTodo: {
        desc: '',
        urgency: '1',
        time: '',
      },
      editTodo: {
        desc: '',
        urgency: '',
        time: '',
      },
      rules: {
        desc: [
          {
            required: true,
            message: '请输入日程内容',
            trigger: 'change',
          },
          {
            max: 50,
            min: 3,
            message: '内容长度在3-50之间',
            trigger: 'blur',
          },
        ],
        time: [
          {
            required: true,
            message: '请选择时间',
          },
        ],
        urgency: [
          {
            required: true,
            message: '请选择重要程度~',
            trigger: 'change',
          },
        ],
      },
      nowDate: new Date(),
      // 当前选择月份的待办事项
      schedules: {

      },
      todos: [

      ],
      isIndeterminate: true,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          },
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          },
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          },
        }],
      },
    };
  },
};
</script>

<style scoped>
  .todoItem {
    max-width: 80%;
    display: block;
    margin-top: 10px;
    color: white;
    word-break: break-all;
  }

  .todoOpt {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

.el-checkbox, .el-checkbox__input {
  white-space: normal;
  word-break: break-all;
}

  .red {
    /* urgency 3 */
    background-color: #FA8072;
  }

  .yellow {
    /* urgency 2 */
    background-color: #FFD700;
  }

  .green {
    /* urgency 1 */
    background-color: #F0FFF0;
  }

  .calendar {
    width: 100%;

    margin-top: 20px;
    display: flex;
  }

  .calendar .calendar-left {
    width: 83%;
    height: 662px;
    background-color: white;
    margin-left: 1%;
  }

  .calendar .calendar-right {
    width: 15%;
    padding-top: 20px;
    padding-right: 40px;
    background-color: #eee;
  }

  .calendar-right h2 {
    text-align: center;
  }

  .calendar-right .todos {
    height: 400px;
  }

  .addNewTodo {
    padding-top: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .day-container {
  }

  .el-calendar-day {
    padding: 0;
  }

  .show-daily {
  }

  .daily-day {
    font-size: 12px;
    height: 50px;
  }

  .text {
    padding: 5px;
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
</style>
