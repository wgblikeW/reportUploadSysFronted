import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login'
import indoor from '../components/indoor'
import teacherIndoor from '../components/teacherIndoor'
// import projectAdd from '../components/projectAdd'
import axios from 'axios'

Vue.use(Router)

export default new Router({
  routes: [
    // {path: '/projectAdd', name: 'projectAdd', component: projectAdd},
    {path: '/login', name: 'login', component: login},
    {
      path: '/teacherIndoor',
      name: 'teacherIndoor',
      component: teacherIndoor,
      beforeEnter: (to, from, next) => {
        var withToken = sessionStorage.getItem('token')
        if (withToken != null) {
          withToken = require('js-base64').Base64.toBase64(withToken)
        } else {
          next({path: '/login'})
        }
        axios.get('http://localhost:8081/demo_war/login', {
          params: {
            withToken: withToken
          }
        }).then(res => {
          if (res.data.result === 'ACCESSED') {
            next()
          } else {
            sessionStorage.removeItem('token')
            next({path: '/login'})
          }
        })
      }
    },
    {path: '/', redirect: '/login'},
    {
      path: '/indoor',
      name: 'indoor',
      component: indoor,
      beforeEnter: (to, from, next) => {
        var withToken = sessionStorage.getItem('token')
        if (withToken != null) {
          withToken = require('js-base64').Base64.toBase64(withToken)
        } else {
          next({path: '/login'})
        }
        axios.get('http://localhost:8081/demo_war/login', {
          params: {
            withToken: withToken
          }
        }).then(res => {
          if (res.data.result === 'ACCESSED') {
            next()
          } else {
            sessionStorage.removeItem('token')
            next({path: '/login'})
          }
        })
      }
    }
  ]
})
