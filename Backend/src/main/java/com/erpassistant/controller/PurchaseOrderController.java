package com.erpassistant.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.erpassistant.model.PurchaseOrder;
import com.erpassistant.service.PurchaseOrderService;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public PurchaseOrder createPurchaseOrder(
            @RequestParam Long materialId,
            @RequestParam Long vendorId,
            @RequestParam Integer quantity) {

        return purchaseOrderService.createPurchaseOrder(
                materialId,
                vendorId,
                quantity
        );
    }

    @PostMapping("/auto/{materialId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public PurchaseOrder createAutomaticPurchaseOrder(
        @PathVariable Long materialId) {

    return purchaseOrderService
            .createAutomaticPurchaseOrder(materialId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public PurchaseOrder updatePurchaseOrder(
            @PathVariable Long id,
            @RequestParam Long vendorId,
            @RequestParam Integer quantity) {

        return purchaseOrderService.updatePurchaseOrder(
                id,
                vendorId,
                quantity
        );
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public PurchaseOrder approvePurchaseOrder(@PathVariable Long id) {
    return purchaseOrderService.approvePurchaseOrder(id);
    }

    @PutMapping("/{id}/mark-as-ordered")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public PurchaseOrder markAsOrdered(@PathVariable Long id) {
        return purchaseOrderService.markAsOrdered(id);
    }

    @PutMapping("/{id}/receive")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public PurchaseOrder receivePurchaseOrder(@PathVariable Long id) {
        return purchaseOrderService.receivePurchaseOrder(id);
    }
}