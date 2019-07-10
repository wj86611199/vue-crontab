import vCron from './index.vue';
export default {
    install(Vue){
        Vue.component(vCron.name,vCron)
    }
}