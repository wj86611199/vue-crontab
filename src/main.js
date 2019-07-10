import Vue from 'vue'
import App from './App.vue'
import elementUi from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";
import vCron from './cron/'
Vue.config.productionTip = false
Vue.use(elementUi)
Vue.use(vCron)
new Vue({
  render: h => h(App),
}).$mount('#app')
