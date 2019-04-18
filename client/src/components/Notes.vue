<template>
<!--
  <b-row>
    <b-col cols="12">
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
-->
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm12 md4 v-for="(note, index) in notes" :key="index">
        <v-card>
          <v-toolbar color="cyan" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>

            <v-toolbar-title>{{ note.name }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list two-line>
            <template>
              <v-list-tile
                :key="index"
              >
                <v-list-tile-content>
                  <v-list-tile-title v-html="note.body"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import TodoService from '@/services/TodoService'
import qs from 'querystring'

export default {
  name: 'Notes',
  data () {
    return {
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
    }
  }
}
</script>
