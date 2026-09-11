package com.erpassistant.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erpassistant.model.InventoryTransaction;
import com.erpassistant.model.Material;
import com.erpassistant.model.Vendor;
import com.erpassistant.repository.InventoryTransactionRepository;
import com.erpassistant.repository.MaterialRepository;
import com.erpassistant.repository.VendorRepository;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;

    private final VendorRepository vendorRepository;

    private final InventoryTransactionRepository inventoryTransactionRepository;

   public MaterialService(
        MaterialRepository materialRepository,
        VendorRepository vendorRepository,
        InventoryTransactionRepository inventoryTransactionRepository) {

    this.materialRepository = materialRepository;
    this.vendorRepository = vendorRepository;
    this.inventoryTransactionRepository = inventoryTransactionRepository;
}
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Material addMaterial(Material material) {
        return materialRepository.save(material);
    }

    public List<Material> getLowStockMaterials() {
        return materialRepository.findLowStockMaterials();
    }

    public Material updateStock(Long id, Integer newStock) {
    Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found"));

    material.setCurrentStock(newStock);

    return materialRepository.save(material);
    }

    public Integer getRecommendedReorderQuantity(Long id) {
    Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found"));

    int currentStock = material.getCurrentStock();
    int reorderLevel = material.getReorderLevel();

    if (currentStock >= reorderLevel) {
        return 0;
    }

    return reorderLevel - currentStock;
    }

   public java.util.Map<String, Object> getReorderRecommendationDetails(Long id) {

    Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found"));

    int currentStock = material.getCurrentStock();
    int reorderLevel = material.getReorderLevel();

    int recommendedQuantity = 0;
    String status = "STOCK OK";

    if (currentStock < reorderLevel) {
        recommendedQuantity = reorderLevel - currentStock;
        status = "LOW STOCK";
    }

    java.util.Map<String, Object> response = new java.util.HashMap<>();

    response.put("material", material.getMaterialName());
    response.put("currentStock", currentStock);
    response.put("reorderLevel", reorderLevel);
    response.put("status", status);
    response.put("recommendedOrderQuantity", recommendedQuantity);

    return response;
    }

    public java.util.Map<String, Object> getLowStockAlert(Long id) {

    Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found"));

    int currentStock = material.getCurrentStock();
    int reorderLevel = material.getReorderLevel();

    boolean alert = currentStock < reorderLevel;

    int recommendedQuantity = alert
            ? reorderLevel - currentStock
            : 0;

    java.util.Map<String, Object> response = new java.util.HashMap<>();

    response.put("alert", alert);
    response.put("message", alert ? "LOW STOCK ALERT" : "STOCK LEVEL OK");
    response.put("material", material.getMaterialName());
    response.put("currentStock", currentStock);
    response.put("reorderLevel", reorderLevel);
    response.put("recommendedOrderQuantity", recommendedQuantity);

    return response;
    }

    public Material assignVendor(Long materialId, Long vendorId) {

    Material material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found"));

    Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found"));

    material.setVendor(vendor);

    return materialRepository.save(material);
    }

    public Material consumeStock(Long materialId, Integer quantity) {

    Material material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found"));

    if (quantity <= 0) {
        throw new RuntimeException("Quantity must be greater than 0");
    }

    if (material.getCurrentStock() < quantity) {
        throw new RuntimeException("Insufficient stock");
    }

    int oldStock = material.getCurrentStock();
int newStock = oldStock - quantity;

material.setCurrentStock(newStock);

Material savedMaterial = materialRepository.save(material);

InventoryTransaction transaction = new InventoryTransaction();
transaction.setTransactionType("GOODS_ISSUE");
transaction.setOldStock(oldStock);
transaction.setQuantityChanged(quantity);
transaction.setNewStock(newStock);
transaction.setTransactionDate(java.time.LocalDateTime.now());
transaction.setMaterial(savedMaterial);
transaction.setPurchaseOrder(null);

inventoryTransactionRepository.save(transaction);

return savedMaterial;
    }
    public Material updateMaterial(Long id, Material updatedMaterial) {

        Material existingMaterial = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        existingMaterial.setMaterialName(updatedMaterial.getMaterialName());
        existingMaterial.setCategory(updatedMaterial.getCategory());
        existingMaterial.setPrice(updatedMaterial.getPrice());
        existingMaterial.setReorderLevel(updatedMaterial.getReorderLevel());

        return materialRepository.save(existingMaterial);
    }    
}    