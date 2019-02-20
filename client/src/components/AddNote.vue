<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <div>
        <router-link v-bind:to="{ name: 'MyAccount' }" class="">My Account</router-link>
        <b-link @click="logout()">Logout</b-link>
      </div>
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
</template>

<script>
import TodoService from '@/services/TodoService'
import AuthService from '@/services/AuthService'
import qs from 'querystring'

export default {
  name: 'AddNote',
  data () {
    return {
      note: {},
      errors: {}
    }
  },
  methods: {
    async addNote () {
      const response = await TodoService.addNote(qs.stringify(this.note))
      if (response.data.success) {
        this.$router.push({ name: 'Notes' })
      } else {
        this.errors = response.data.err
      }
    },
    async logout () {
      const response = await AuthService.logout()
      if (response.data.success) {
        this.$router.push({ name: 'Login' })
      } else {
        this.errors = response.data.err
      }
    }
  }
}
</script>
