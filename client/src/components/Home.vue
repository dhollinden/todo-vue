<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <p>Welcome!</p>
        <p>To start creating notes you need to sign up for an account</p>
        <v-btn color="primary darken-1" flat to="/Register" dark>Sign Up</v-btn>
        <p>or sign in to your account</p>
        <v-btn color="primary darken-1" flat to="/Login" dark>Sign In</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

/*
import TodoService from '@/services/TodoService'
import qs from 'querystring'
*/

export default {
  name: 'Notes',
  data () {
    return {
    }
  }
}
</script>
