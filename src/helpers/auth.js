const loggedIn = () => {
  return localStorage.getItem('token') !== null;
}

const login = (token) => {
  localStorage.setItem('token', token)
}

const logout = () => {
  localStorage.removeItem('token')
}

const getToken = () => {
  return localStorage.getItem('token')
}

export default { loggedIn, login, logout, getToken }
