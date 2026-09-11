import axiosInstance from '../api/axiosInstance'

const dashboardService = {
  async getDashboardSummary() {
    const response = await axiosInstance.get('/api/dashboard/summary')
    return response.data
  },
}

export default dashboardService