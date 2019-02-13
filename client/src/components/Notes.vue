<template>
  <b-row>
    <b-col cols="12">
      <h2>Notes List</h2>
      <div><router-link v-bind:to="{ name: 'AddPost' }" class="">Add Post</router-link>
        <router-link v-bind:to="{ name: 'MyAccount' }" class="">My Account</router-link>
        <b-link @click="logout()">(Logout)</b-link>
      </div>
      <b-table striped hover :items="notes" :fields="fields">
        <template slot="actions" slot-scope="row">
          <router-link v-bind:to="{ name: 'editnote', params: { id: row.item._id } }">Edit</router-link> |
          <a href="#" @click="deleteNote(row.item._id)">Delete</a>
        </template>
      </b-table>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors" :key="error.id">
          <b-alert show>{{error.message}}</b-alert>
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>

import TodoService from '@/services/TodoService'

export default {
  name: 'BookList',
  data () {
    return {
      fields: {
        name: { label: 'Note Name', sortable: true, 'class': 'text-center' },
        body: { label: 'Note', sortable: true },
        actions: { label: 'Action', 'class': 'text-center' }
      },
      notes: [],
      errors: []
    }
  },
  async created () {
    const response = await TodoService.fetchNotes()
    if (response.data.success) {
      console.log('inside created() function: response.data.success = ', response.data.success)
      this.notes = response.data.notes
    } else {
      // what happens if you're not logged in?
      this.errors = response.data.err
    }
  },
  methods: {
    details (book) {
      this.$router.push({
        name: 'ShowBook',
        params: { id: book._id }
      })
    },
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    }
  }
}
</script>
