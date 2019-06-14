<template>
  <div>
  <!--<v-container fluid grid-list-lg>-->
    <v-layout class="hidden-sm-and-down">
      <template v-if="notesLoaded">
        <v-spacer></v-spacer>
        <v-btn v-if="notes.length == 0" color="primary darken-1" flat to="/AddNote" dark>Click here to add a note</v-btn>
        <v-btn v-if="notes.length > 0" color="primary darken-1" flat to="/AddNote" dark>ADD NOTE</v-btn>
        <v-spacer v-if="notes.length == 0"></v-spacer>
      </template>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12>
        <v-alert
          :value="alert"
          color="error"
          icon="warning"
          outline
        >
          This is an error alert.
          <ul>
            <li v-for="error of errors" :key="error.id">
              {{error.msg}}
            </li>
          </ul>
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm12 md6 v-for="(note, index) in notes" :key="index">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ note.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- for displaying only unchecked/checked items (for future use)
            <v-btn icon><v-icon>check_box_outline_blank</v-icon></v-btn>
            <v-btn icon><v-icon>check_box</v-icon></v-btn>
            -->
            <v-btn icon v-bind:to="{ name: 'EditNote', params: { id: note._id } }"><v-icon>edit</v-icon></v-btn>
            <v-btn icon href="#" @click.stop="confirmDelete(note._id, note.name)"><v-icon>delete</v-icon></v-btn>
          </v-toolbar>

          <v-list>
            <!-- <template v-for="(item, index) in items"> when there are multiple todos per list -->
            <template>
              <v-list-tile>
                <!-- for initial checkbox (for future use)
                <v-list-tile-action>
                  <span>
                    <v-btn icon><v-icon>check_box_outline_blank</v-icon></v-btn>
                  </span>
                </v-list-tile-action>
                -->
                <v-list-tile-content>
                  <v-list-tile-title v-html="note.body"></v-list-tile-title>
                </v-list-tile-content>
                <!-- edit and delete buttons (for future use)
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
          <v-card-text>"{{ this.deleteName }}"</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" flat @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary darken-1" flat @click="deleteNote()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  <!--</v-container>-->
  </div>
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
      dialog: false,
      alert: false,
      notesLoaded: false,
      deleteId: '',
      deleteName: ''
    }
  },
  mounted () {
    this.fetchNotes()
  },
  methods: {
    async fetchNotes () {
      const response = await TodoService.fetchNotes()
      console.log('Notes view: fetchNotes function: response.data.isAuthenticated = ', response.data.isAuthenticated)
      if (typeof response.data.isAuthenticated !== 'undefined' && response.data.isAuthenticated === false) {
        this.$router.push({ name: 'Login' })
      } else if (response.data.success) {
        this.notes = response.data.notes
        this.notesLoaded = true
      } else {
        this.errors = response.data.err
        this.alert = true
      }
    },
    confirmDelete (id, name) {
      this.dialog = true
      this.deleteId = id
      this.deleteName = name
    },
    async deleteNote () {
      this.dialog = false
      const response = await TodoService.deleteNote(qs.stringify({ id: this.deleteId }))
      this.deleteId = ''
      this.deleteName = ''
      if (response.data.success) {
        this.fetchNotes()
      } else {
        this.errors = response.data.err
        this.alert = true
      }
    }
  }
}
</script>
