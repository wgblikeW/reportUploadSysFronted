// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import iView from 'iview'

Vue.prototype.$http = axios // 修改内部的$http为axios $http.get("") .post
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(ElementUI)
Vue.use(iView)

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
