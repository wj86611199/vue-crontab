<template>
  <div class="tabBody">
    <el-row class="event-row">
      <el-radio v-model="radio" label="1" @change="emitValue">每年</el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="2" @change.native.stop="emitValue">
        <span class="first">周期 从</span>
        <el-input-number
          v-model="timeConf['2'].values[0]"
          size="mini"
          :min="timeConf['2'].values[0]"
          @change="emitValue"
        ></el-input-number>
        <span class="offset-left middle">年到</span>
        <el-input-number
          v-model="timeConf['2'].values[1]"
          size="mini"
          :min="timeConf['2'].values[0]"
          @change="emitValue"
        ></el-input-number>
        <span class="offset-left">年</span>
      </el-radio>
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
          values: [new Date().getFullYear(), new Date().getFullYear()]
        }
      }
    };
  },
  created() {
    this.setType();
  },
  methods: {
    setType() {
      if (this.data === "*") {
        this.radio = "1";
      } else {
        this.radio = "2";
        [
          this.timeConf[2].values[0],
          this.timeConf[2].values[1]
        ] = this.data.split("-");
      }
    },
    emitValue() {
      let confVal = this.timeConf;
      if (this.radio === "1") {
        this.send("*");
      } else {
        this.send(confVal[2].values[0] + "-" + confVal[2].values[1]);
      }
    },
    send(value) {
      this.$emit("changeYear", {
        value,
        type: "year"
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
  width: 55px;
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
