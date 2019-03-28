import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import GeminiScrollbar from 'vue-gemini-scrollbar';//美化滚动条
//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//echarts
import echarts from 'echarts';
import theme from './assets/customed.project';

Vue.config.productionTip = false;

Vue.use(GeminiScrollbar);
Vue.use(ElementUI);



function getCookieMap(cookie) {
//    1.根据分号切分,放入数组
//    2.循环数组，根据等号切分，前部分当属性名，后部分当值
//    3.返回对象
    let cookiePattern = /^(\S+)=(\S+)$/;
    let cookieArray = cookie.split("; ");
    let cookieMap = new Map();
    for (let item of cookieArray) {
        // console.log(item);
        let resultArray = cookiePattern.exec(item);
        // console.log(resultArray);
        cookieMap.set(resultArray[1], resultArray[2]);
    }
    return cookieMap;
}
function deepCopyByJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
}


let $axios = axios.create({
    // baseURL:'http://127.0.0.1:8000',//跨域问题，baseURL先写在vue.config.js中
    headers:{'Content-Type': 'application/json'}
});
$axios.interceptors.request.use(function (config) {
    config.headers['X-CSRFToken'] = getCookieMap(document.cookie).get('csrftoken');
    return config;
},function (error) {
    return Promise.reject(error);
});
$axios.interceptors.response.use(function (response) {
  return response;
},function (error) {

});
//也可以直接挂Vue对象上
Vue.prototype.globalFunction = {};
Vue.prototype.globalFunction.getCookieMap = getCookieMap;
Vue.prototype.globalFunction.deepCopyByJSON = deepCopyByJSON;
Vue.prototype.globalData = {
    sheetsData:{
        ALMap: new Map(),//Map.set('2002年资产负债表', {dataSets:{}, timeField1:, timeField2:, charts:[{保存charts配置，用于生成图表}]})
        PFMap: new Map(),
        CFMap: new Map(),
        ALGroup: [], //组中的对比方案[{charts}]
        PFGroup: [],
        CFGroup: []
    }
};
Vue.prototype.$axios = $axios;
echarts.registerTheme('Cat', theme.theme);
Vue.prototype.$echarts = echarts;





let vm = new Vue({
  router,
  render: h => h(App)
});
vm.$mount('#app');

