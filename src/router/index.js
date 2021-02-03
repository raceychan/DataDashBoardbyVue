import Vue from 'vue'
import moment from 'moment' 
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import dashboard from '@/components/dashboard'
import test from '@/components/test'
import axios from 'axios'
import qs from  'qs';

 Vue.use(Router)
 Vue.filter('to_date',function(value,format) {
  return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')
})

export default new Router(
  {
  routes: [
    {
      path: '/HomePage',
      name: 'HomePage',
      component: HelloWorld
      // redirect: { name: 'Dashboard' }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: dashboard
    },
    {
      path: '/test',
      name: 'Test',
      component: test
    }
  ]
})
