<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Update Password</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon to="/Notes"><v-icon>close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              id="cur_password"
              v-model.trim="password.cur_password"
              :append-icon="show_cur ? 'visibility' : 'visibility_off'"
              :rules="[rules.required, rules.min]"
              :type="show_cur ? 'text' : 'password'"
              name="cur_password"
              label="Current Password"
              hint="At least 8 characters"
              counter
              @click:append="show_cur = !show_cur"
            ></v-text-field>
            <v-text-field
              id="new_password"
              v-model.trim="password.new_password"
              :append-icon="show_new ? 'visibility' : 'visibility_off'"
              :rules="[rules.required, rules.min]"
              :type="show_new ? 'text' : 'password'"
              name="new_password"
              label="New Password"
              hint="At least 8 characters"
              counter
              @click:append="show_new = !show_new"
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
          <v-btn flat color="primary darken-1" @click="updatePassword">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Password Updated</v-card-title>
        <v-card-text>Your password was updated.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" flat to="/Notes">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import MyAccountService from '@/services/MyAccountService'
import qs from 'querystring'

export default {
  name: 'MyAccount',
  data () {
    return {
      password: {},
      show_cur: false,
      show_new: false,
      dialog: false,
      rules: {
        required: value => !!value || 'Required.',
        min: value => (typeof value === 'undefined' || value.length >= 8) || 'Min 8 characters',
        emailMatch: () => ('The email and password you entered don\'t match')
      },
      alert: {
        status: false,
        type: 'error',
        messages: []
      }
    }
  },
  methods: {
    async updatePassword (evt) {
      evt.preventDefault()
      const response = await MyAccountService.updatePassword(qs.stringify(this.password))
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
