<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Sign Up</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon to="/Notes"><v-icon>close</v-icon></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model.trim="register.email"
                type="text"
                name="email"
                label="Enter Email Address"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                id="new_password"
                v-model.trim="register.password"
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :rules="[passwordRules.required, passwordRules.min]"
                :type="show ? 'text' : 'password'"
                name="password"
                label="Enter Password"
                hint="At least 8 characters"
                counter
                @click:append="show = !show"
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
            <v-btn flat color="primary darken-1" to="/Login">Already have an account?</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat color="primary darken-1" to="/Notes">Cancel</v-btn>
            <v-btn flat color="primary darken-1" @click="onSubmit">Sign Up</v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Account Created</v-card-title>
            <v-card-text>Please sign in to start creating notes.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary darken-1" flat to="/Login">Sign In</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import AuthService from '@/services/AuthService'
import qs from 'querystring'

export default {
  name: 'Register',
  data () {
    return {
      register: {},
      dialog: false,
      show: false,
      passwordRules: {
        required: value => !!value || 'Required.',
        min: value => (typeof value === 'undefined' || value.length >= 8) || 'Min 8 characters'
      },
      emailRules: [value => {
        if (typeof value === 'undefined') {
          return true
        } else if (value.length > 0) {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }],
      alert: {
        status: false,
        type: 'error',
        messages: []
      }
    }
  },
  methods: {
    async onSubmit (evt) {
      evt.preventDefault()
      const response = await AuthService.register(qs.stringify(this.register))
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
