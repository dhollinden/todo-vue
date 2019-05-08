import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import Login from '@/components/Login'
import UpdateEmail from '@/components/UpdateEmail'
import UpdatePassword from '@/components/UpdatePassword'
import DeleteAccount from '@/components/DeleteAccount'
import Notes from '@/components/Notes'
import AddNote from '@/components/AddNote'
import EditNote from '@/components/EditNote'

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
      path: '*',
      name: 'anything',
      component: Notes
    }
  ]
})
