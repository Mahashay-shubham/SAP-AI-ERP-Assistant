package com.erpassistant.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erpassistant.dto.AnalyticsDto;
import com.erpassistant.model.InventoryTransaction;
import com.erpassistant.model.Material;
import com.erpassistant.model.PurchaseOrder;
import com.erpassistant.model.PurchaseOrderStatus;
import com.erpassistant.model.Vendor;
import com.erpassistant.repository.InventoryTransactionRepository;
import com.erpassistant.repository.MaterialRepository;
import com.erpassistant.repository.PurchaseOrderRepository;
import com.erpassistant.repository.VendorRepository;

@Service
public class AnalyticsService {

    private final MaterialRepository materialRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final VendorRepository vendorRepository;

    public AnalyticsService(
            MaterialRepository materialRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            InventoryTransactionRepository inventoryTransactionRepository,
            VendorRepository vendorRepository) {

        this.materialRepository = materialRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
        this.vendorRepository = vendorRepository;
    }

    public AnalyticsDto getAnalytics() {

        List<Material> materials = materialRepository.findAll();
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findAll();
        List<InventoryTransaction> transactions =
                inventoryTransactionRepository.findAll();
                List<Vendor> vendors = vendorRepository.findAll();

        AnalyticsDto analytics = new AnalyticsDto();

        long totalMaterials = materials.size();
        long totalVendors = vendors.size();

        long lowStockMaterials = materials.stream()
                .filter(m -> m.getCurrentStock() != null
                        && m.getReorderLevel() != null
                        && m.getCurrentStock() < m.getReorderLevel())
                .count();

        long totalStockQuantity = materials.stream()
                .filter(m -> m.getCurrentStock() != null)
                .mapToLong(m -> m.getCurrentStock())
                .sum();

        double totalInventoryValue = materials.stream()
                .filter(m -> m.getCurrentStock() != null
                        && m.getPrice() != null)
                .mapToDouble(m -> m.getCurrentStock() * m.getPrice())
                .sum();

        long totalGoodsReceiptQuantity = transactions.stream()
                .filter(t -> "GOODS_RECEIPT".equals(t.getTransactionType()))
                .filter(t -> t.getQuantityChanged() != null)
                .mapToLong(t -> Math.abs(t.getQuantityChanged()))
                .sum();

        long totalGoodsIssueQuantity = transactions.stream()
                .filter(t -> "GOODS_ISSUE".equals(t.getTransactionType()))
                .filter(t -> t.getQuantityChanged() != null)
                .mapToLong(t -> Math.abs(t.getQuantityChanged()))
                .sum();

        long goodsReceiptTransactions = transactions.stream()
                .filter(t -> "GOODS_RECEIPT".equals(t.getTransactionType()))
                .count();

        long goodsIssueTransactions = transactions.stream()
                .filter(t -> "GOODS_ISSUE".equals(t.getTransactionType()))
                .count();

        long totalPurchaseOrders = purchaseOrders.size();

        long receivedPurchaseOrders = purchaseOrders.stream()
                .filter(po -> PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
                .count();

        long pendingPurchaseOrders = purchaseOrders.stream()
                .filter(po -> !PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
                .count();

        long createdPurchaseOrders = purchaseOrders.stream()
                .filter(po -> PurchaseOrderStatus.CREATED.equals(po.getStatus()))
                .count();

        long approvedPurchaseOrders = purchaseOrders.stream()
                .filter(po -> PurchaseOrderStatus.APPROVED.equals(po.getStatus()))
                .count();

        long orderedPurchaseOrders = purchaseOrders.stream()
                .filter(po -> PurchaseOrderStatus.ORDERED.equals(po.getStatus()))
                .count();

        double totalPurchaseOrderValue = purchaseOrders.stream()
                .filter(po -> po.getTotalAmount() != null)
                .mapToDouble(PurchaseOrder::getTotalAmount)
                .sum();

        double receivedPurchaseOrderValue = purchaseOrders.stream()
                .filter(po -> PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
                .filter(po -> po.getTotalAmount() != null)
                .mapToDouble(PurchaseOrder::getTotalAmount)
                .sum();

        double pendingPurchaseOrderValue = purchaseOrders.stream()
                .filter(po -> !PurchaseOrderStatus.RECEIVED.equals(po.getStatus()))
                .filter(po -> po.getTotalAmount() != null)
                .mapToDouble(PurchaseOrder::getTotalAmount)
                .sum();

        analytics.setTotalMaterials(totalMaterials);
        analytics.setTotalVendors(totalVendors);
        analytics.setLowStockMaterials(lowStockMaterials);
        analytics.setTotalInventoryTransactions(transactions.size());

        analytics.setTotalStockQuantity(totalStockQuantity);
        analytics.setTotalInventoryValue(totalInventoryValue);

        analytics.setTotalGoodsReceiptQuantity(totalGoodsReceiptQuantity);
        analytics.setTotalGoodsIssueQuantity(totalGoodsIssueQuantity);

        analytics.setGoodsReceiptTransactions(goodsReceiptTransactions);
        analytics.setGoodsIssueTransactions(goodsIssueTransactions);

        analytics.setTotalPurchaseOrders(totalPurchaseOrders);
        analytics.setReceivedPurchaseOrders(receivedPurchaseOrders);
        analytics.setPendingPurchaseOrders(pendingPurchaseOrders);
        analytics.setCreatedPurchaseOrders(createdPurchaseOrders);
        analytics.setApprovedPurchaseOrders(approvedPurchaseOrders);
        analytics.setOrderedPurchaseOrders(orderedPurchaseOrders);

        analytics.setTotalPurchaseOrderValue(totalPurchaseOrderValue);
        analytics.setReceivedPurchaseOrderValue(receivedPurchaseOrderValue);
        analytics.setPendingPurchaseOrderValue(pendingPurchaseOrderValue);

        return analytics;
    }
}