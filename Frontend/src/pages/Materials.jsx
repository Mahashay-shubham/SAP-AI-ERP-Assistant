import { useEffect, useState } from 'react'
import materialService from '../services/materialService'

function Materials() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('ALL')
  const [editingMaterial, setEditingMaterial] = useState(null)

  const loadMaterials = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await materialService.getAllMaterials()
      setMaterials(data)
    } catch (error) {
      console.error('Materials error:', error)
      setError('Failed to load materials.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMaterials()
  }, [])

  if (loading && materials.length === 0) {
    return <p>Loading materials...</p>
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

  const filteredMaterials = materials.filter((material) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      material.materialCode?.toLowerCase().includes(search) ||
      material.materialName?.toLowerCase().includes(search) ||
      material.category?.toLowerCase().includes(search)

    const isLowStock =
      material.currentStock <= material.reorderLevel

    const matchesStockFilter =
      stockFilter === 'ALL' ||
      (stockFilter === 'LOW' && isLowStock) ||
      (stockFilter === 'OK' && !isLowStock)

    return matchesSearch && matchesStockFilter
  })

  const totalInventoryValue = materials.reduce(
    (total, material) =>
      total + material.price * material.currentStock,
    0
  )

  const handleUpdateMaterial = async () => {
    try {
      setLoading(true)
      setError('')

      await materialService.updateMaterial(
        editingMaterial.id,
        editingMaterial
      )

      setEditingMaterial(null)

      await loadMaterials()
    } catch (error) {
      console.error('Update material error:', error)
      setError(
        error.response?.data?.message ||
        'Failed to update material.'
      )

      setEditingMaterial(null)
          } finally {
            setLoading(false)
          }
      }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Materials
          </h1>

          <p className="mt-2 text-gray-600">
            Live material master data from the Spring Boot backend.
          </p>
        </div>

        <button
          onClick={loadMaterials}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Materials
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {materials.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Stock OK
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {
              materials.filter(
                (material) =>
                  material.currentStock > material.reorderLevel
              ).length
            }
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Low Stock
          </p>

          <h2 className="mt-2 text-2xl font-bold text-red-700">
            {
              materials.filter(
                (material) =>
                  material.currentStock <= material.reorderLevel
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Total Inventory Value
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          {formatCurrency(totalInventoryValue)}
        </h2>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
        />

        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
        >
          <option value="ALL">All Stock</option>
          <option value="OK">Stock OK</option>
          <option value="LOW">Low Stock</option>
        </select>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredMaterials.length} of {materials.length} materials
      </div>

      {editingMaterial && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Material
            </h2>

            <button
              type="button"
              onClick={() => setEditingMaterial(null)}
              className="rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Material Code
              </label>

              <input
                type="text"
                value={editingMaterial.materialCode || ''}
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Material Name
              </label>

              <input
                type="text"
                value={editingMaterial.materialName || ''}
                onChange={(event) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    materialName: event.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                type="text"
                value={editingMaterial.category || ''}
                onChange={(event) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    category: event.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                value={editingMaterial.price ?? ''}
                onChange={(event) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    price: Number(event.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Current Stock
              </label>

              <input
                type="number"
                value={editingMaterial.currentStock ?? ''}
                onChange={(event) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    currentStock: Number(event.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Reorder Level
              </label>

              <input
                type="number"
                value={editingMaterial.reorderLevel ?? ''}
                onChange={(event) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    reorderLevel: Number(event.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleUpdateMaterial}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                ID
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Code
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Material Name
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Vendor
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Price
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Inventory Value
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Current Stock
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Reorder Level
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Stock Status
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredMaterials.length === 0 && (
              <tr>
                <td
                  colSpan="11"
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No materials found.
                </td>
              </tr>
            )}
            {filteredMaterials.map((material) => (
              <tr key={material.id}>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {material.id}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {material.materialCode}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {material.materialName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {material.category}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {material.vendor?.vendorName || 'Not Assigned'}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatCurrency(material.price)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatCurrency(material.price * material.currentStock)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {material.currentStock}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {material.reorderLevel}
                </td>

                {/* <td className="px-6 py-4 text-sm text-gray-700">
                  {material.stockStatus}
                </td> */}

                <td className="px-6 py-4 text-sm">
                  {material.currentStock <= material.reorderLevel ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      LOW STOCK
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      OK
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    onClick={() => setEditingMaterial(material)}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Materials