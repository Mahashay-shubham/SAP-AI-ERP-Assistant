import axiosInstance from '../api/axiosInstance'

const purchaseOrderService = {
  async getAllPurchaseOrders() {
    const response = await axiosInstance.get('/api/purchase-orders')
    return response.data
  },

  async createPurchaseOrder(materialId, vendorId, quantity) {
    const response = await axiosInstance.post(
      '/api/purchase-orders',
      null,
      {
        params: {
          materialId,
          vendorId,
          quantity,
        },
      }
    )

    return response.data
  },

  async createAutomaticPurchaseOrder(materialId) {
    const response = await axiosInstance.post(
      `/api/purchase-orders/auto/${materialId}`
    )

    return response.data
  },

  async approvePurchaseOrder(id) {
    const response = await axiosInstance.put(
      `/api/purchase-orders/${id}/approve`
    )

    return response.data
  },

  async markPurchaseOrderAsOrdered(id) {
    const response = await axiosInstance.put(
      `/api/purchase-orders/${id}/mark-as-ordered`
    )

    return response.data
  },

  async receivePurchaseOrder(id) {
    const response = await axiosInstance.put(
      `/api/purchase-orders/${id}/receive`
    )

    return response.data
  },

  async updatePurchaseOrder(id, vendorId, quantity) {
    const response = await axiosInstance.put(
      `/api/purchase-orders/${id}`,
      null,
      {
        params: {
          vendorId,
          quantity,
        },
      }
    )

    return response.data
  },
}

export default purchaseOrderService