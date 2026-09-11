package com.erpassistant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.erpassistant.model.Material;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query("SELECT m FROM Material m WHERE m.currentStock < m.reorderLevel")
    List<Material> findLowStockMaterials();

}