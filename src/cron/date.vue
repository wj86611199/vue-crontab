<template>
  <div class="tabBody">
    <el-row class="event-row">
      <el-radio v-model="radio" label="1" @change="change">每一日</el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="5" @change.native.stop="change">
        <span class="first">本月最后一天</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="7" @change.native.stop="change">
        <span class="first">本月最后一个工作日</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="8" @change.native.stop="change">
        <span class="first">在本月底前</span>
        <el-input-number
          v-model="timeConf['8'].values"
          size="mini"
          :min="1"
          :max="31"
          @change="emitValue"
        ></el-input-number>
        <span class="offset-left">天</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="2" @change.native.stop="change">
        <span class="first">从</span>
        <el-input-number v-model="timeConf['2'].values[0]" size="mini" :min="1" @change="emitValue"></el-input-number>
        <span class="offset-left middle">开始 每隔</span>
        <el-input-number
          v-model="timeConf['2'].values[1]"
          size="mini"
          @change="emitValue"
          :max="31"
          :min="1"
        ></el-input-number>
        <span class="offset-left">日开始</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="3" @change.native.stop="change">
        <span class="first">周期从</span>
        <el-input-number
          v-model="timeConf['3'].values[0]"
          size="mini"
          @change="emitValue"
          :max="31"
          :min="1"
        ></el-input-number>
        <span class="offset-left middle">日到</span>
        <el-input-number
          v-model="timeConf['3'].values[1]"
          size="mini"
          @change="emitValue"
          :max="31"
          :min="1"
        ></el-input-number>
        <span class="offset-left">日</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="4" @change.native.stop="change">
        <span class="first">每月</span>
        <el-input-number
          v-model="timeConf['4'].values"
          size="mini"
          @change="emitValue"
          :max="31"
          :min="1"
        ></el-input-number>
        <span class="offset-left middle">号最近的那个工作日</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="6" @change="change">
        <span class="first">指定天数</span>
      </el-radio>

      <el-checkbox-group v-model="timeConf['6'].values" class="group" @change="checkChange">
        <template v-for="(item,index) in 31">
          <el-checkbox :label="item" :key="index" class="event-col"></el-checkbox>
        </template>
      </el-checkbox-group>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: "*"
    }
  },
  data() {
    return {
      radio: null,
      timeConf: {
        "1": {
          values: "*"
        },
        "2": {
          values: [1, 1]
        },
        "3": {
          values: [1, 2]
        },
        "4": {
          values: 1
        },
        "5": {
          values: "L"
        },
        "6": {
          values: []
        },
        "7": {
          values: "LW"
        },
        "8": {
          values: 1
        }
      }
    };
  },
  created() {
    this.setType();
  },
  methods: {
    checkChange() {
      this.radio = "6";
      this.emitValue();
    },
    interval() {},
    setType() {
      if (this.data.includes("/")) {
        this.radio = "2";
        [
          this.timeConf["2"].values[1],
          this.timeConf["2"].values[0]
        ] = this.data.split("/");
      } else if (this.data.includes("-") && !this.data.includes("L")) {
        this.radio = "3";
        [
          this.timeConf["3"].values[0],
          this.timeConf["3"].values[1]
        ] = this.data.split("-");
      } else if (this.data.includes(",")) {
        this.radio = "6";
        this.timeConf["6"].values = this.data
          .split(",")
          .map(res => (res < 10 ? "0" + res : "" + res));
      } else if (!isNaN(parseInt(this.data))) {
        //单个数字放到多选中
        let val = parseInt(this.data);
        this.radio = "6";
        this.timeConf["6"].values = [val];
      } else if (this.data.includes("W")) {
        this.radio = "4";
        this.timeConf["4"].values = parseInt(
          this.data.substring(0, this.data.length - 1)
        );
      } else if (this.data === "L") {
        this.radio = "5";
      } else if (this.date === "LW") {
        this.radio = "7";
      } else if (this.data.includes("-") && this.data.includes("L")) {
        this.radio = "8";
        this.timeConf["8"].values = this.data.split("-")[1];
      } else if (this.data === "*") {
        this.radio = "1";
      } else {
        this.radio = null;
      }
    },
    change() {
      this.emitValue();
    },
    check() {
      if (this.radio === "4") {
        this.emitValue();
      }
    },
    emitValue() {
      let confVal = this.timeConf;
      if (this.radio === "1") {
        this.send("*", "date");
      } else if (this.radio === "2") {
        this.send(confVal["2"].values[0] + "/" + confVal["2"].values[1]);
      } else if (this.radio === "3") {
        this.send(confVal["3"].values[0] + "-" + confVal["3"].values[1]);
      } else if (this.radio === "4") {
        this.send(confVal["4"].values + "W");
      } else if (this.radio === "5") {
        this.send("L");
      } else if (this.radio === "6") {
        this.send(
          confVal["6"].values
            .map(res => parseInt(res))
            .sort()
            .join(",")
        );
      } else if (this.radio === "7") {
        this.send("LW");
      } else {
        this.send("L-" + confVal["8"].values);
      }
    },
    send(value) {
      this.$emit("changeDate", {
        value,
        type: "date"
      });
    }
  }
};
</script>

<style scoped>
.event-row {
  margin-bottom: 10px;
}
span {
  display: inline-block;
  margin-right: 10px;
}
.first {
  width: 65px;
}
.middle {
  width: 70px;
}
.offset-left {
  margin-left: 10px;
}
.group {
  display: flex;
  flex-wrap: wrap;
}
.event-col {
  width: 44px;
}
.group {
  margin-top: 10px;
}
</style>
