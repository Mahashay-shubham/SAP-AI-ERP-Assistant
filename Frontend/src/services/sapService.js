import axiosInstance from '../api/axiosInstance'

const sapService = {
  async getProducts() {
    const response = await axiosInstance.get('/api/sap/products')
    return response.data
  },

  async getSuppliers() {
    const response = await axiosInstance.get('/api/sap/suppliers')
    return response.data
  },

  async getPurchaseOrders() {
    const response = await axiosInstance.get('/api/sap/purchase-orders')
    return response.data
  },
}

export default sapService