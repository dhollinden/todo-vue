<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Sign In</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon to="/"><v-icon>close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model.trim="login.email"
              type="text"
              name="email"
              label="Enter Email Address"
            ></v-text-field>
            <v-text-field
              v-model.trim="login.password"
              :append-icon="show ? 'visibility' : 'visibility_off'"
              :type="show ? 'text' : 'password'"
              name="password"
              label="Enter Password"
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
          <v-container fluid ma-0 pa-0>
            <v-layout row wrap>
              <v-spacer></v-spacer>
              <v-btn flat color="primary darken-1" to="/">Cancel</v-btn>
              <v-btn flat color="primary darken-1" @click="onSubmit">Sign In</v-btn>
            </v-layout>
            <v-layout row wrap>
              <v-spacer></v-spacer>
              <v-btn flat color="primary darken-1" to="/Register">Need to Sign Up?</v-btn>
              <v-spacer></v-spacer>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

import AuthService from '@/services/AuthService'
import qs from 'querystring'
import { eventBus } from '@/main'

export default {
  name: 'Login',
  data () {
    return {
      login: {
        email: '',
        password: ''
      },
      show: false,
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
      const response = await AuthService.login(qs.stringify(this.login))
      if (response.data.success) {
        eventBus.$emit('signedIn', true)
        this.$router.push({ name: 'Notes' })
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
