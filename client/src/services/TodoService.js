import Api from '@/services/Api'

export default {
  fetchNotes () {
    return Api().get('notes')
  },

  addNote (params) {
    return Api().post('create', params)
  },

  updatePost (params) {
    return Api().put('posts/' + params.id, params)
  },

  getPost (params) {
    return Api().get('post/' + params.id)
  },

  deletePost (id) {
    return Api().delete('posts/' + id)
  }
}
