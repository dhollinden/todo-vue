<template>
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
          <v-btn flat color="primary darken-1" @click="editNote">Edit Note</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
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
        this.note = response.data.note
      } else {
        this.alert = {
          status: true,
          type: 'error',
          messages: response.data.err
        }
      }
    },
    async editNote () {
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
