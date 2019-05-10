<template>
  <div>
    <v-container fluid fill-height>
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
                <v-text-field label="Current Password" name="cur_password" id="cur_password" type="password" v-model.trim="password.cur_password">
                </v-text-field>
                <v-text-field label="New Password" name="new_password" id="new_password" type="password" v-model.trim="password.new_password">
                </v-text-field>
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
              <v-btn flat color="primary darken-1" @click="onPasswordUpdateSubmit">Update</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import MyAccountService from '@/services/MyAccountService'
import qs from 'querystring'

export default {
  name: 'MyAccount',
  data () {
    return {
      password: {},
      passwordFieldType: 'password',
      alert: {
        status: false,
        type: 'error',
        messages: []
      }
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
    async onPasswordUpdateSubmit (evt) {
      evt.preventDefault()
      const response = await MyAccountService.updatePassword(qs.stringify(this.password))
      if (response.data.success) {
        this.password = {
          cur_password: '',
          new_password: ''
        }
        this.alert = {
          status: true,
          type: 'success',
          messages: [{msg: 'Your password was updated'}]
        }
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
