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
                          <v-list-tile v-on:click="" v-on="on">
                            <v-list-tile-content>
                                MY ACCOUNT
                            </v-list-tile-content>
                        </v-list-tile>
                      </template>
                      <v-list>
                        <v-list-tile v-for="(item, index) in items" :key="index" :to="item.dest">
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
            <v-toolbar-title>{{appTitle}}</v-toolbar-title>
            <v-spacer class="hidden-md-and-up"></v-spacer>
            <v-btn class="hidden-md-and-up" v-if="signedIn" flat to="/AddNote" dark>ADD NOTE</v-btn>
            <v-btn class="hidden-sm-and-down" v-if="signedIn" to="/Notes" flat>Notes</v-btn>
            <v-spacer class="hidden-sm-and-down"></v-spacer>
            <v-btn class="hidden-sm-and-down" v-if="!signedIn" to="/Login" flat>SIGN IN</v-btn>
            <v-btn class="hidden-sm-and-down" v-if="!signedIn" to="/Register" color="primary lighten-3">SIGN UP</v-btn>
            <v-btn class="hidden-sm-and-down" v-if="signedIn" @click="logout" flat>SIGN OUT</v-btn>
            <v-menu offset-y open-on-hover v-if="signedIn">
              <template v-slot:activator="{ on }">
                <v-btn class="hidden-sm-and-down" flat v-on="on">MY ACCOUNT</v-btn>
              </template>
              <v-list>
                <v-list-tile v-for="(item, index) in items" :key="index" :to="item.dest">
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
        this.$router.push({ name: 'Home' })
      } else {
        this.errors = response.data.err
      }
      console.log('NavBar: logout() function: signedIn = ', this.signedIn)
    }
  }
}
</script>
