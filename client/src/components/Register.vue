<!--<template>
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
          <b-form-input :type='passwordFieldType' id="password" v-model.trim="register.password"></b-form-input>
        </b-form-group>
        <b-button type="button" @click="switchVisibility">show / hide</b-button>
        <b-button type="submit" variant="primary">Register</b-button>
        <b-button type="button" variant="success" @click="$router.go(-1)">Cancel</b-button>
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
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Sign Up</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form">
                <v-text-field label="Enter Email Address" name="email" id="email" type="text" v-model.trim="register.email">
                </v-text-field>
                <v-text-field label="Enter Password" name="password" id="password" type="password" v-model.trim="register.password">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="cyan" @click="$router.go(-1)">Cancel</v-btn>
              <v-btn flat color="cyan" @click="onSubmit">Sign Up</v-btn>
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

export default {
  name: 'Register',
  data () {
    return {
      register: {},
      errors: [],
      alert: false,
      passwordFieldType: 'password'
    }
  },
  methods: {
    async onSubmit (evt) {
      evt.preventDefault()
      const response = await AuthService.register(qs.stringify(this.register))
      if (response.data.success) {
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
        this.alert = true
      }
    },
    switchVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    }
  }
}
</script>
