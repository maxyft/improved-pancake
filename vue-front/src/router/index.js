import Vue from 'vue'
import Router from 'vue-router'
import trdMain from '@/components/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'trdMain',
      component: trdMain
    }
  ]
})
