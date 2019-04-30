<template>
<!--
      <div>
        <router-link v-bind:to="{ name: 'Notes' }" class="">My Notes</router-link>&nbsp;&nbsp;
        <router-link v-bind:to="{ name: 'MyAccount' }" class="">My Account</router-link>&nbsp;&nbsp;
        <b-link @click="logout()">Logout</b-link>
      </div>
-->
  <span>
        <v-navigation-drawer app v-model="drawer" class="brown lighten-2" dark disable-resize-watcher>
            <v-list>
                <template v-for="(item, index) in items">
                    <v-list-tile :key="index">
                        <v-list-tile-content>
                            {{item.title}}
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider :key="`divider-${index}`"></v-divider>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app color="brown darken-4" dark>
            <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-spacer class="hidden-md-and-up"></v-spacer>
            <v-toolbar-title>{{appTitle}}</v-toolbar-title>
            <v-btn flat class="hidden-sm-and-down" to="/Notes">Notes</v-btn>
            <v-spacer class="hidden-sm-and-down"></v-spacer>
            <v-btn class="hidden-sm-and-down" flat to="/Login" v-if="!signedIn">SIGN IN</v-btn>
            <v-btn class="hidden-sm-and-down" flat @click="logout" v-if="signedIn">SIGN OUT</v-btn>
            <v-btn class="hidden-sm-and-down" color="brown lighten-3" to="/Register" v-if="!signedIn">SIGN UP</v-btn>
            <v-btn class="hidden-sm-and-down" color="brown lighten-3" to="/MyAccount" v-if="signedIn">MY ACCOUNT</v-btn>
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
        { title: 'Notes' },
        { title: 'Sign In' },
        { title: 'Join' }
      ],
      signedIn: true
    }
  },
  created () {
    // start listening to eventBus as soon as NavBar component is created
    eventBus.$on('signedIn', (signedIn) => {
      this.signedIn = signedIn
    })
  },
  methods: {
    async logout () {
      const response = await AuthService.logout()
      if (response.data.success) {
        this.signedIn = false
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
      console.log('NavBar: logout() - signedIn = ', this.signedIn)
    }
  }
}
</script>
