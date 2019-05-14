<template>
  <span>
        <v-navigation-drawer app v-model="drawer" class="primary lighten-2" dark disable-resize-watcher>
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
                    <v-menu offset-x right open-on-hover>
                      <template v-slot:activator="{ on }">
                          <v-list-tile to="/MyAccount" v-on="on">
                            <v-list-tile-content>
                                MY ACCOUNT
                            </v-list-tile-content>
                        </v-list-tile>
                      </template>
                      <v-list>
                        <v-list-tile
                          v-for="(item, index) in items"
                          :key="index"
                          :to="item.dest"
                        >
                          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
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
        <v-toolbar app color="primary darken-2" dark>
            <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-spacer class="hidden-md-and-up"></v-spacer>
            <v-toolbar-title>{{appTitle}}</v-toolbar-title>
            <v-btn class="hidden-sm-and-down" flat to="/Notes" v-if="signedIn">Notes</v-btn>
            <v-spacer class="hidden-sm-and-down"></v-spacer>
            <v-btn class="hidden-sm-and-down" flat to="/Login" v-if="!signedIn">SIGN IN</v-btn>
            <v-btn class="hidden-sm-and-down" flat @click="logout" v-if="signedIn">SIGN OUT</v-btn>
            <v-btn class="hidden-sm-and-down" color="primary lighten-3" to="/Register" v-if="!signedIn">SIGN UP</v-btn>
            <v-menu offset-y open-on-hover v-if="signedIn">
              <template v-slot:activator="{ on }">
                <v-btn class="hidden-sm-and-down" flat to="/MyAccount" v-on="on">MY ACCOUNT</v-btn>
              </template>
              <v-list>
                <v-list-tile
                  v-for="(item, index) in items"
                  :key="index"
                  :to="item.dest"
                >
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
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
        { title: 'Update Email Address', dest: '/UpdateEmail' },
        { title: 'Update Password', dest: '/UpdatePassword' },
        { title: 'Delete Account', dest: '/DeleteAccount' }
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
