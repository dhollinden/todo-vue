<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <div>
        <router-link v-bind:to="{ name: 'Notes' }" class="">My Notes</router-link>
        <b-link @click="logout()">Logout</b-link>
      </div>
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
        <b-button type="submit" variant="primary">Update Password</b-button>
        <b-button type="button" @click="switchVisibility">show / hide</b-button>
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
          <b-button type="submit" variant="primary">Delete Account</b-button>
        </b-form-group>
        </b-form>
    </b-col>
  </b-row>
</template>

<script>

import MyAccountService from '@/services/MyAccountService'
import AuthService from '@/services/AuthService'
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
      passwordFieldType: 'password'
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
      if (response.data.success) {
        this.email = {
          cur_email: response.data.new_email,
          new_email: ''
        }
        this.emailMessages = [{msg: 'Your email address was updated'}]
      } else {
        this.emailMessages = response.data.err
      }
      // clear any previous messages
      this.passwordMessages = ''
    },
    async onPasswordUpdateSubmit (evt) {
      evt.preventDefault()
      const response = await MyAccountService.updatePassword(qs.stringify(this.password))
      if (response.data.success) {
        this.password = {
          cur_password: '',
          new_password: ''
        }
        this.passwordMessages = [{msg: 'Your password was updated'}]
      } else {
        this.passwordMessages = response.data.err
      }
      // clear any previous messages
      this.emailMessages = ''
    },
    onDeleteSubmit (evt) {
      evt.preventDefault()
      const $this = this
      $this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function (willDelete) {
        if (willDelete.value) {
          $this.deleteAccount()
        }
      })
    },
    async deleteAccount () {
      const response = await MyAccountService.deleteAccount()
      if (response.data.success) {
        this.$router.push({ name: 'Login' })
      } else {
        this.deleteMessages = response.data.err
      }
    },
    async logout () {
      const response = await AuthService.logout()
      if (response.data.success) {
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
    },
    switchVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    }
  }
}
</script>
