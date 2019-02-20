import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Login from '@/components/Login'
import MyAccount from '@/components/MyAccount'
import Notes from '@/components/Notes'
import AddNote from '@/components/AddNote'
import EditNote from '@/components/EditNote'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: 'myaccount',
      name: 'MyAccount',
      component: MyAccount
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Notes
    },
    {
      path: '/addnote',
      name: 'AddNote',
      component: AddNote
    },
    {
      path: '/editnote/:id',
      name: 'EditNote',
      component: EditNote
    }
  ]
})
