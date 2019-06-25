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
import MyAccountService from '@/services/MyAccountService'

import { eventBus } from '@/main'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        guest: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/updateemail',
      name: 'UpdateEmail',
      component: UpdateEmail,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/updatepassword',
      name: 'UpdatePassword',
      component: UpdatePassword,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/deleteaccount',
      name: 'DeleteAccount',
      component: DeleteAccount,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Notes,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/addnote',
      name: 'AddNote',
      component: AddNote,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/editnote/:id',
      name: 'EditNote',
      component: EditNote,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      name: 'anything',
      component: Notes,
      meta: {
        requiresAuth: true
      }
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  created () {
    // start listening to eventBus as soon as component is created
    eventBus.$on('signedIn', (signedIn) => {
      router.options.signedIn = signedIn
      console.log('router: created(): signedIn = ', router.options.signedIn)
    })
  },
  signedIn: false,
  methods: {
    async checkAuth () {
      // check whether user is logged in by attempting to retrieve email address
      const response = await MyAccountService.getEmail()
      if (!response.data.err) {
        console.log('router: checkAuth(): response.data.email = ', response.data.email)
        if (response.data.email) {
          router.options.signedIn = true
          eventBus.$emit('signedIn', true)
          console.log('router: leaving checkAuth function: router.options.signedIn = ', router.options.signedIn)
          return true
        } else {
          router.options.signedIn = false
          eventBus.$emit('signedIn', false)
          console.log('router: leaving checkAuth function: router.options.signedIn = ', router.options.signedIn)
          return false
        }
      } else {
        /*
        this.alert = {
          status: true,
          type: 'error',
          messages: response.data.err
        }
        */
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  console.log('router: beforeEach: begin');
  (async function () {
    const signedIn2 = await router.options.methods.checkAuth()
    console.log('router: beforeEach: signedIn2 = ', signedIn2)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, so check if logged in
      // if not, redirect to login page
      console.log('router: beforeEach: meta: requiresAuth')
      if (!signedIn2) {
        console.log('router: beforeEach: meta: requiresAuth: redirecting to login page')
        next({
          path: '/login',
          params: {nextUrl: to.fullPath}
        })
      } else {
        console.log('router: beforeEach: meta: requiresAuth: proceed to next()')
        next()
      }
    } else if (to.matched.some(record => record.meta.guest)) {
      // this route requires 'guest' status (not logged in), so check if logged in
      // if logged in, redirect to notes page
      console.log('router: beforeEach: meta: guest')
      if (signedIn2) {
        console.log('router: beforeEach: meta: guest: redirecting to Notes')
        next({name: 'Notes'})
      } else {
        console.log('router: beforeEach: meta: guest: proceed to next()')
        next()
      }
    } else {
      // this route is only for home page
      console.log('router: beforeEach: meta: none: proceed to next()')
      next()
    }
  }())
})

export default router
