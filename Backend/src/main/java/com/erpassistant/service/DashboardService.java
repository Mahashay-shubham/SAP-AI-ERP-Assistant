package com.erpassistant.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.erpassistant.model.InventoryTransaction;
import com.erpassistant.model.Material;
import com.erpassistant.model.PurchaseOrder;
import com.erpassistant.model.PurchaseOrderStatus;
import com.erpassistant.repository.InventoryTransactionRepository;
import com.erpassistant.repository.MaterialRepository;
import com.erpassistant.repository.PurchaseOrderRepository;

@Service
public class DashboardService {

    private final MaterialRepository materialRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public DashboardService(
            MaterialRepository materialRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            InventoryTransactionRepository inventoryTransactionRepository) {

        this.materialRepository = materialRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    public Map<String, Object> getDashboardSummary() {

        List<Material> materials = materialRepository.findAll();
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findAll();
        List<InventoryTransaction> transactions = inventoryTransactionRepository.findAll();

        long totalStockQuantity = materials.stream()
        .mapToLong(material -> material.getCurrentStock())
        .sum();

        double totalInventoryValue = materials.stream()
        .mapToDouble(m -> m.getCurrentStock() * m.getPrice())
        .sum();

        long totalGoodsReceiptQuantity = transactions.stream()
        .filter(t -> "GOODS_RECEIPT".equals(t.getTransactionType()))
        .mapToLong(t -> Math.abs(t.getQuantityChanged()))
        .sum();

        long totalGoodsIssueQuantity = transactions.stream()
        .filter(t -> "GOODS_ISSUE".equals(t.getTransactionType()))
        .mapToLong(t -> Math.abs(t.getQuantityChanged()))
        .sum();

        long goodsReceiptCount = transactions.stream()
        .filter(t -> "GOODS_RECEIPT".equals(t.getTransactionType()))
        .count();

        long goodsIssueCount = transactions.stream()
        .filter(t -> "GOODS_ISSUE".equals(t.getTransactionType()))
        .count();

        long lowStockCount = materials.stream()
                .filter(m -> m.getCurrentStock() < m.getReorderLevel())
                .count();

        List<Material> lowStockMaterialDetails = materials.stream()
        .filter(m -> m.getCurrentStock() < m.getReorderLevel())
        .toList();

        long receivedOrders = purchaseOrders.stream()
                .filter(po -> PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
                .count();
        long pendingOrders = purchaseOrders.stream()
        .filter(po -> !PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
        .count();

        long createdOrders = purchaseOrders.stream()
        .filter(po -> PurchaseOrderStatus.CREATED.equals(po.getStatus()))
        .count();

        long approvedOrders = purchaseOrders.stream()
        .filter(po -> PurchaseOrderStatus.APPROVED.equals(po.getStatus()))
        .count();

        long orderedOrders = purchaseOrders.stream()
        .filter(po -> PurchaseOrderStatus.ORDERED.equals(po.getStatus()))
        .count();

        double totalPurchaseOrderValue = purchaseOrders.stream()
        .filter(po -> po.getTotalAmount() != null)
        .mapToDouble(po -> po.getTotalAmount())
        .sum();

        double receivedPurchaseOrderValue = purchaseOrders.stream()
        .filter(po -> PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
        .filter(po -> po.getTotalAmount() != null)
        .mapToDouble(po -> po.getTotalAmount())
        .sum();

        double pendingPurchaseOrderValue = purchaseOrders.stream()
        .filter(po -> !PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
        .filter(po -> po.getTotalAmount() != null)
        .mapToDouble(po -> po.getTotalAmount())
        .sum();
                
        Map<String, Object> summary = new HashMap<>();

        summary.put("totalMaterials", materials.size());
        summary.put("lowStockMaterials", lowStockCount);
        summary.put("lowStockMaterialDetails", lowStockMaterialDetails);
        summary.put(
        "alertMessage",
        lowStockCount > 0
                ? "LOW STOCK ALERT: " + lowStockCount + " material(s) need attention"
                : "All material stock levels are OK");
        summary.put("totalPurchaseOrders", purchaseOrders.size());
        summary.put("receivedPurchaseOrders", receivedOrders);
        summary.put("pendingPurchaseOrders", pendingOrders);
        summary.put("createdPurchaseOrders", createdOrders);
        summary.put("approvedPurchaseOrders", approvedOrders);
        summary.put("orderedPurchaseOrders", orderedOrders);
        summary.put("totalInventoryTransactions",
        inventoryTransactionRepository.count());
        summary.put("goodsReceiptTransactions", goodsReceiptCount);
        summary.put("goodsIssueTransactions", goodsIssueCount);
        summary.put("totalStockQuantity", totalStockQuantity);
        summary.put("totalInventoryValue", totalInventoryValue);
        summary.put("totalGoodsReceiptQuantity", totalGoodsReceiptQuantity);
        summary.put("totalGoodsIssueQuantity", totalGoodsIssueQuantity);
        summary.put("totalPurchaseOrderValue", totalPurchaseOrderValue);
        summary.put("receivedPurchaseOrderValue", receivedPurchaseOrderValue);
        summary.put("pendingPurchaseOrderValue", pendingPurchaseOrderValue);

        return summary;
    }
}