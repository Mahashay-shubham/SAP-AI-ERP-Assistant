package com.erpassistant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erpassistant.model.InventoryTransaction;

@Repository
public interface InventoryTransactionRepository
        extends JpaRepository<InventoryTransaction, Long> {

}