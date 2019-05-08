<!--<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <NavBar />
      <h2>My Account</h2>
      <div v-if="emailMessages && emailMessages.length">
        <div v-for="emailMessage of emailMessages" :key="emailMessage.id">
          <b-alert show>{{emailMessage.msg}}</b-alert>
        </div>
      </div>
      <b-form @submit="onEmailUpdateSubmit">
        <b-form-group id="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Current Email Address">
          <b-form-input id="cur_email" v-model.trim="email.cur_email" readonly></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal2"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="New Email Address">
          <b-form-input id="new_email" v-model.trim="email.new_email"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Update email address</b-button>
      </b-form>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div v-if="passwordMessages && passwordMessages.length">
        <div v-for="passwordMessage of passwordMessages" :key="passwordMessage.id">
          <b-alert show>{{passwordMessage.msg}}</b-alert>
        </div>
      </div>
      <b-form @submit="onPasswordUpdateSubmit">
        <b-form-group id="fieldsetHorizontal3"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Current Password">
          <b-form-input id="cur_password" :type='passwordFieldType' v-model.trim="password.cur_password" autocomplete="current password"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal4"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="New Password">
          <b-form-input id="new_password" :type='passwordFieldType' v-model.trim="password.new_password" autocomplete="new password"></b-form-input>
        </b-form-group>
        <b-button type="button" @click="switchVisibility">show / hide</b-button>
        <b-button type="submit" variant="primary">Update Password</b-button>
      </b-form>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div v-if="deleteMessages && deleteMessages.length">
        <div v-for="deleteMessage of deleteMessages" :key="deleteMessage.id">
          <b-alert show>{{deleteMessage.msg}}</b-alert>
        </div>
      </div>
      <b-form @submit="onDeleteSubmit">
        <b-form-group id="fieldsetHorizontal5"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Delete Account">

        </b-form-group>
        <b-button type="submit" variant="primary">Delete Account</b-button>
        </b-form>
    </b-col>
  </b-row>
</template>-->

<template>
  <div>
    <v-container grid-list-lg fluid>
      <v-layout row wrap justify-center>
        <!--Update Email Address-->
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
        <!--Update Password-->
        <v-flex xs12 sm8 md4 ma-3>
          <v-alert :value="alertPassword" :type="alert_type" outline>
            <ul>
              <li v-for="passwordMessage of passwordMessages" :key="passwordMessage.id">
                {{passwordMessage.msg}}
              </li>
            </ul>
          </v-alert>
          <v-card class="elevation-12">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Update Password</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form">
                <v-text-field label="Current Password" name="cur_password" id="cur_password" type="password" v-model.trim="password.cur_password">
                </v-text-field>
                <v-text-field label="New Password" name="new_password" id="new_password" type="password" v-model.trim="password.new_password">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!--<v-btn flat color="cyan" @click="$router.go(-1)">Cancel</v-btn>-->
              <v-btn flat color="cyan" @click="onPasswordUpdateSubmit">Update</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <v-layout align-center justify-center>
        <!--Delete Account-->
        <v-flex xs12 sm6 md4 ma-3>
          <v-card class="elevation-12">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Delete Account</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p><v-icon color="yellow">warning</v-icon> Deleting your account will delete all of your notes.</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
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
