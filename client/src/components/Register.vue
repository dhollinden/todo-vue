<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <h2>Please Register</h2>
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error.id">
          <b-alert show>{{error.msg}}</b-alert>
        </div>
      </div>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Email Address">
          <b-form-input id="email" v-model.trim="register.email"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal2"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Password">
          <b-form-input type="password" id="password" v-model.trim="register.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Register</b-button>
        <b-button type="button" variant="success" @click="$router.go(-1)">Cancel</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import AuthService from '@/services/AuthService'
import qs from 'querystring'

export default {
  name: 'Register',
  data () {
    return {
      register: {},
      errors: []
    }
  },
  methods: {
    async onSubmit (evt) {
      // console.log('inside Register.vue onSubmit')
      evt.preventDefault()
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const response = await AuthService.register(qs.stringify(this.register), config)
      // console.log(response.data)
      if (response.data.success) {
        this.$router.push({ name: 'Login' })
      } else {
        // console.log('inside Register.vue onSubmit else statement')
        for (const error in response.data.err) {
          console.log(response.data.err[error])
        }
        this.errors = response.data.err
      }
    }
  }
}
</script>
