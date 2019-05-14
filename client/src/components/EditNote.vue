<!--<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <NavBar />
      <h2>Edit Note</h2>
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error.id">
          <b-alert show>{{error.msg}}</b-alert>
        </div>
      </div>
      <b-form @submit="updateNote">
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
        <b-button type="submit" variant="primary">Update</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>-->

<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Edit Note</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon to="/Notes"><v-icon>close</v-icon></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field label="Note Name" name="name" id="name" type="text" v-model.trim="note.name">
              </v-text-field>
              <v-text-field label="Note" name="body" id="body" type="text" v-model.trim="note.body">
              </v-text-field>
            </v-form>
            <v-alert :value="alert.status" :type="alert.type" outline>
              <ul>
                <li v-for="message of alert.messages" :key="message.id">
                  {{message.msg}}
                </li>
              </ul>
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary darken-1" to="/Notes">Cancel</v-btn>
            <v-btn flat color="primary darken-1" @click="updateNote">Edit Note</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TodoService from '@/services/TodoService'
import qs from 'querystring'

export default {
  name: 'EditNote',
  data () {
    return {
      note: {},
      alert: {
        status: false,
        type: 'error',
        messages: []
      }
    }
  },
  mounted () {
    this.getNote()
  },
  methods: {
    async getNote () {
      const response = await TodoService.getNote({ id: this.$route.params.id })
      if (!response.data.err) {
        if (response.data.success) {
          this.note = response.data.note
        } else if (response.data.isAuthenticated === false) {
          this.$router.push({ name: 'Login' })
        }
      } else {
        this.alert = {
          status: true,
          type: 'error',
          messages: response.data.err
        }
      }
    },
    async updateNote () {
      try {
        const response = await TodoService.updateNote(qs.stringify(this.note))
        if (response.data.success) {
          this.$router.push({ name: 'Notes' })
        } else {
          this.alert = {
            status: true,
            type: 'error',
            messages: response.data.err
          }
        }
      } catch (error) {
        this.alert = {
          status: true,
          type: 'error',
          messages: [{msg: error}]
        }
      }
    }
  }
}
</script>
