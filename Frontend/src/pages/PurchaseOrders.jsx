import { useEffect, useState } from 'react'
import purchaseOrderService from '../services/purchaseOrderService'
import materialService from '../services/materialService'
import vendorService from '../services/vendorService'
import sapService from '../services/sapService'

function PurchaseOrders() {
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null)
    const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [createMaterialId, setCreateMaterialId] = useState('')
    const [createVendorId, setCreateVendorId] = useState('')
    const [createQuantity, setCreateQuantity] = useState('')
    const [materials, setMaterials] = useState([])
    const [vendors, setVendors] = useState([])
    const [sapPurchaseOrders, setSapPurchaseOrders] = useState([])

    const handleApprovePurchaseOrder = async (id) => {
      try {
        setError('')

        await purchaseOrderService.approvePurchaseOrder(id)

        const data = await purchaseOrderService.getAllPurchaseOrders()

        setPurchaseOrders(data)
      } catch (error) {
        console.error('Approve purchase order error:', error)

        setError(
          error.response?.status === 403
            ? 'Access Denied'
            : error.response?.data?.message ||
              'Failed to approve purchase order.'
        )
      }
    }

    const handleMarkPurchaseOrderAsOrdered = async (id) => {
      try {
        setError('')

        await purchaseOrderService.markPurchaseOrderAsOrdered(id)

        const data = await purchaseOrderService.getAllPurchaseOrders()

        setPurchaseOrders(data)
      } catch (error) {
        console.error(
          'Mark purchase order as ordered error:',
          error
        )

        setError(
          error.response?.status === 403
            ? 'Access Denied'
            : error.response?.data?.message ||
              'Failed to mark purchase order as ordered.'
        )
      }
    }

    const handleReceivePurchaseOrder = async (id) => {
      try {
        setError('')

        await purchaseOrderService.receivePurchaseOrder(id)

        const data = await purchaseOrderService.getAllPurchaseOrders()

        setPurchaseOrders(data)
      } catch (error) {
        console.error(
          'Receive purchase order error:',
          error
        )

        setError(
          error.response?.status === 403
            ? 'Access Denied'
            : error.response?.data?.message ||
              'Failed to receive purchase order.'
        )
      }
    }

    useEffect(() => {
      const loadPurchaseOrders = async () => {
        try {
          setError('')

          try {
            const sapPurchaseOrderData = await sapService.getPurchaseOrders()
            setSapPurchaseOrders(sapPurchaseOrderData)
          } catch (sapError) {
            console.warn(
              'SAP Purchase Orders unavailable:',
              sapError
            )
            setSapPurchaseOrders([])
          }

          const data = await purchaseOrderService.getAllPurchaseOrders()
          setPurchaseOrders(data)

          const materialData = await materialService.getAllMaterials()
          setMaterials(materialData)

          const vendorData = await vendorService.getAllVendors()
          setVendors(vendorData)

        } catch (error) {
          console.error('Load purchase orders error:', error)

          setError(
            error.response?.status === 403
              ? 'Access Denied'
              : error.response?.data?.message ||
                'Failed to load purchase orders.'
          )
        } finally {
          setLoading(false)
        }
      }

      loadPurchaseOrders()
    }, [])

    const totalPurchaseOrders = purchaseOrders.length

    const createdOrders = purchaseOrders.filter(
      (purchaseOrder) => purchaseOrder.status === 'CREATED'
    ).length

    const approvedOrders = purchaseOrders.filter(
      (purchaseOrder) => purchaseOrder.status === 'APPROVED'
    ).length

    const totalOrderValue = purchaseOrders.reduce(
      (sum, purchaseOrder) =>
        sum + Number(purchaseOrder.totalAmount || 0),
      0
    )

    const filteredPurchaseOrders = purchaseOrders.filter(
      (purchaseOrder) => {
        const searchValue = searchTerm.toLowerCase()

        const poId = String(purchaseOrder.id || '').toLowerCase()
        const vendorName = String(
          purchaseOrder.vendor?.vendorName || ''
        ).toLowerCase()
        const status = String(
          purchaseOrder.status || ''
        ).toLowerCase()

        return (
          (statusFilter === 'ALL' || purchaseOrder.status === statusFilter) &&
          (
            poId.includes(searchValue) ||
            vendorName.includes(searchValue) ||
            status.includes(searchValue)
          )
        )
      }
    )

    const handleCreatePurchaseOrder = async () => {
      if (!createMaterialId) {
        setError('Please select a material.')
        return
      }

      if (!createVendorId) {
        setError('Please select a vendor.')
        return
      }

      if (!createQuantity || Number(createQuantity) <= 0) {
        setError('Please enter a valid quantity.')
        return
      }

      try {
        setError('')

        await purchaseOrderService.createPurchaseOrder(
          Number(createMaterialId),
          Number(createVendorId),
          Number(createQuantity)
        )

        const data = await purchaseOrderService.getAllPurchaseOrders()
        setPurchaseOrders(data)

        setCreateMaterialId('')
        setCreateVendorId('')
        setCreateQuantity('')
        setShowCreateForm(false)
      } catch (error) {
        console.error('Create purchase order error:', error)

        setError(
          error.response?.status === 403
            ? 'Access Denied'
            : error.response?.data?.message ||
              'Failed to create purchase order.'
        )
      }
    }

    return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Purchase Orders
          </h1>

          <p className="mt-2 text-gray-600">
            Manage purchase orders and procurement activities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Add Purchase Order
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Create Purchase Order
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Create a new purchase order for a material.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              value={createMaterialId}
              onChange={(event) => setCreateMaterialId(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select Material</option>

              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.materialCode} - {material.materialName}
                </option>
              ))}
            </select>

            <select
              value={createVendorId}
              onChange={(event) => setCreateVendorId(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select Vendor</option>

              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.vendorCode} - {vendor.vendorName}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={createQuantity}
              onChange={(event) => setCreateQuantity(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={handleCreatePurchaseOrder}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Create Purchase Order
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Purchase Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalPurchaseOrders}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Created Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {createdOrders}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Approved Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {approvedOrders}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Order Value
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ₹{totalOrderValue}
          </p>
        </div>

      </div>

      {/* Purchase Orders Table */}
      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Purchase Order List
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage purchase orders.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:flex-1"
          />

          <select
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="CREATED">Created</option>
            <option value="APPROVED">Approved</option>
            <option value="ORDERED">Ordered</option>
            <option value="RECEIVED">Received</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="px-4 py-3">PO ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Order Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No purchase orders available.
                  </td>
                </tr>
              ) : (
                filteredPurchaseOrders.map((purchaseOrder) => (
                  <tr
                    key={purchaseOrder.id}
                    className="border-b border-gray-100"
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {purchaseOrder.id}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {purchaseOrder.vendor?.vendorName || '—'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {purchaseOrder.orderDate || '—'}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                        {purchaseOrder.status || '—'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      ₹{purchaseOrder.totalAmount ?? 0}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPurchaseOrder(purchaseOrder)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>

                        {purchaseOrder.status === 'CREATED' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleApprovePurchaseOrder(purchaseOrder.id)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Approve
                          </button>
                        )}

                        {purchaseOrder.status === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkPurchaseOrderAsOrdered(purchaseOrder.id)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Mark as Ordered
                          </button>
                        )}

                        {purchaseOrder.status === 'ORDERED' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleReceivePurchaseOrder(purchaseOrder.id)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Receive
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedPurchaseOrder(purchaseOrder)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedPurchaseOrder && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Purchase Order Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedPurchaseOrder(null)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">PO ID</p>
                <p className="font-medium text-gray-900">
                  {selectedPurchaseOrder.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium text-gray-900">
                  {selectedPurchaseOrder.vendor?.vendorName || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">
                  {selectedPurchaseOrder.orderDate || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-900">
                  {selectedPurchaseOrder.status || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-gray-900">
                  ₹{selectedPurchaseOrder.totalAmount ?? 0}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

            {/* SAP Purchase Orders */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            SAP Purchase Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Purchase orders retrieved through SAP S/4HANA integration.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="px-4 py-3">Purchase Order</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Order Date</th>
                <th className="px-4 py-3">Company Code</th>
                <th className="px-4 py-3">Purchasing Organization</th>
                <th className="px-4 py-3">Currency</th>
              </tr>
            </thead>

            <tbody>
              {sapPurchaseOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No SAP purchase orders available.
                  </td>
                </tr>
              ) : (
                sapPurchaseOrders.map((sapPurchaseOrder) => (
                  <tr
                    key={sapPurchaseOrder.PurchaseOrder}
                    className="border-b border-gray-100"
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {sapPurchaseOrder.PurchaseOrder}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {sapPurchaseOrder.Supplier}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {sapPurchaseOrder.PurchaseOrderDate}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {sapPurchaseOrder.CompanyCode}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {sapPurchaseOrder.PurchasingOrganization}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {sapPurchaseOrder.DocumentCurrency}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default PurchaseOrders