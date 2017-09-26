import axios from 'axios'
import auth from './auth'

const instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
  timeout: 1000,
  headers: {'Authorization': `Bearer ${auth.getToken()}`}
})

export default instance
