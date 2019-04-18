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
            <v-btn flat class="hidden-sm-and-down" to="/Login">SIGN IN</v-btn>
            <v-btn color="brown lighten-3" class="hidden-sm-and-down" to="/Register">JOIN</v-btn>
        </v-toolbar>
    </span>
</template>

<script>

import AuthService from '@/services/AuthService'

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
      ]
    }
  },
  methods: {
    async logout () {
      const response = await AuthService.logout()
      if (response.data.success) {
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
    }
  }
}
</script>
