import Api from '@/services/Api'

export default {
  fetchNotes () {
    return Api().get('notes')
  },

  getNote (params) {
    return Api().get('notes/' + params.id)
  },

  addNote (params) {
    return Api().post('notes/create', params)
  },

  updateNote (params, id) {
    return Api().post('notes/' + id + '/update', params)
  },

  deleteNote (params) {
    return Api().post('notes/' + params.id + '/delete', params)
  }
}
