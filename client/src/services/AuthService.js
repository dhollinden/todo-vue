import Api from '@/services/Api'

export default {

  register (params) {
    return Api().post('signup', params)
  },

  login (params) {
    return Api().post('login', params)
  },

  logout (params) {
    return Api().get('logout')
  }
}
