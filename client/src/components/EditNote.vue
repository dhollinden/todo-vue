<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <div>
        <router-link v-bind:to="{ name: 'MyAccount' }" class="">My Account</router-link>
        <b-link @click="logout()">Logout</b-link>
      </div>
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
                      label="Note Body">
          <b-form-input id="body" v-model.trim="note.body"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Update</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
import TodoService from '@/services/TodoService'
import AuthService from '@/services/AuthService'
import qs from 'querystring'

export default {
  name: 'EditNote',
  data () {
    return {
      note: {},
      errors: {}
    }
  },
  mounted () {
    this.getNote()
  },
  methods: {
    async getNote () {
      const response = await TodoService.getNote({
        id: this.$route.params.id
      })
      if (response.data.isAuthenticated === false) {
        console.log('isAuthenticated = ', response.data.isAuthenticated)
        this.$router.push({ name: 'Login' })
      } else if (response.data.success) {
        this.note = response.data.note
      } else {
        this.errors = response.data.err
      }
    },
    async updateNote () {
      const response = await TodoService.updateNote(qs.stringify(this.note), this.$route.params.id)
      if (response.data.success) {
        this.$router.push({ name: 'Notes' })
        // this.note = response.data.note
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
