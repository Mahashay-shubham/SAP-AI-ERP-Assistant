package com.erpassistant.service;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.erpassistant.dto.SapProductDto;

@Service
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
public class SapProductService {

    private final SapProductConnector sapProductConnector;

    public SapProductService(SapProductConnector sapProductConnector) {
        this.sapProductConnector = sapProductConnector;
    }

    public List<SapProductDto> getProducts() {
        return sapProductConnector.getProducts();
    }
}