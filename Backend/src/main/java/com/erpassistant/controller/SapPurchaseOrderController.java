package com.erpassistant.controller;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpassistant.dto.SapPurchaseOrderDto;
import com.erpassistant.service.SapPurchaseOrderService;

@RestController
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
@RequestMapping("/api/sap")
public class SapPurchaseOrderController {

    private final SapPurchaseOrderService sapPurchaseOrderService;

    public SapPurchaseOrderController(
            SapPurchaseOrderService sapPurchaseOrderService) {
        this.sapPurchaseOrderService = sapPurchaseOrderService;
    }

    @GetMapping("/purchase-orders")
    public List<SapPurchaseOrderDto> getPurchaseOrders() {
        return sapPurchaseOrderService.getPurchaseOrders();
    }
}