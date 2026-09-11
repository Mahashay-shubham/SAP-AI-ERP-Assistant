package com.erpassistant.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpassistant.model.InventoryTransaction;
import com.erpassistant.service.InventoryTransactionService;


@RestController
@RequestMapping("/api/inventory-transactions")
public class InventoryTransactionController {

    private final InventoryTransactionService inventoryTransactionService;

    public InventoryTransactionController(
            InventoryTransactionService inventoryTransactionService) {

        this.inventoryTransactionService = inventoryTransactionService;
    }

    @GetMapping
    public List<InventoryTransaction> getAllTransactions() {
        return inventoryTransactionService.getAllTransactions();
    }
}