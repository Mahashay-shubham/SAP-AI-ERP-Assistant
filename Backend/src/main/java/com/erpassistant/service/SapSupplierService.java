package com.erpassistant.service;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.erpassistant.dto.SapSupplierDto;

@Service
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
public class SapSupplierService {

    private final SapSupplierConnector sapSupplierConnector;

    public SapSupplierService(SapSupplierConnector sapSupplierConnector) {
        this.sapSupplierConnector = sapSupplierConnector;
    }

    public List<SapSupplierDto> getSuppliers() {
        return sapSupplierConnector.getSuppliers();
    }
}