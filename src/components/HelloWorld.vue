<template>
  <div class>
    <el-row :gutter="10" justify="center" type="flex">
      <el-col :span="6">
        <el-popover placement="bottom" width="650" trigger="click" ref="popover">
          <v-cron :data="crontab" @sure="sure" @cancel="cancel"></v-cron>
          <el-input :value="crontab" disabled slot="reference"></el-input>
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>

<script>
 export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      crontab: "0/10 0 0 ? 10 3 *"
    };
  },
  methods: {
    sure(val) {
      this.crontab = val;
    },
    cancel(){
      console.log(this.$refs.popover.doClose());
        
    }
  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
