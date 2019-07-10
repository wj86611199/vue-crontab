<template>
  <div class="tabBody">
    <el-row class="event-row">
      <el-radio v-model="radio" label="1" @change="emitValue">{{timeConf[type]["1"].text}}</el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="2" @change.native.stop="emitValue">
        <span class="first">从</span>
        <el-input-number
          v-model="timeConf[type]['2'].values[0]"
          size="mini"
          :min="0"
          @change="emitValue"
          :max="max"
        ></el-input-number>
        <span class="offset-left middle">{{timeConf[type]['2'].text}}开始 每隔</span>
        <el-input-number
          v-model="timeConf[type]['2'].values[1]"
          size="mini"
          :min="0"
          @change="emitValue"
          :max="max"
        ></el-input-number>
        <span class="offset-left">{{timeConf[type]['2'].text}}执行</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="3" @change.native.stop="emitValue">
        <span class="first">周期从</span>
        <el-input-number
          v-model="timeConf[type]['3'].values[0]"
          size="mini"
          :min="0"
          @change="emitValue"
          :max="max"
        ></el-input-number>
        <span class="offset-left middle">{{timeConf[type]['3'].text}}到</span>
        <el-input-number
          v-model="timeConf[type]['3'].values[1]"
          size="mini"
          :min="0"
          @change="emitValue"
          :max="max"
        ></el-input-number>
        <span class="offset-left">{{timeConf[type]['3'].text}}</span>
      </el-radio>
    </el-row>
    <el-row class="event-row">
      <el-radio v-model="radio" label="4" @change="emitValue">
        <span class="first">指定{{timeConf[type]['4'].text}}</span>
      </el-radio>

      <el-checkbox-group v-model="timeConf[type]['4'].values" class="group" @change="checkChange">
        <template v-if="type==='seconds' || type==='minutes'">
          <template v-for="(item,index) in 60">
            <el-checkbox :label="index<10?'0'+index:''+index" :key="index" class="event-col"></el-checkbox>
          </template>
        </template>
        <template v-else-if="type==='hours'">
          <template v-for="(item,index) in 24">
            <el-checkbox :label="index<10?'0'+index:''+index" :key="index" class="event-col"></el-checkbox>
          </template>
        </template>
        <template v-else-if="type==='month'">
          <template v-for="(item,index) in 12">
            <el-checkbox :label="item<10?'0'+item:''+item" :key="index" class="event-col"></el-checkbox>
          </template>
        </template>
      </el-checkbox-group>
    </el-row>
  </div>
</template>

<script>
import { timeConf } from "./timeConf";
export default {
  props: {
    data: {
      type: String,
      default: "*"
    },
    type: {
      type: String,
      required: true,
      default: "seconds"
    }
  },
  data() {
    return {
      radio: null,
      timeConf
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
    interval() {},
    setType() {
      let valConf = this.timeConf[this.type];
      if (this.data.includes("/")) {
        let arr = this.data.split("/");
        this.radio = "2";
        //把 */10转成 0/10
        arr[0] = arr[0] === "*" ? 0 : arr[0];
        [valConf["2"].values[0], valConf["2"].values[1]] = arr;
        this.$emit("setCorrectVal", {
          type: this.type,
          value: valConf["2"].values.join("/")
        });
      } else if (this.data.includes("-")) {
        this.radio = "3";
        [valConf["3"].values[0], valConf["3"].values[1]] = this.data.split("-");
      } else if (this.data.includes(",")) {
        this.radio = "4";
        valConf["4"].values = this.data
          .split(",")
          .map(res => (res < 10 ? "0" + res : "" + res));
      } else if (!isNaN(parseInt(this.data))) {
        //单个数字放到多选
        let val = parseInt(this.data);
        this.radio = "4";
        valConf["4"].values = [val < 10 ? "0" + val : "" + val];
      } else {
        this.radio = "1";
        valConf["1"].values = "*";
      }
    },

    check() {
      if (this.radio === "4") {
        this.emitValue();
      }
    },
    emitValue() {
      let confVal = this.timeConf[this.type];
      if (this.radio === "1") {
        this.$emit("changeVal", {
          value: "*",
          type: this.type
        });
      } else if (this.radio === "2") {
        this.$emit("changeVal", {
          value: confVal[2].values[0] + "/" + confVal[2].values[1],
          type: this.type
        });
      } else if (this.radio === "3") {
        this.$emit("changeVal", {
          value: confVal[3].values[0] + "-" + confVal[3].values[1],
          type: this.type
        });
      } else {
        this.$emit("changeVal", {
          value: confVal[4].values
            .map(res => parseInt(res))
            .sort()
            .join(","),
          type: this.type
        });
      }
    }
  },
  computed: {
    max() {
      return this.type === "hours" ? 12 : 60;
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
  width: 85px;
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
