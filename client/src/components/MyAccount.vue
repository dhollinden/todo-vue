<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <h2>My Account</h2>
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error.id">
          <b-alert show>{{error.msg}}</b-alert>
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
    </b-col>
  </b-row>
</template>

<script>

import MyAccountService from '@/services/MyAccountService'
import qs from 'querystring'

export default {
  name: 'MyAccount',
  data () {
    return {
      email: {},
      errors: []
    }
  },
  mounted () {
    this.getCurrentEmail()
  },
  methods: {
    async getCurrentEmail () {
      const response = await MyAccountService.getEmail()
      this.email.cur_email = response.data.email
    },
    async onEmailUpdateSubmit (evt) {
      evt.preventDefault()
      /* const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      } */
      const response = await MyAccountService.updateEmail(qs.stringify(this.email))
      if (response.data.success) {
        this.email = {
          cur_email: response.data.new_email,
          new_email: ''
        }
        this.errors = [{msg: 'Your email address was updated'}]
      } else {
        this.errors = response.data.err
      }
    }
  }
}
</script>
