<template>
    <div class="show-chart">
        <el-card>
          <h2 slot=header>{{ nowQSForChart.info.title }}</h2>
          <p style="padding: 20px; color:#777">简介：{{ nowQSForChart.info.desc }}</p>
          <p style="padding: 20px; color: 6d7">当前问卷填写人数： {{ nowQSForChart.ans.length }}</p>
        </el-card>
        <div class="chart-item"
          v-for="(item, index) in chartData.ans"
          :key="index"
        >
            <el-card shadow="hover"
                :chart_data="item"
                style="position: relative"
                v-if="item[item.length - 1].type !== 3"
            >
            <div slot="header">
                {{ item[item.length - 1].qid }}.
                {{ item[item.length - 1].desc }} {{selectType[item[item.length - 1].type]}}</div>
            <div style="width: 373px; height: 354px;"
             :ldata="item"
             :qid="item[item.length - 1].qid"
             :id="`chart${item[item.length - 1].qid}`" class="chart"></div>
             <div class="showQS">
                 <div
                    class="qs-item"
                    v-for="qs in item[item.length - 1].options"
                    :key="qs.oid"
                >
                    {{letter[qs.oid]}}. {{qs.desc}}</div>
             </div>
        </el-card>
        <el-card
          v-else
        >
            <div slot="header">
                {{ item[item.length - 1].qid }}.
                {{ item[item.length - 1].desc }} {{selectType[item[item.length - 1].type]}}</div>
          <div
            v-for="(qs, index) in item"
            :key="index"
            class="sayings"
          >
            {{ qs }}
          </div>
        </el-card>
        </div>
        <div class="excel">
          <el-button @click="createExcel">导出为excel</el-button>
          <el-button @click="backTo">返回</el-button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import echarts from 'echarts';

export default {
  components: {
  },
  computed: {
    ...mapState({
      nowQSForChart: (state) => state.nowQSForChart,
    }),
  },
  mounted() {
    // 插入题目
    // 先处理data的形式
    const qsLength = this.nowQSForChart.qs.length;
    for (let i = 0; i < qsLength; i += 1) {
      const option = this.nowQSForChart.qs[i].options.length;
      const data = [];
      for (let m = 0; m < option; m += 1) {
        data.push({
          value: 0,
          name: this.letter[m + 1],
        });
      }

      this.chartData.ans.push(data);
      this.chartData.ans[i].push(this.nowQSForChart.qs[i]);
    }
    // 答案分配
    for (let k = 0; k < this.nowQSForChart.ans.length; k += 1) {
      // 遍历所有用户 k是用户
      const { answers } = this.nowQSForChart.ans[k];
      // answers 为一个用户的所有答案
      for (let m = 0; m < answers.length; m += 1) {
        // 遍历该用户所有答案
        // 根据类型来判断
        if (answers[m].type === 1) {
          // 单选题
          //  this.nowQSForChart.ans[k] ->第k题
          //               第m题进入对应题号数组(******这一步很关键*****)
          this.chartData.ans[answers[m].qid - 1][answers[m].ans - 1].value += 1;
          //   console.log(k, m);
        } else if (answers[m].type === 2) {
          for (let j = 0; j < answers[m].ans.length; j += 1) {
            this.chartData.ans[answers[m].qid - 1][answers[m].ans[j] - 1].value += 1;
          }
        } else {
          this.chartData.ans[answers[m].qid - 1].unshift(answers[m].ans);
        }
      }
    }
    setTimeout(() => {
      const charts = document.getElementsByClassName('chart');
      for (let i = 0; i < charts.length; i += 1) {
      // charts[i].ready(() => {
      //   console.log('wwww');
      // });
        // console.log(charts[i].getAttribute('id'));
        this.drawLine(charts[i]);
      }
    }, 1000);
  },
  data() {
    return {
      selectType: ['', '【单选题】', '【多选题】', '【简答题】'],
      otherData: [],
      showData: [],
      qs: {},
      letter: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      chartData: {
        ans: [],
        // data存储每个选项选择的人数 { value: 123, name: 'asd', }
      },
    };
  },
  methods: {
    backTo() {
      this.$router.push({
        name: 'member',
      });
    },
    init() {
    },
    drawLine(chart) {
    // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(chart);
      // 绘制图表
      //   const Ldata =
      const qid = Number(chart.getAttribute('qid'));
      console.log(qid);
      let showData;
      const otherData = [];
      for (let i = 0; i < this.chartData.ans.length; i += 1) {
        const answers = this.chartData.ans[i];
        // console.log(answers[answers.length - 1].qid);
        if (answers[answers.length - 1].qid === qid) {
          showData = answers;
          const temp = answers;
          showData = temp;
          console.log(showData);
          for (let k = 0; k < showData.length; k += 1) {
            otherData.push(showData[k].name);
          }
          break;
        }
      }
      myChart.setOption({
        title: {
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
            },
            saveAsImage: { show: true },
          },
        },
        // 在这里输入选项A，B，...不可输入具体内容，具体内容自行在下方陈列（使用el-cop...）
        legend: {
          orient: 'vertical',
          left: 'left',
          data: otherData,
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '75%',
            center: ['50%', '60%'],
            data: showData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
        grid: {
          containLabel: true,
        },
      });
    },
    createExcel() {
      // CSV格式可以自己设定，适用MySQL导入或者excel打开。
      // 由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值”

      let str = '用户,问题,答案,提交时间,\n';
      // console.log(this.nowQSForChart.qs);
      // console.log(this.nowQSForChart.ans);
      for (let i = 0; i < this.nowQSForChart.qs.length; i += 1) {
        const qs = this.nowQSForChart.qs[i];
        for (let k = 0; k < this.nowQSForChart.ans.length; k += 1) {
          const item = this.nowQSForChart.ans[k];
          if (qs.type === 1) {
            // console.log(qs.options[item.answers[qs.qid - 1].ans - 1].desc);
            str += `${item.username},${qs.qid}.${qs.desc},${qs.options[item.answers[qs.qid - 1].ans - 1].desc},${item.datetime},\n`;
          } else if (qs.type === 2) {
            // ans
            let ans = '';
            for (let m = 0; m < item.answers[qs.qid - 1].ans.length; m += 1) {
              ans = `${ans}${qs.options[item.answers[qs.qid - 1].ans[m] - 1].desc}${m !== item.length - 1 ? ' | ' : ''}`;
            }
            str += `${item.username},${qs.qid}.${qs.desc},${ans},${item.datetime},\n`;
          } else {
            str += `${item.username},${qs.qid}.${qs.desc},${item.answers[[qs.qid - 1]].ans},${item.datetime},\n`;
          }
        }
      }
      // console.log(str);
      let blob = new Blob([str], { type: 'text/plain;charset=utf-8' });
      // 解决中文乱码问题
      blob = new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${this.nowQSForChart.info.title}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
    .show-chart {
        width: 65vw;
        margin: 0 auto;
    }

    .showQS {
        position: absolute;
        left: 500px;
        top: 100px;
    }

    .sayings {
        padding: 5px;
        margin-top: 5px;
        color: #aaa;
        background-color: antiquewhite;
    }

    .qs-item {
        padding: 5px;
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        color:steelblue;
    }

    .sayings:last-child {
        display: none;
    }

    .excel {
      display: flex;
      padding: 30px;
      justify-content: space-around;
    }
</style>
