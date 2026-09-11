import axiosInstance from '../api/axiosInstance'

const inventoryTransactionService = {
  async getAllTransactions() {
    const response = await axiosInstance.get(
      '/api/inventory-transactions'
    )

    return response.data
  },
}

export default inventoryTransactionService