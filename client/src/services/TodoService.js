import Api from '@/services/Api'
import qs from 'querystring'

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

  updateNote (params) {
    return Api().post('notes/' + qs.parse(params)._id + '/update', params)
  },

  deleteNote (params) {
    return Api().post('notes/' + qs.parse(params).id + '/delete', params)
  }
}
