import axiosInstance from '../api/axiosInstance'

const login = async (email, password) => {
  const response = await axiosInstance.post('/api/auth/login', {
    email,
    password,
  })

  const authData = response.data

  if (authData.token) {
    localStorage.setItem('token', authData.token)
  }

  return authData
}

const getToken = () => {
  return localStorage.getItem('token')
}

const logout = () => {
  localStorage.removeItem('token')
}

const isAuthenticated = () => {
  return !!getToken()
}

export const authService = {
  login,
  getToken,
  logout,
  isAuthenticated,
}