import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/views/Register'
import Login from '@/views/Login'
import UpdateEmail from '@/views/UpdateEmail'
import UpdatePassword from '@/views/UpdatePassword'
import DeleteAccount from '@/views/DeleteAccount'
import Notes from '@/views/Notes'
import AddNote from '@/views/AddNote'
import EditNote from '@/views/EditNote'
import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
  routes: [
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
      path: '/updateemail',
      name: 'UpdateEmail',
      component: UpdateEmail
    },
    {
      path: '/updatepassword',
      name: 'UpdatePassword',
      component: UpdatePassword
    },
    {
      path: '/deleteaccount',
      name: 'DeleteAccount',
      component: DeleteAccount
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
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '*',
      name: 'anything',
      component: Notes
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
