import { useEffect, useState } from 'react'
import vendorService from '../services/vendorService'

function Vendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('ALL')
  const [editingVendor, setEditingVendor] = useState(null)

    const [showCreateForm, setShowCreateForm] = useState(false)

  const [newVendor, setNewVendor] = useState({
    vendorCode: '',
    vendorName: '',
    email: '',
    phone: '',
    rating: '',
  })

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await vendorService.getAllVendors()
        setVendors(data)
      } catch (error) {
        console.error('Vendors error:', error)

        setError(
          error.response?.data?.message ||
          'Failed to load vendors.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadVendors()
  }, [])

  const handleUpdateVendor = async () => {
    try {
      setLoading(true)
      setError('')

      const updatedVendor = await vendorService.updateVendor(
        editingVendor.id,
        editingVendor
      )

      setVendors((currentVendors) =>
        currentVendors.map((vendor) =>
          vendor.id === updatedVendor.id ? updatedVendor : vendor
        )
      )

      setEditingVendor(null)
    } catch (error) {
      console.error('Update vendor error:', error)

      setError(
        error.response?.status === 403
          ? 'Access Denied'
          : error.response?.data?.message ||
            'Failed to update vendor.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVendor = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this vendor?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await vendorService.deleteVendor(id)

      setVendors((currentVendors) =>
        currentVendors.filter((vendor) => vendor.id !== id)
      )

      if (editingVendor?.id === id) {
        setEditingVendor(null)
      }
    } catch (error) {
      console.error('Delete vendor error:', error)

      setError(
        error.response?.status === 403
          ? 'Access Denied'
          : error.response?.data?.message ||
            'Failed to delete vendor.'
      )
    }
  }

  const handleCreateVendor = async () => {
    try {
      setError('')

      const createdVendor = await vendorService.createVendor({
        ...newVendor,
        rating: Number(newVendor.rating),
      })

      setVendors((currentVendors) => [
        ...currentVendors,
        createdVendor,
      ])

      setNewVendor({
        vendorCode: '',
        vendorName: '',
        email: '',
        phone: '',
        rating: '',
      })

      setShowCreateForm(false)
    } catch (error) {
      console.error('Create vendor error:', error)

      setError(
        error.response?.status === 403
          ? 'Access Denied'
          : error.response?.data?.message ||
            'Failed to create vendor.'
      )
    }
  }

  if (loading) {
    return <p>Loading vendors...</p>
  }

  const totalVendors = vendors.length

  const averageRating =
    totalVendors > 0
      ? (
          vendors.reduce(
            (sum, vendor) => sum + Number(vendor.rating || 0),
            0
          ) / totalVendors
        ).toFixed(1)
      : '0.0'

  const highlyRatedVendors = vendors.filter(
    (vendor) => Number(vendor.rating) >= 4
  ).length

  const vendorsWithEmail = vendors.filter(
    (vendor) => vendor.email
  ).length

  const filteredVendors = vendors.filter((vendor) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      vendor.vendorCode?.toLowerCase().includes(search) ||
      vendor.vendorName?.toLowerCase().includes(search) ||
      vendor.email?.toLowerCase().includes(search) ||
      vendor.phone?.toLowerCase().includes(search)

    const rating = Number(vendor.rating || 0)

    const matchesRating =
      ratingFilter === 'ALL' ||
      (ratingFilter === '4_PLUS' && rating >= 4) ||
      (ratingFilter === '3_PLUS' && rating >= 3) ||
      (ratingFilter === 'BELOW_3' && rating < 3)

    return matchesSearch && matchesRating
  })

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Vendors
          </h1>

          <p className="mt-2 text-gray-600">
            Live vendor master data from the Spring Boot backend.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Add Vendor
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Add New Vendor
          </h2>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Vendor Code
            </label>

            <input
              type="text"
              value={newVendor.vendorCode}
              onChange={(e) =>
                setNewVendor({
                  ...newVendor,
                  vendorCode: e.target.value,
                })
              }
              placeholder="e.g. VEN002"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Vendor Name
            </label>

            <input
              type="text"
              value={newVendor.vendorName}
              onChange={(e) =>
                setNewVendor({
                  ...newVendor,
                  vendorName: e.target.value,
                })
              }
              placeholder="e.g. ABC Technologies Pvt Ltd"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={newVendor.email}
              onChange={(e) =>
                setNewVendor({
                  ...newVendor,
                  email: e.target.value,
                })
              }
              placeholder="e.g. vendor@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="text"
              value={newVendor.phone}
              onChange={(e) =>
                setNewVendor({
                  ...newVendor,
                  phone: e.target.value,
                })
              }
              placeholder="e.g. 9876543210"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rating
            </label>

            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={newVendor.rating}
              onChange={(e) =>
                setNewVendor({
                  ...newVendor,
                  rating: e.target.value,
                })
              }
              placeholder="e.g. 4.5"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-6 flex gap-3">
    `       <button
              type="button"
              onClick={handleCreateVendor}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Create Vendor
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>`
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Vendors
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalVendors}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Rating
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {averageRating}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Highly Rated Vendors
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {highlyRatedVendors}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Vendors with Email
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {vendorsWithEmail}
          </h2>
        </div>

      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          name="vendor-search"
          autoComplete="off"
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
        />

        <select
          value={ratingFilter}
          onChange={(event) => setRatingFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
        >
          <option value="ALL">All Ratings</option>
          <option value="4_PLUS">4★ & Above</option>
          <option value="3_PLUS">3★ & Above</option>
          <option value="BELOW_3">Below 3★</option>
        </select>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredVendors.length} of {vendors.length} vendors
      </div>

      {editingVendor && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Vendor
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={editingVendor.vendorName || ''}
              onChange={(event) =>
                setEditingVendor({
                  ...editingVendor,
                  vendorName: event.target.value,
                })
              }
              placeholder="Vendor Name"
              className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-500"
            />

            <input
              type="email"
              value={editingVendor.email || ''}
              onChange={(event) =>
                setEditingVendor({
                  ...editingVendor,
                  email: event.target.value,
                })
              }
              placeholder="Email"
              className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleUpdateVendor}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditingVendor(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
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
                Vendor Code
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Vendor Name
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Rating
              </th>

              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredVendors.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No vendors found.
                </td>
              </tr>
            )}
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {vendor.id}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {vendor.vendorCode}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {vendor.vendorName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {vendor.email}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {vendor.phone}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {vendor.rating}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingVendor(vendor)}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vendors