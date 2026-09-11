import { useEffect, useState } from 'react'
import dashboardService from '../services/dashboardService'

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
  try {
    setLoading(true)
    setError('')

    const data = await dashboardService.getDashboardSummary()
    setDashboardData(data)
    setLastUpdated(new Date())
  } catch (error) {
    console.error('Dashboard error:', error)
    setError('Failed to load dashboard data.')
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  loadDashboard()
}, [])

  if (loading && !dashboardData) {
    return <p>Loading dashboard...</p>
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Live ERP dashboard data from the Spring Boot backend.
          </p>

          {lastUpdated && (
            <p className="mt-1 text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Materials
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboardData.totalMaterials}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Purchase Orders
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboardData.totalPurchaseOrders}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Stock Quantity
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboardData.totalStockQuantity}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Low Stock Materials
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboardData.lowStockMaterials}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Total Inventory Value
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          {formatCurrency(dashboardData.totalInventoryValue)}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Total Purchase Order Value
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          {formatCurrency(dashboardData.totalPurchaseOrderValue)}
        </h2>
      </div>

      <div
        className={`mt-6 rounded-xl border p-6 shadow-sm ${
          dashboardData.lowStockMaterials > 0
            ? 'border-red-200 bg-red-50'
            : 'border-green-200 bg-green-50'
        }`}
      >
        <h2
          className={`text-lg font-semibold ${
            dashboardData.lowStockMaterials > 0
              ? 'text-red-800'
              : 'text-green-800'
          }`}
        >
          Inventory Alert
        </h2>

        <p
          className={`mt-2 ${
            dashboardData.lowStockMaterials > 0
              ? 'text-red-700'
              : 'text-green-700'
          }`}
        >
          {dashboardData.alertMessage}
        </p>
      </div>

      {dashboardData.lowStockMaterialDetails?.length > 0 && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Low Stock Materials
          </h2>

          <div className="mt-4 space-y-3">
            {dashboardData.lowStockMaterialDetails.map((material, index) => (
              <div
                key={material.id || index}
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <p className="font-semibold text-red-800">
                  {material.materialName}
                </p>

                <p className="mt-1 text-sm text-red-700">
                  Current Stock: {material.currentStock}
                </p>

                <p className="text-sm text-red-700">
                  Reorder Level: {material.reorderLevel}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Purchase Order Status
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Created
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.createdPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.pendingPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Approved
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.approvedPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Ordered
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.orderedPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Received
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.receivedPurchaseOrders}
            </h3>
          </div>

        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Purchase Order Values
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total PO Value
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(dashboardData.totalPurchaseOrderValue)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending PO Value
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(dashboardData.pendingPurchaseOrderValue)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Received PO Value
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(dashboardData.receivedPurchaseOrderValue)}
            </h3>
          </div>

        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Inventory Movements
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Goods Receipt Transactions
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.goodsReceiptTransactions}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Goods Issue Transactions
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.goodsIssueTransactions}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Inventory Transactions
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData.totalInventoryTransactions}
            </h3>
          </div>

        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Goods Receipt Quantity
        </p>

        <h3 className="mt-2 text-2xl font-bold text-gray-900">
          {dashboardData.totalGoodsReceiptQuantity}
        </h3>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Goods Issue Quantity
        </p>

        <h3 className="mt-2 text-2xl font-bold text-gray-900">
          {dashboardData.totalGoodsIssueQuantity}
        </h3>
      </div>

      </div>
    </div>
  )
}

export default Dashboard