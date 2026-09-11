import axiosInstance from '../api/axiosInstance'

const vendorService = {
  async getAllVendors() {
    const response = await axiosInstance.get('/api/vendors')
    return response.data
  },

  async updateVendor(id, vendorData) {
    const response = await axiosInstance.put(
      `/api/vendors/${id}`,
      vendorData
    )
    return response.data
  },

  async deleteVendor(id) {
    await axiosInstance.delete(`/api/vendors/${id}`)
  },

  async createVendor(vendorData) {
    const response = await axiosInstance.post('/api/vendors', vendorData)
    return response.data
  },
}

export default vendorService