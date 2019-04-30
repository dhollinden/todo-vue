<!--<template>
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
        <b-button type="button" @click="switchVisibility">show / hide</b-button>
        <b-button type="submit" variant="primary">Login</b-button>
        <b-button type="button" variant="success" @click.stop="register()">Register</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>-->

<template>
  <div>
    <v-container>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-alert :value="alert" color="error" icon="warning" outline>
            <ul>
              <li v-for="error of errors" :key="error.id">
                {{error.msg}}
              </li>
            </ul>
          </v-alert>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="elevation-12">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Sign In</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form">
                <v-text-field label="Enter Email Address" name="email" id="email" type="text" v-model.trim="login.email">
                </v-text-field>
                <v-text-field label="Enter Password" name="password" id="password" type="password" v-model.trim="login.password">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="cyan" @click="$router.go(-1)">Cancel</v-btn>
              <v-btn flat color="cyan" @click="onSubmit">Sign In</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import AuthService from '@/services/AuthService'
import qs from 'querystring'
import { eventBus } from '@/main'

export default {
  name: 'Login',
  data () {
    return {
      login: {},
      errors: [],
      alert: false,
      passwordFieldType: 'password',
      signedIn: false
    }
  },
  methods: {
    async onSubmit (evt) {
      evt.preventDefault()
      const response = await AuthService.login(qs.stringify(this.login))
      if (response.data.success) {
        this.signedIn = true
        eventBus.$emit('signedIn', this.signedIn)
        console.log('Login.vue: emitted signedIn = true')
        this.$router.push({ name: 'Notes' })
      } else {
        this.errors = response.data.err
        this.alert = true
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
