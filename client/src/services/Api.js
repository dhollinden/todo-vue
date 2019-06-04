import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? `https://y5zkbh34gk.execute-api.us-east-1.amazonaws.com/dev` : `http://localhost:8080/api`
console.log('Api.js: baseURL = ', baseURL)

export default() => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true
  })
}
