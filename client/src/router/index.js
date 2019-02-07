import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Notes from '@/components/Notes'
import Login from '@/components/Login'
import Register from '@/components/Register'
import MyAccount from '@/components/MyAccount'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Notes
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: 'myaccount',
      name: 'MyAccount',
      component: MyAccount
    }
  ]
})
