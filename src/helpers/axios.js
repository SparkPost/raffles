import axios from 'axios'
import getToken from './auth'

var instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
  timeout: 1000,
  headers: {'Authorization': `Bearer ${getToken()}`}
})

export default instance
