package com.erpassistant.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erpassistant.model.Material;
import com.erpassistant.service.MaterialService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Material addMaterial(
            @Valid @RequestBody Material material) {

        return materialService.addMaterial(material);
    }

    @GetMapping("/low-stock")
    public List<Material> getLowStockMaterials() {
        return materialService.getLowStockMaterials();
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Material updateStock(
        @PathVariable Long id,
        @RequestParam Integer newStock) {

    return materialService.updateStock(id, newStock);
    }

    @GetMapping("/{id}/reorder-recommendation")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Integer getReorderRecommendation(@PathVariable Long id) {
    return materialService.getRecommendedReorderQuantity(id);
    }

   @GetMapping("/{id}/reorder-details")
   public java.util.Map<String, Object> getReorderDetails(@PathVariable Long id) {
    return materialService.getReorderRecommendationDetails(id);
    }

    @GetMapping("/{id}/low-stock-alert")
    public java.util.Map<String, Object> getLowStockAlert(
        @PathVariable Long id) {

    return materialService.getLowStockAlert(id);
    }

    @PutMapping("/{materialId}/vendor/{vendorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Material assignVendor(
        @PathVariable Long materialId,
        @PathVariable Long vendorId) {

    return materialService.assignVendor(materialId, vendorId);
    }

    @PutMapping("/{id}/consume")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Material consumeStock(
        @PathVariable Long id,
        @RequestParam Integer quantity) {

    return materialService.consumeStock(id, quantity);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Material updateMaterial(
            @PathVariable Long id,
            @Valid @RequestBody Material material) {

        return materialService.updateMaterial(id, material);
    }
}