package com.erpassistant.controller;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpassistant.dto.SapSupplierDto;
import com.erpassistant.service.SapSupplierService;

@RestController
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
@RequestMapping("/api/sap")
public class SapSupplierController {

    private final SapSupplierService sapSupplierService;

    public SapSupplierController(SapSupplierService sapSupplierService) {
        this.sapSupplierService = sapSupplierService;
    }

    @GetMapping("/suppliers")
    public List<SapSupplierDto> getSuppliers() {
        return sapSupplierService.getSuppliers();
    }
}