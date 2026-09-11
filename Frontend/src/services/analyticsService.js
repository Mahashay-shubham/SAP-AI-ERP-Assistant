import axiosInstance from '../api/axiosInstance'

const analyticsService = {
  async getAnalytics() {
    const response = await axiosInstance.get('/api/analytics')
    return response.data
  },
}

export default analyticsService