<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Update Email Address</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon to="/Notes"><v-icon>close</v-icon></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model.trim="email.cur_email"
                type="text"
                name="cur_email"
                label="Current Email Address"
              ></v-text-field>
              <v-text-field
                v-model.trim="email.new_email"
                type="text"
                name="new_email"
                label="New Email Address"
                :rules="emailRules"
              ></v-text-field>
            </v-form>
            <v-alert :value="alert.status" :type="alert.type" outline>
              <ul>
                <li v-for="message of alert.messages" :key="message.id">
                  {{message.msg}}
                </li>
              </ul>
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary darken-1" to="/Notes">Cancel</v-btn>
            <v-btn flat color="primary darken-1" @click="updateEmail">Update</v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Email Updated</v-card-title>
            <v-card-text>Your email address was updated.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary darken-1" flat to="/Notes">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import MyAccountService from '@/services/MyAccountService'
import qs from 'querystring'

export default {
  name: 'MyAccount',
  data () {
    return {
      email: {
        cur_email: ''
      },
      dialog: false,
      alert: {
        status: false,
        type: 'error',
        messages: []
      },
      emailRules: [value => {
        if (typeof value === 'undefined') {
          return true
        } else if (value.length > 0) {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }]
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
      } else if (response.data.email) {
        this.email = {
          cur_email: response.data.email
        }
      } else {
        this.errors = response.data.err
      }
    },
    async updateEmail (evt) {
      evt.preventDefault()
      const response = await MyAccountService.updateEmail(qs.stringify(this.email))
      if (response.data.success) {
        this.alert.status = false
        this.dialog = true
      } else {
        this.alert = {
          status: true,
          type: 'error',
          messages: response.data.err
        }
      }
    }
  }
}
</script>
