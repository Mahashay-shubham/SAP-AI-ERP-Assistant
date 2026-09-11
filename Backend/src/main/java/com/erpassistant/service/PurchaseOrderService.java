package com.erpassistant.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

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
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final MaterialRepository materialRepository;
    private final VendorRepository vendorRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository,
            MaterialRepository materialRepository,
            VendorRepository vendorRepository,
            InventoryTransactionRepository inventoryTransactionRepository) {

        this.purchaseOrderRepository = purchaseOrderRepository;
        this.materialRepository = materialRepository;
        this.vendorRepository = vendorRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder createPurchaseOrder(
            Long materialId,
            Long vendorId,
            Integer quantity) {

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        PurchaseOrder purchaseOrder = new PurchaseOrder();

        purchaseOrder.setPoNumber("PO-" + System.currentTimeMillis());
        purchaseOrder.setOrderDate(LocalDate.now());
        purchaseOrder.setStatus(PurchaseOrderStatus.CREATED);
        purchaseOrder.setQuantity(quantity);
        purchaseOrder.setMaterial(material);
        purchaseOrder.setVendor(vendor);

        double totalAmount = material.getPrice() * quantity;
        purchaseOrder.setTotalAmount(totalAmount);

        return purchaseOrderRepository.save(purchaseOrder);
    }

    public PurchaseOrder createAutomaticPurchaseOrder(Long materialId) {

    Material material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found"));

    int currentStock = material.getCurrentStock();
    int reorderLevel = material.getReorderLevel();

    // No PO required when stock is sufficient
    if (currentStock >= reorderLevel) {
        throw new RuntimeException("Stock level is sufficient. Purchase order not required.");
    }

    // Calculate required quantity automatically
    int quantity = reorderLevel - currentStock;

    // First use the vendor already assigned to the material
    Vendor vendor = material.getVendor();

    // If no vendor is assigned, use the highest-rated vendor
    if (vendor == null) {
        vendor = vendorRepository.findTopByOrderByRatingDesc()
                .orElseThrow(() -> new RuntimeException("No vendor available"));
    }

    return createPurchaseOrder(
            materialId,
            vendor.getId(),
            quantity
    );
  }

  public PurchaseOrder updatePurchaseOrder(
        Long id,
        Long vendorId,
        Integer quantity) {

PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
        .orElseThrow(() ->
                new RuntimeException("Purchase order not found"));

if (purchaseOrder.getStatus() != PurchaseOrderStatus.CREATED) {
        throw new RuntimeException(
                "Only CREATED purchase orders can be edited");
}

Vendor vendor = vendorRepository.findById(vendorId)
        .orElseThrow(() ->
                new RuntimeException("Vendor not found"));

Material material = purchaseOrder.getMaterial();

double totalAmount = material.getPrice() * quantity;

purchaseOrder.setVendor(vendor);
purchaseOrder.setQuantity(quantity);
purchaseOrder.setTotalAmount(totalAmount);

return purchaseOrderRepository.save(purchaseOrder);
}

  public PurchaseOrder approvePurchaseOrder(Long id) {

    PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Purchase order not found"));

    if (purchaseOrder.getStatus() != PurchaseOrderStatus.CREATED) {
        throw new RuntimeException(
                "Only purchase orders with CREATED status can be approved");
    }

    purchaseOrder.setStatus(PurchaseOrderStatus.APPROVED);

    return purchaseOrderRepository.save(purchaseOrder);
  }

  public PurchaseOrder markAsOrdered(Long id) {

    PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Purchase order not found"));

    if (purchaseOrder.getStatus() != PurchaseOrderStatus.APPROVED) {
        throw new RuntimeException(
                "Only APPROVED purchase orders can be marked as ORDERED");
    }

    purchaseOrder.setStatus(PurchaseOrderStatus.ORDERED);

    return purchaseOrderRepository.save(purchaseOrder);
  }

  public PurchaseOrder receivePurchaseOrder(Long id) {

    PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Purchase order not found"));

    if (purchaseOrder.getStatus() != PurchaseOrderStatus.ORDERED) {
        throw new RuntimeException(
                "Only ORDERED purchase orders can be received");
    }

    Material material = purchaseOrder.getMaterial();

int oldStock = material.getCurrentStock();
int receivedQuantity = purchaseOrder.getQuantity();
int newStock = oldStock + receivedQuantity;

material.setCurrentStock(newStock);

materialRepository.save(material);

// Create inventory transaction history
InventoryTransaction transaction = new InventoryTransaction();

transaction.setTransactionType("GOODS_RECEIPT");
transaction.setOldStock(oldStock);
transaction.setQuantityChanged(receivedQuantity);
transaction.setNewStock(newStock);
transaction.setTransactionDate(java.time.LocalDateTime.now());
transaction.setMaterial(material);
transaction.setPurchaseOrder(purchaseOrder);

inventoryTransactionRepository.save(transaction);

purchaseOrder.setStatus(PurchaseOrderStatus.RECEIVED);

return purchaseOrderRepository.save(purchaseOrder);
  }
}