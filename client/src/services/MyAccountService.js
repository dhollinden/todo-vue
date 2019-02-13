import Api from '@/services/Api'

export default {

  getEmail (params) {
    return Api().get('account/email', params)
  },

  updateEmail (params) {
    return Api().post('account/email', params)
  },

  updatePassword (params) {
    return Api().post('account/password', params)
  },

  deleteAccount () {
    return Api().get('account/delete')
  }
}
