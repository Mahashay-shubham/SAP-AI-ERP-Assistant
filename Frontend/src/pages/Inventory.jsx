import { useEffect, useState } from 'react'
import materialService from '../services/materialService'
import purchaseOrderService from '../services/purchaseOrderService'
import inventoryTransactionService from '../services/inventoryTransactionService'

function Inventory() {
  const [materials, setMaterials] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [transactions, setTransactions] = useState([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('ALL')
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [issueQuantity, setIssueQuantity] = useState('')
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState('')

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setError('')

        const data = await materialService.getAllMaterials()

        setMaterials(data)
        const purchaseOrderData =
          await purchaseOrderService.getAllPurchaseOrders()

        setPurchaseOrders(purchaseOrderData)
        const transactionData =
          await inventoryTransactionService.getAllTransactions()

        setTransactions(transactionData)

        console.log('Transaction history:', transactionData)
      } catch (error) {
        console.error('Load inventory error:', error)

        setError(
          error.response?.status === 403
            ? 'Access Denied'
            : error.response?.data?.message ||
              'Failed to load inventory.'
        )
      } finally {
          setLoading(false)
          setTransactionsLoading(false)
      }
    }

    loadInventory()
  }, [])

  const totalMaterials = materials.length

  const totalStock = materials.reduce(
    (sum, material) => sum + Number(material.currentStock || 0),
    0
  )

  const lowStockMaterials = materials.filter(
    (material) =>
      Number(material.currentStock || 0) <=
      Number(material.reorderLevel || 0)
  )

  const lowStockMaterialCount = lowStockMaterials.length

  const lowStockMaterialList = materials.filter(
    (material) =>
      Number(material.currentStock || 0) <=
      Number(material.reorderLevel || 0)
  )

  const totalInventoryValue = materials.reduce(
    (sum, material) =>
      sum +
      Number(material.currentStock || 0) *
        Number(material.price || 0),
    0
  )

  const filteredTransactions = transactions.filter((transaction) => {
    const activeAlerts = lowStockMaterials.map((material) => ({
      type: 'LOW_STOCK',
      materialCode: material.materialCode,
      materialName: material.materialName,
      currentStock: Number(material.currentStock || 0),
      reorderLevel: Number(material.reorderLevel || 0),
    }))
    const search = transactionSearchTerm.toLowerCase()

    const materialCode = String(
      transaction.material?.materialCode || ''
    ).toLowerCase()

    const materialName = String(
      transaction.material?.materialName || ''
    ).toLowerCase()

    const matchesSearch =
      materialCode.includes(search) ||
      materialName.includes(search)

    const matchesType =
      transactionTypeFilter === 'ALL' ||
      transaction.transactionType === transactionTypeFilter

    return matchesSearch && matchesType
  })

  const handleGoodsIssue = async () => {
    if (!selectedMaterialId) {
      setError('Please select a material.')
      return
    }

    if (!issueQuantity || Number(issueQuantity) <= 0) {
      setError('Please enter a valid quantity.')
      return
    }

    try {
      setError('')

      await materialService.consumeStock(
        selectedMaterialId,
        Number(issueQuantity)
      )

      const updatedMaterials = await materialService.getAllMaterials()
      setMaterials(updatedMaterials)
      setSelectedMaterialId('')
      setIssueQuantity('')

    } catch (error) {
      console.error('Goods issue error:', error)

      setError(
        error.response?.status === 403
          ? 'Access Denied'
          : error.response?.data?.message ||
            'Failed to issue stock.'
      )
    }
  }

  const handleGoodsReceipt = async () => {
    if (!selectedPurchaseOrderId) {
      setError('Please select a purchase order.')
      return
    }

    try {
      setError('')

      await purchaseOrderService.receivePurchaseOrder(
        selectedPurchaseOrderId
      )

      const updatedMaterials =
        await materialService.getAllMaterials()

      setMaterials(updatedMaterials)

      const updatedPurchaseOrders =
        await purchaseOrderService.getAllPurchaseOrders()

      setPurchaseOrders(updatedPurchaseOrders)

      setSelectedPurchaseOrderId('')
    } catch (error) {
      console.error('Goods receipt error:', error)

      setError(
        error.response?.status === 403
          ? 'Access Denied'
          : error.response?.data?.message ||
            'Failed to receive purchase order.'
      )
    }
  }

  const handleCreateReorderPO = async (materialId) => {
    try {
      setError('')

      await purchaseOrderService.createAutomaticPurchaseOrder(materialId)

      const updatedPurchaseOrders =
        await purchaseOrderService.getAllPurchaseOrders()

      setPurchaseOrders(updatedPurchaseOrders)
    } catch (error) {
      console.error('Create reorder PO error:', error)

      setError(
        error.response?.status === 403
          ? 'Access Denied'
          : error.response?.data?.message ||
            'Failed to create reorder purchase order.'
      )
    }
  }

  const handleReorder = async (materialId) => {
    try {
      setError('')

      await purchaseOrderService.createAutomaticPurchaseOrder(materialId)

      const updatedPurchaseOrders =
        await purchaseOrderService.getAllPurchaseOrders()

      setPurchaseOrders(updatedPurchaseOrders)
    } catch (error) {
      console.error('Reorder error:', error)

      setError(
        error.response?.status === 403
          ? 'Access Denied'
          : error.response?.data?.message ||
            'Failed to create reorder purchase order.'
      )
    }
  }

  const filteredMaterials = materials.filter((material) => {
    const searchValue = searchTerm.toLowerCase()

    const materialName = String(
      material.materialName || ''
    ).toLowerCase()

    const materialCode = String(
      material.materialCode || ''
    ).toLowerCase()

    const stockQuantity = Number(
      material.currentStock || 0
    )

    const matchesSearch =
      materialName.includes(searchValue) ||
      materialCode.includes(searchValue)

    const matchesStock =
      stockFilter === 'ALL' ||
      (stockFilter === 'IN_STOCK' && stockQuantity > 0) ||
      (stockFilter === 'LOW_STOCK' &&
        stockQuantity > 0 &&
        stockQuantity <= Number(material.reorderLevel || 0)) ||
      (stockFilter === 'OUT_OF_STOCK' &&
        stockQuantity === 0)

    return matchesSearch && matchesStock
  })

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      {loading && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          Loading inventory...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-gray-600">
          Loading inventory...
        </p>
      )}

      {!loading && error && (
        <p className="text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Inventory
            </h1>

            <p className="mt-1 text-gray-600">
              Monitor stock levels and inventory movements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                Total Materials
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalMaterials}
              </p>
            </div>

            <div className="rounded-lg bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                Total Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalStock}
              </p>
            </div>

            <div className="rounded-lg bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                Low Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {lowStockMaterialCount}
              </p>
            </div>

            <div className="rounded-lg bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                Inventory Value
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ₹{totalInventoryValue.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Search by material name or code..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 md:flex-1"
            />

            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 md:w-auto"
            >
              <option value="ALL">All Stock</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      ID
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Material Code
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Material Name
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Stock
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Reorder Level
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No materials found.
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((material) => {
                    const stockQuantity = Number(
                      material.currentStock || 0
                    )

                    const reorderLevel = Number(
                      material.reorderLevel || 0
                    )

                    let stockStatus = 'In Stock'

                    if (stockQuantity === 0) {
                      stockStatus = 'Out of Stock'
                    } else if (stockQuantity <= reorderLevel) {
                      stockStatus = 'Low Stock'
                    }

                    return (
                      <tr key={material.id}>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {material.id}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {material.materialCode || '—'}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {material.materialName || '—'}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {material.currentStock}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {reorderLevel}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          ₹{Number(material.price || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium">
                          {stockStatus}
                        </td>
                      </tr>
                    )
                  }) )}
                </tbody>
              </table>

              <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Low Stock / Reorder Required
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Materials that have reached or fallen below their reorder level.
                </p>

                {lowStockMaterials.length === 0 ? (
                  <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
                    All material stock levels are healthy.
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left">
                      <thead>
                        <tr className="border-b border-gray-200 text-sm text-gray-600">
                          <th className="px-4 py-3">Material</th>
                          <th className="px-4 py-3">Current Stock</th>
                          <th className="px-4 py-3">Reorder Level</th>
                          <th className="px-4 py-3">Quantity Needed</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {lowStockMaterialList.map((material) => {
                          const currentStock = Number(material.currentStock || 0)
                          const reorderLevel = Number(material.reorderLevel || 0)
                          const quantityNeeded = Math.max(
                            reorderLevel - currentStock,
                            0
                          )

                          return (
                            <tr
                              key={material.id}
                              className="border-b border-gray-100 text-sm"
                            >
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">
                                  {material.materialCode}
                                </div>
                                <div className="text-gray-500">
                                  {material.materialName}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                {currentStock}
                              </td>

                              <td className="px-4 py-3">
                                {reorderLevel}
                              </td>

                              <td className="px-4 py-3">
                                {quantityNeeded}
                              </td>

                              <td className="px-4 py-3">
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                  Reorder Required
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleReorder(material.id)}
                                  className="mt-2 rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                                >
                                  Reorder
                                </button>
                              </td>

                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => handleCreateReorderPO(material.id)}
                                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                  Create Reorder PO
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Alerts & Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Important inventory alerts and system notifications.
                </p>

                {lowStockMaterials.length === 0 ? (
                  <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                    <span className="font-semibold">INFO</span> — No active inventory alerts.
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {lowStockMaterials.map((material) => {
                    const severity =
                      Number(material.currentStock || 0) === 0
                        ? 'HIGH'
                        : 'MEDIUM'

                    return (
                      <div
                        key={material.id}
                        className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
                      >
                        <div className="font-semibold">
                          Low Stock Alert
                        </div>

                        <div className="mt-1">
                          <span className="font-medium">
                            Severity:
                          </span>{' '}
                          <span
                            className={
                              severity === 'HIGH'
                                ? 'font-semibold text-red-700'
                                : 'font-semibold text-yellow-700'
                            }
                          >
                            {severity}
                          </span>
                        </div>

                        <div className="mt-1">
                          {material.materialCode} - {material.materialName}
                        </div>

                        <div className="mt-1">
                          Current stock: {material.currentStock} | Reorder level:{' '}
                          {material.reorderLevel}
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Inventory Operations
                </h2>

                <p className="mt-1 text-gray-600">
                  Manage goods receipt and goods issue operations.
                </p>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Goods Issue
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Issue or consume material from inventory.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <select
                      className="rounded-md border border-gray-300 px-3 py-2"
                      value={selectedMaterialId}
                      onChange={(event) => setSelectedMaterialId(event.target.value)}
                    >
                      <option value="" disabled>
                        Select Material
                      </option>

                      {materials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.materialCode} - {material.materialName}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      placeholder="Enter quantity"
                      value={issueQuantity}
                      onChange={(event) => setIssueQuantity(event.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoodsIssue}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Issue Stock
                  </button>
                </div>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Goods Receipt
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Receive an ordered purchase order into inventory.
                  </p>

                  <select
                    className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2"
                    value={selectedPurchaseOrderId}
                    onChange={(event) =>
                      setSelectedPurchaseOrderId(event.target.value)
                    }
                  >
                    <option value="">
                      Select Purchase Order
                    </option>

                    {purchaseOrders.filter(
                      (purchaseOrder) => purchaseOrder.status === 'ORDERED'
                    ).length === 0 ? (
                      <option value="" disabled>
                        No ordered purchase orders available.
                      </option>
                    ) : (
                      purchaseOrders
                        .filter(
                          (purchaseOrder) => purchaseOrder.status === 'ORDERED'
                        )
                        .map((purchaseOrder) => (
                          <option
                            key={purchaseOrder.id}
                            value={purchaseOrder.id}
                          >
                            PO #{purchaseOrder.id} - {purchaseOrder.status}
                          </option>
                        ))
                    )}
                  </select>

                  <button
                    type="button"
                    onClick={handleGoodsReceipt}
                    className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Receive Goods
                  </button>
                </div>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Transaction History
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    View all inventory stock movements and transaction records.
                  </p>

                  <div className="mt-4">
                    <div className="mt-4 flex flex-col gap-3 md:flex-row">
                      <input
                        type="text"
                        placeholder="Search by material code or name..."
                        value={transactionSearchTerm}
                        onChange={(event) =>
                          setTransactionSearchTerm(event.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 md:flex-1"
                      />

                      <select
                        value={transactionTypeFilter}
                        onChange={(event) =>
                          setTransactionTypeFilter(event.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 md:w-56"
                      >
                        <option value="ALL">All Transactions</option>
                        <option value="GOODS_RECEIPT">Goods Receipt</option>
                        <option value="GOODS_ISSUE">Goods Issue</option>
                      </select>
                    </div>
                  </div>

                 <div className="mt-4 overflow-x-auto">
                  {transactionsLoading ? (
                    <div className="py-8 text-center text-gray-500">
                      Loading transaction history...
                    </div>
                  ) : (
                    <table className="w-full min-w-[1000px] text-left">
                      <thead>
                        <tr className="border-b border-gray-200 text-sm text-gray-600">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Material</th>
                          <th className="px-4 py-3">Transaction Type</th>
                          <th className="px-4 py-3">Old Stock</th>
                          <th className="px-4 py-3">Quantity</th>
                          <th className="px-4 py-3">New Stock</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">PO</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredTransactions.length === 0 ? (
                          <tr>
                            <td
                              colSpan="8"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No transactions found.
                            </td>
                          </tr>
                        ) : (
                          filteredTransactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b border-gray-100 text-sm"
                          >
                            <td className="px-4 py-3">
                              {transaction.id}
                            </td>

                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">
                                {transaction.material?.materialCode}
                              </div>
                              <div className="text-gray-500">
                                {transaction.material?.materialName}
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              {transaction.transactionType === 'GOODS_RECEIPT'
                                ? 'Goods Receipt'
                                : 'Goods Issue'}
                            </td>

                            <td className="px-4 py-3">
                              {transaction.oldStock}
                            </td>

                            <td className="px-4 py-3">
                              {transaction.transactionType === 'GOODS_RECEIPT'
                                ? `+${transaction.quantityChanged}`
                                : `-${transaction.quantityChanged}`}
                            </td>

                            <td className="px-4 py-3">
                              {transaction.newStock}
                            </td>

                            <td className="px-4 py-3">
                            {new Date(transaction.transactionDate).toLocaleString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </td>

                            <td className="px-4 py-3">
                              {transaction.purchaseOrder?.poNumber || '-'}
                            </td>
                          </tr>
                        ))
                        )}

                      </tbody>
                    </table>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Inventory