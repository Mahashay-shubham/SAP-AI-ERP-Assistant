import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://sap-ai-erp-backend.cfapps.ap21.hana.ondemand.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance