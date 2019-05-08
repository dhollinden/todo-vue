<template>
  <span>
        <v-navigation-drawer app v-model="drawer" class="brown lighten-2" dark disable-resize-watcher>
            <v-list>
                <template>
                  <div v-if="signedIn">
                    <v-list-tile to="/Notes">
                          <v-list-tile-content>
                              NOTES
                          </v-list-tile-content>
                      </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile v-on:click="logout">
                          <v-list-tile-content>
                              SIGN OUT
                          </v-list-tile-content>
                      </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile to="/MyAccount">
                          <v-list-tile-content>
                              MY ACCOUNT
                          </v-list-tile-content>
                      </v-list-tile>
                    <v-divider></v-divider>
                  </div>
                  <div v-else>
                    <v-list-tile to="/Login">
                          <v-list-tile-content>
                              SIGN IN
                          </v-list-tile-content>
                      </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile to="/Register">
                          <v-list-tile-content>
                              SIGN UP
                          </v-list-tile-content>
                      </v-list-tile>
                    <v-divider></v-divider>
                  </div>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app color="brown darken-4" dark>
            <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-spacer class="hidden-md-and-up"></v-spacer>
            <v-toolbar-title>{{appTitle}}</v-toolbar-title>
            <v-btn class="hidden-sm-and-down" flat to="/Notes" v-if="signedIn">Notes</v-btn>
            <v-spacer class="hidden-sm-and-down"></v-spacer>
            <v-btn class="hidden-sm-and-down" flat to="/Login" v-if="!signedIn">SIGN IN</v-btn>
            <v-btn class="hidden-sm-and-down" flat @click="logout" v-if="signedIn">SIGN OUT</v-btn>
            <v-btn class="hidden-sm-and-down" color="brown lighten-3" to="/Register" v-if="!signedIn">SIGN UP</v-btn>
            <v-btn class="hidden-sm-and-down" flat to="/MyAccount" v-if="signedIn">MY ACCOUNT</v-btn>
        </v-toolbar>
    </span>
</template>

<script>

import AuthService from '@/services/AuthService'
import { eventBus } from '@/main'

export default {
  name: 'NavBar',
  data () {
    return {
      appTitle: 'Lister',
      drawer: false,
      items: [
        { title: 'Notes', icon: 'notes', dest: '/Notes', logic: this.signedIn },
        { title: 'Sign In', dest: '/Login', logic: !this.signedIn },
        { title: 'Sign Out', click: 'logout', logic: this.signedIn },
        { title: 'Sign Up', dest: '/Register', logic: !this.signedIn },
        { title: 'My Account', dest: '/MyAccount', logic: this.signedIn }
      ],
      signedIn: true
    }
  },
  created () {
    // start listening to eventBus as soon as NavBar component is created
    eventBus.$on('signedIn', (signedIn) => {
      this.signedIn = signedIn
      console.log('NavBar.vue: eventBus.$on: signedIn = ', this.signedIn)
    })
  },
  methods: {
    async logout () {
      const response = await AuthService.logout()
      if (response.data.success) {
        this.signedIn = false
        this.drawer = false
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
      console.log('NavBar: logout() function: signedIn = ', this.signedIn)
    }
  }
}
</script>
