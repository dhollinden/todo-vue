<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <h2>Please Login</h2>
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
          <b-form-input id="email" v-model.trim="login.email"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal2"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Password">
          <b-form-input :type='passwordFieldType' id="password" v-model.trim="login.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Login</b-button>
        <b-button type="button" @click="switchVisibility">show / hide</b-button>
        <b-button type="button" variant="success" @click.stop="register()">Register</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import AuthService from '@/services/AuthService'
import qs from 'querystring'

export default {
  name: 'Login',
  data () {
    return {
      login: {},
      errors: [],
      passwordFieldType: 'password'
    }
  },
  methods: {
    async onSubmit (evt) {
      evt.preventDefault()
      const response = await AuthService.login(qs.stringify(this.login))
      if (response.data.success) {
        this.$router.push({ name: 'Notes' })
      } else {
        this.errors = response.data.err
      }
    },
    switchVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    register () {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>
