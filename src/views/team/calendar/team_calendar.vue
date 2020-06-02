<template>
  <div class="calendar">
    <div class="calendar-left">
      <el-calendar v-model="nowDate">
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <h3
            :class="data.isSelected ? 'is-selected' : ''"
          >
            {{ data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? '✔️' : ''}}
          </h3>
          <div class="addnew">
            123
          </div>
            <ul class="daily">
              <!-- <vue-scroll
                slot="refresh-start"
                ref="body"
              >
                <li>1</li>
              </vue-scroll> -->
            </ul>
        </template>
      </el-calendar>
    </div>
    <div class="calendar-right">
      <h2>日程</h2>
      <div class="todoMore">
      </div>
      <div class="todos">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-button style="float: right" size="mini" type="danger">删除</el-button>
        <div style="margin: 25px 0;"></div>
        <vue-scroll
          slot="refresh-start"
          ref="body"
          style="
            margin-top: 10px;
            margin-left: 20px;
            "
        >
          <el-checkbox-group
            v-model="checkedtodos"
            @change="handleCheckedtodosChange"
          >
            <el-checkbox
              v-for="(todo, index) in todos"
              class="todoItem"
              :class="todo.class"
              :key="index"
              :label="todo"
            >
              <el-popover
                placement="top-start"
                width="215"
                trigger="hover"
              >
                <div class="todoOpt">
                  <el-button type="warning" size="mini">编辑</el-button>
                  <el-button type="danger"  size="mini">删除</el-button>
                  <el-button type="success"  size="mini">复制</el-button>
                </div>
                 <el-link
                  :underline="false"
                  type="primary"
                  slot="reference"
                >
                  {{ todo.content }}
                </el-link>
              </el-popover>
            </el-checkbox>
          </el-checkbox-group>
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
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  methods: {
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
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      formLabelWidth: '120px',
      nowDate: new Date(),
      checkAll: false,
      checkedtodos: [
        {
          importance: 1,
          content: 'aasasdasdsd',
          class: 'red',
          id: '1',
        },
        {
          importance: 1,
          content: 'aasdasdasdd',
          id: '2',
        },
      ],
      todos: [
        {
          importance: 1,
          content: 'aasasdaasd天不生我李淳刚，万古剑道如长夜sdsd',
          class: 'red',
          id: '3',
        },
        {
          importance: 1,
          content: 'aasdasdasdd',
          class: 'blue',
          id: '4',
        },
        {
          importance: 1,
          content: 'as飒飒大苏打撒旦d',
          class: 'green',
          id: '5',
        },
        {
          importance: 1,
          content: 'as飒飒大苏打撒旦d',
          class: 'green',
        },

      ],
      isIndeterminate: true,
    };
  },
};
</script>

<style scoped>
  .todoItem {
    max-width: 80%;
    display: block;
    padding: 10px;
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
    /* importance 1 */
    background-color: salmon;
  }

  .blue {
    /* importance 2 */
    background-color: blue;
  }

  .green {
    /* importance 3 */
    background-color: greenyellow;
  }

  .calendar {
    width: 100%;

    margin-top: 50px;
    display: flex;
  }

  .calendar .calendar-left {
    width: 83%;
    margin-left: 1%;
  }

  .calendar .calendar-right {
    width: 15%;
    padding: 10px;
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

</style>
