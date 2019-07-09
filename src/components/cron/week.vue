<template>
  <div class="tabBody">
    <el-row class="event-row">
      <el-radio v-model="radio" label="1" @change="change">每周</el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="5" @change.native.stop="change">
        <span class="first">本月最后一个星期</span>
        <el-input-number
          v-model="timeConf['5'].values"
          size="mini"
          :min="1"
          :max="7"
          @change="emitValue"
        ></el-input-number>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="2" @change.native.stop="change">
        <span class="first">第</span>
        <el-input-number
          v-model="timeConf['2'].values[0]"
          size="mini"
          :min="1"
          :max="4"
          @change="emitValue"
        ></el-input-number>
        <span class="offset-left middle">周的星期</span>
        <el-input-number
          v-model="timeConf['2'].values[1]"
          size="mini"
          @change="emitValue"
          :max="7"
          :min="1"
        ></el-input-number>
        <span class="offset-left">开始</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="3" @change.native.stop="change">
        <span class="first">周期从星期</span>
        <el-input-number
          v-model="timeConf['3'].values[0]"
          size="mini"
          @change="emitValue"
          :max="7"
          :min="1"
        ></el-input-number>
        <span class="offset-left middle">到星期</span>
        <el-input-number
          v-model="timeConf['3'].values[1]"
          size="mini"
          @change="emitValue"
          :max="7"
          :min="1"
        ></el-input-number>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="4" @change="change">
        <span class="first">指定星期</span>
      </el-radio>

      <el-checkbox-group v-model="timeConf['4'].values" class="group" @change="checkChange">
        <template v-for="(item,index) in 7">
          <el-checkbox :value="item" :label="item" :key="index" class="event-col"></el-checkbox>
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
          values: []
        },
        "5": {
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
      this.radio = "4";
      this.emitValue();
    },
    setType() {
      if (this.data.includes("/")) {
        this.radio = "2";
        [
          this.timeConf["2"].values[1],
          this.timeConf["2"].values[0]
        ] = this.data.split("/");
      } else if (this.data.includes("-")) {
        this.radio = "3";
        [
          this.timeConf["3"].values[0],
          this.timeConf["3"].values[1]
        ] = this.data.split("-");
      } else if (this.data.includes(",")) {
        this.radio = "4";
        this.timeConf["4"].values = this.data.split(",");
      } else if (!isNaN(parseInt(this.data))) {
        //单个数字放到多选中
        let val = parseInt(this.data);
        this.radio = "4";
        this.timeConf["4"].values = [val];
      } else if (this.data.includes("L")) {
        this.radio = "5";
        this.timeConf["5"].values = parseInt(
          this.data.substring(0, this.data.length - 1)
        );
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
        this.send("*");
      } else if (this.radio === "2") {
        this.send(confVal[2].values[0] + "#" + confVal[2].values[1]);
      } else if (this.radio === "3") {
        this.send(confVal[3].values[0] + "-" + confVal[3].values[1]);
      } else if (this.radio === "4") {
        this.send(
          confVal[4].values
            .map(res => parseInt(res))
            .sort()
            .join(",")
        );
      } else {
        this.send(confVal["5"].values + "L");
      }
    },
    send(value) {
      this.$emit("changeWeek", {
        value,
        type: "week"
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
  width: 110px;
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
  margin-top: 10px;
}
.event-col {
  width: 44px;
}
</style>
