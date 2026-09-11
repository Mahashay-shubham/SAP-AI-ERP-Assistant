import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import analyticsService from '../services/analyticsService'

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await analyticsService.getAnalytics()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Analytics error:', error)
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

    const purchaseOrderStatusData = analyticsData
      ? [
          {
            status: 'Created',
            count: analyticsData.createdPurchaseOrders,
          },
          {
            status: 'Approved',
            count: analyticsData.approvedPurchaseOrders,
          },
          {
            status: 'Ordered',
            count: analyticsData.orderedPurchaseOrders,
          },
          {
            status: 'Received',
            count: analyticsData.receivedPurchaseOrders,
          },
          {
            status: 'Pending',
            count: analyticsData.pendingPurchaseOrders,
          },
        ]
      : []

      const inventoryMovementData = analyticsData
        ? [
            {
              movement: 'Goods Receipt',
              transactions: analyticsData.goodsReceiptTransactions,
              quantity: analyticsData.totalGoodsReceiptQuantity,
            },
            {
              movement: 'Goods Issue',
              transactions: analyticsData.goodsIssueTransactions,
              quantity: analyticsData.totalGoodsIssueQuantity,
            },
          ]
        : []

      const financialAnalyticsData = analyticsData
        ? [
            {
              metric: 'Inventory Value',
              value: analyticsData.totalInventoryValue,
            },
            {
              metric: 'Total PO Value',
              value: analyticsData.totalPurchaseOrderValue,
            },
            {
              metric: 'Received PO Value',
              value: analyticsData.receivedPurchaseOrderValue,
            },
            {
              metric: 'Pending PO Value',
              value: analyticsData.pendingPurchaseOrderValue,
            },
          ]
        : []

  if (loading && !analyticsData) {
    return <p>Loading analytics...</p>
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics & Reporting
          </h1>

          <p className="mt-2 text-gray-600">
            Detailed ERP analytics from the Spring Boot backend.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Inventory Analytics */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Inventory Analytics
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Materials</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.totalMaterials}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Stock Quantity</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.totalStockQuantity}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Inventory Value</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(analyticsData.totalInventoryValue)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Low Stock Materials</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.lowStockMaterials}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Vendors</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.totalVendors}
            </h3>
          </div>
          
        </div>
      </section>

      {/* Purchase Order Analytics */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Purchase Order Analytics
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Purchase Orders</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.totalPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Received Orders</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.receivedPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.pendingPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total PO Value</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(analyticsData.totalPurchaseOrderValue)}
            </h3>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Received PO Value</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(analyticsData.receivedPurchaseOrderValue)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending PO Value</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(analyticsData.pendingPurchaseOrderValue)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Inventory Transactions</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.totalInventoryTransactions}
            </h3>
          </div>
        </div>
      </section>

      {/* Inventory Movement Analytics */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Inventory Movement Analytics
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Goods Receipt Transactions</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.goodsReceiptTransactions}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Goods Issue Transactions</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.goodsIssueTransactions}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Goods Receipt Quantity</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.totalGoodsReceiptQuantity}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Goods Issue Quantity</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.totalGoodsIssueQuantity}
            </h3>
          </div>

          </div>

          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Goods Receipt vs Goods Issue
            </h3>

            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryMovementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="movement" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="quantity"
                    name="Quantity"
                    label={{ position: 'top' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
      </section>

      {/* Purchase Order Status */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Purchase Order Status
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Created</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.createdPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Approved</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.approvedPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Ordered</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.orderedPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Received</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.receivedPurchaseOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {analyticsData.pendingPurchaseOrders}
            </h3>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Purchase Order Status Distribution
          </h3>

          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purchaseOrderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  name="Purchase Orders"
                  label={{ position: 'top' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Financial Analytics */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Financial Analytics
        </h2>

        <div className="mt-4 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            ERP Financial Overview
          </h3>

          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis
                  tickFormatter={(value) =>
                    `₹${new Intl.NumberFormat('en-IN', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(value)}`
                  }
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Bar
                  dataKey="value"
                  name="Value"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Analytics