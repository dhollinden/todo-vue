<template>
  <div>
    <v-container grid-list-lg fluid>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm8 md4 ma-3>
          <v-card class="elevation-12">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Update Email Address</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form">
                <v-text-field label="Current Email Address" name="cur_email" id="cur_email" type="text" v-model.trim="email.cur_email">
                </v-text-field>
                <v-text-field label="New Email Address" name="new_email" id="new_email" type="text" v-model.trim="email.new_email" background-color>
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
              <v-btn flat color="cyan" @click="$router.go(-1)">Cancel</v-btn>
              <v-btn flat color="cyan" @click="onEmailUpdateSubmit">Update</v-btn>
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
      email: {
        cur_email: ''
      },
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
      } else if (response.data.email) {
        this.email = {
          cur_email: response.data.email
        }
      } else {
        this.errors = response.data.err
      }
    },
    async onEmailUpdateSubmit (evt) {
      evt.preventDefault()
      const response = await MyAccountService.updateEmail(qs.stringify(this.email))
      if (response.data.success) {
        this.email = {
          cur_email: response.data.new_email,
          new_email: ''
        }
        this.alert = {
          status: true,
          type: 'success',
          messages: [{msg: 'Your email address was updated'}]
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
