<!--<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <NavBar />
      <h2>Add Note</h2>
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error.id">
          <b-alert show>{{error.msg}}</b-alert>
        </div>
      </div>
      <b-form @submit="addNote">
        <b-form-group id="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Note Name">
          <b-form-input id="name" v-model.trim="note.name"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal2"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Note">
          <b-form-input id="body" v-model.trim="note.body"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Add Note</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>-->

<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="cyan" dark>
            <v-toolbar-title>Add Note</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field label="Note Name" name="name" id="name" type="text" v-model.trim="note.name">
              </v-text-field>
              <v-text-field label="Note" name="body" id="body" type="text" v-model.trim="note.body">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="cyan" @click="addNote">Add Note</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TodoService from '@/services/TodoService'
import MyAccountService from '@/services/MyAccountService'
import qs from 'querystring'

export default {
  name: 'AddNote',
  data () {
    return {
      note: {},
      errors: {}
    }
  },
  mounted () {
    this.checkAuth()
  },
  methods: {
    async checkAuth () {
      // check whether user is logged in by attempting
      // to retrieve user's email address
      const response = await MyAccountService.getEmail()
      if (response.data.isAuthenticated === false) {
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
    },
    async addNote () {
      const response = await TodoService.addNote(qs.stringify(this.note))
      if (response.data.success) {
        this.$router.push({ name: 'Notes' })
      } else {
        this.errors = response.data.err
      }
    }
  }
}
</script>
