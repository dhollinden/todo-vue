<template>
  <div>
    <v-container grid-list-lg fluid>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 ma-3>
          <v-card class="elevation-12">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Delete Account</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p><v-icon color="yellow">warning</v-icon> Deleting your account will delete all of your notes.</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="cyan" @click="$router.go(-1)">Cancel</v-btn>
              <v-btn flat color="cyan" @click="confirmDelete">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Delete Account?</v-card-title>
            <v-card-text>Please confirm that you want to delete your account.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="dialog = false">Cancel</v-btn>
              <v-btn color="green darken-1" flat @click="deleteAccount()">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import MyAccountService from '@/services/MyAccountService'

export default {
  name: 'MyAccount',
  data () {
    return {
      dialog: false
    }
  },
  mounted () {
    this.getCurrentEmail()
  },
  methods: {
    async getCurrentEmail () {
      const response = await MyAccountService.getEmail()
      if (response.data.isAuthenticated === false) {
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
    },
    confirmDelete () {
      this.dialog = true
    },
    async deleteAccount () {
      this.dialog = false
      const response = await MyAccountService.deleteAccount()
      if (response.data.success) {
        this.$router.push({ name: 'Register' })
      } else {
        this.deleteMessages = response.data.err
      }
    }
  }
}
</script>
