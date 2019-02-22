<template>
  <b-row>
    <b-col cols="12">
      <div>
        <router-link v-bind:to="{ name: 'MyAccount' }" class="">My Account</router-link>
        <b-link @click="logout()">Logout</b-link>
      </div>
      <h2>My Notes</h2>
      <div><router-link v-bind:to="{ name: 'AddNote' }" class="">Add Note</router-link>
      </div>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors" :key="error.id">
          <b-alert show>{{error.msg}}</b-alert>
        </li>
      </ul>
      <b-table striped hover :items="notes" :fields="fields">
        <template slot="actions" slot-scope="row">
          <router-link v-bind:to="{ name: 'EditNote', params: { id: row.item._id } }">Edit</router-link> |
          <a href="#" @click="confirmDeleteNote(row.item._id)">Delete</a>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>

import TodoService from '@/services/TodoService'
import AuthService from '@/services/AuthService'
import qs from 'querystring'

export default {
  name: 'Notes',
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
  mounted () {
    this.fetchNotes()
  },
  methods: {
    async fetchNotes () {
      const response = await TodoService.fetchNotes()
      if (response.data.isAuthenticated === false) {
        this.$router.push({ name: 'Login' })
      } else if (response.data.success) {
        this.notes = response.data.notes
      } else {
        this.errors = response.data.err
      }
    },
    confirmDeleteNote (id) {
      const $this = this
      $this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function (willDelete) {
        if (willDelete.value) {
          $this.deleteNote(id)
        }
      })
    },
    async deleteNote (id) {
      const response = await TodoService.deleteNote(qs.stringify({ id: id }))
      if (response.data.success) {
        this.fetchNotes()
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
