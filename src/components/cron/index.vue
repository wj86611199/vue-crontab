<template>
  <div class="tab-container">
    <el-tabs type="border-card">
      <el-tab-pane label="秒">
        <cron-time
          :data="cronList[0]"
          type="seconds"
          ref="seconds"
          @changeVal="changeVal"
          @setCorrectVal="setCorrectVal"
        ></cron-time>
      </el-tab-pane>
      <el-tab-pane label="分">
        <cron-time :data="cronList[1]" type="minutes" ref="minutes" @changeVal="changeVal"></cron-time>
      </el-tab-pane>
      <el-tab-pane label="时">
        <cron-time :data="cronList[2]" type="hours" ref="hours" @changeVal="changeVal"></cron-time>
      </el-tab-pane>
      <el-tab-pane label="日">
        <cron-date :data="cronList[3]" @changeDate="changeDate" ref="date"></cron-date>
      </el-tab-pane>
      <el-tab-pane label="月">
        <cron-time :data="cronList[4]" type="month" ref="month" @changeVal="changeVal"></cron-time>
      </el-tab-pane>
      <el-tab-pane label="周">
        <cron-week :data="cronList[5]" ref="week" @changeWeek="changeWeek"></cron-week>
      </el-tab-pane>
      <el-tab-pane label="年">
        <cron-year :data="cronList[6]" ref="year" @changeYear="changeYear"></cron-year>
      </el-tab-pane>
    </el-tabs>
    <div class="cron-show">{{cronStr}}</div>
    <div class="footer">
      <el-button type="normal" size="mini" @click="reset">取消</el-button>
      <el-button type="primary" size="mini" @click="$emit('sure',cronStr)">确定</el-button>
    </div>
  </div>
</template>

<script>
import cronDate from "./date";
import cronTime from "./time";
import cronWeek from "./week";
import cronYear from "./year";
export default {
  name: "vue-crontab",
  props: {
    data: {
      type: String,
      default: "* * */10 */2 * ? *"
    }
  },
  data() {
    return {
      cronStr: "",
      cronList: [],
      cronMapping: {
        seconds: 0,
        minutes: 1,
        hours: 2,
        date: 3,
        month: 4,
        week: 5,
        year: 6
      }
    };
  },
  created() {
    this.cronStr = this.data;
    this.cronList = this.cronStr.split(" ");
  },
  components: {
    cronTime,
    cronDate,
    cronWeek,
    cronYear
  },
  methods: {
    setCorrectVal(val) {
      let index = this.cronMapping[val.type];
      this.$set(this.cronList, index, val.value);
      this.cronStr = this.cronList.join(" ");
    },
    reset() {
      this.cronStr = this.data;
      this.cronList = this.data.split(" ");
      this.$nextTick(() => {
        this.$refs.seconds.setType();
        this.$refs.minutes.setType();
        this.$refs.hours.setType();
        this.$refs.date.setType();
        this.$refs.month.setType();
        this.$refs.week.setType();
        this.$refs.year.setType();
        this.$emit("cancel");
      });
    },
    changeYear(val) {
      this.changeVal(val);
    },
    changeWeek(val) {
      this.$set(this.cronList, 3, "?");
      this.$refs.date.radio = null;
      this.changeVal(val);
    },
    changeDate(val) {
      this.$set(this.cronList, 5, "?");
      this.$refs.week.radio = null;
      this.changeVal(val);
    },
    changeVal(val) {
      let getIndex = this.cronMapping[val.type];
      this.$set(this.cronList, getIndex, val.value === "" ? "*" : val.value);
      this.cronStr = this.cronList.join(" ");
    }
  }
};
</script>

<style scoped>
.cron-show {
  padding: 10px;
}
.footer {
  width: 100%;
  text-align: right;
}
</style>
