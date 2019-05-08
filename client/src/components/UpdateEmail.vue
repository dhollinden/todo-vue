<template>
  <div>
    <v-container grid-list-lg fluid>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm8 md4 ma-3>
          <v-alert :value="alertEmail" :type="alert_type" outline>
            <ul>
              <li v-for="emailMessage of emailMessages" :key="emailMessage.id">
                {{emailMessage.msg}}
              </li>
            </ul>
          </v-alert>
          <v-card class="elevation-12">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Update Email Address</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form">
                <v-text-field label="Current Email Address" name="cur_email" id="cur_email" type="text" v-model.trim="email.cur_email">
                </v-text-field>
                <v-text-field label="New Email Address" name="new_email" id="new_email" type="text" v-model.trim="email.new_email">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!--<v-btn flat color="cyan" @click="$router.go(-1)">Cancel</v-btn>-->
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
      email: {cur_email: ''},
      password: {},
      emailMessages: [],
      passwordMessages: [],
      deleteMessages: [],
      passwordFieldType: 'password',
      alertEmail: false,
      alertPassword: false,
      alert_type: 'error',
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
      } else if (response.data.email) {
        this.email.cur_email = response.data.email
      } else {
        this.errors = response.data.err
      }
    },
    async onEmailUpdateSubmit (evt) {
      evt.preventDefault()
      const response = await MyAccountService.updateEmail(qs.stringify(this.email))
      this.alertEmail = true
      if (response.data.success) {
        this.email = {
          cur_email: response.data.new_email,
          new_email: ''
        }
        this.emailMessages = [{msg: 'Your email address was updated'}]
        this.alert_type = 'success'
      } else {
        this.emailMessages = response.data.err
        this.alert_type = 'error'
      }
      // clear any previous messages
      this.passwordMessages = ''
      this.alertPassword = false
    },
    async onPasswordUpdateSubmit (evt) {
      evt.preventDefault()
      const response = await MyAccountService.updatePassword(qs.stringify(this.password))
      this.alertPassword = true
      if (response.data.success) {
        this.password = {
          cur_password: '',
          new_password: ''
        }
        this.passwordMessages = [{msg: 'Your password was updated'}]
        this.alert_type = 'success'
      } else {
        this.passwordMessages = response.data.err
        this.alert_type = 'error'
      }
      // clear any previous messages
      this.emailMessages = ''
      this.alertEmail = false
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
    },
    switchVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    }
  }
}
</script>
