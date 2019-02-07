import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `http://localhost:8080/api`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true
  })
}
