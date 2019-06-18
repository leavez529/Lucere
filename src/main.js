// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import waterfall from 'vue-waterfall2'
import VueCookies from 'vue-cookies'

Vue.use(waterfall)

Vue.use(elementui)
Vue.use(iView)
Vue.use(VueCookies)
// Vue.use(lrz)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
