import '@babel/polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import NavBar from './components/NavBar'

Vue.use(VueSweetalert2)
Vue.config.productionTip = false
Vue.component('NavBar', NavBar)

export const eventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
