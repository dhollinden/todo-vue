import axios from 'axios'

export default() => {
  return axios.create({
    // baseURL: `http://localhost:8080/api`,
    baseURL: `https://y5zkbh34gk.execute-api.us-east-1.amazonaws.com/dev`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true
  })
}
