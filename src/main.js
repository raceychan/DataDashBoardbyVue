// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import * as echarts from 'echarts';
import * as moment from 'moment';



Vue.prototype.$moment = moment
Vue.prototype.$echarts = echarts

Vue.use(VueRouter);
Vue.use(ViewUI);

import axios from 'axios'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
