<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <div class="text-xs-center">
          <div class="display-1 mb-5">Welcome to Lister</div>
          <div class="subheading">Please sign up to create notes.</div>
          <div class="ma-3"><v-btn color="primary lighten-1" to="/Register" dark>Sign Up</v-btn></div>
          <div class="subheading">Please sign in if you have an account.</div>
          <div class="ma-3"><v-btn color="primary lighten-1" to="/Login" dark>Sign In</v-btn></div>
        </div>
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
