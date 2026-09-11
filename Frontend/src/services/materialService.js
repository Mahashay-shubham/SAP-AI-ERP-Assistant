import axiosInstance from '../api/axiosInstance'

const materialService = {
  async getAllMaterials() {
    const response = await axiosInstance.get('/api/materials')
    return response.data
  },

  async updateMaterial(id, materialData) {
    const response = await axiosInstance.put(
      `/api/materials/${id}`,
      materialData
    )

    return response.data
  },

  async consumeStock(id, quantity) {
    const response = await axiosInstance.put(
      `/api/materials/${id}/consume`,
      null,
      {
        params: {
          quantity,
        },
      }
    )

    return response.data
  },

}

export default materialService