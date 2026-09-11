package com.erpassistant.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erpassistant.model.InventoryTransaction;
import com.erpassistant.repository.InventoryTransactionRepository;

@Service
public class InventoryTransactionService {

    private final InventoryTransactionRepository inventoryTransactionRepository;

    public InventoryTransactionService(
            InventoryTransactionRepository inventoryTransactionRepository) {

        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    public List<InventoryTransaction> getAllTransactions() {
        return inventoryTransactionRepository.findAll();
    }
}