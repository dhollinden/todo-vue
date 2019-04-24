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
    <v-layout>
      <v-spacer></v-spacer>
      <v-btn color="cyan darken-1" flat to="/AddNote" dark>ADD Note</v-btn>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm12 md6 v-for="(note, index) in notes" :key="index">
          <v-toolbar color="cyan" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>{{ note.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- for displaying only unchecked/checked items
            <v-btn icon><v-icon>check_box_outline_blank</v-icon></v-btn>
            <v-btn icon><v-icon>check_box</v-icon></v-btn>
            -->
            <v-btn icon v-bind:to="{ name: 'EditNote', params: { id: note._id } }"><v-icon>edit</v-icon></v-btn>
            <v-btn icon href="#" @click.stop="confirmDelete(note._id)"><v-icon>delete</v-icon></v-btn>
          </v-toolbar>

          <v-list>
            <!-- the template could be <template v-for="(item, index) in items"> when there are multiple todos per list -->
            <template>
              <v-list-tile>
                <!-- for initial checkbox
                <v-list-tile-action>
                  <span>
                    <v-btn icon><v-icon>check_box_outline_blank</v-icon></v-btn>
                  </span>
                </v-list-tile-action>
                -->
                <v-list-tile-content>
                  <v-list-tile-title v-html="note.body"></v-list-tile-title>
                </v-list-tile-content>
                <!-- edit and delete buttons
                <v-list-tile-action>
                  <span>
                    <v-btn icon><v-icon>edit</v-icon></v-btn>
                    <v-btn icon href="#" @click="confirmDeleteNote(note._id)"><v-icon>delete</v-icon></v-btn>
                  </span>
                </v-list-tile-action>
                -->
              </v-list-tile>
            </template>
          </v-list>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Delete this note?</v-card-title>
          <v-card-text>note ID to delete is  </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" flat @click="deleteNote()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      errors: [],
      dialog: false
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
    confirmDelete (id) {
      this.dialog = true
      this.deleteId = id
    },
    async deleteNote () {
      this.dialog = false
      const response = await TodoService.deleteNote(qs.stringify({ id: this.deleteId }))
      if (response.data.success) {
        this.fetchNotes()
        this.deleteId = ''
      } else {
        this.errors = response.data.err
      }
    }
  }
}
</script>
