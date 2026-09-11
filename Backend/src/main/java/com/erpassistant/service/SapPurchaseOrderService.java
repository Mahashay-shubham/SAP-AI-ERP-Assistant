package com.erpassistant.service;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.erpassistant.dto.SapPurchaseOrderDto;

@Service
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
public class SapPurchaseOrderService {

    private final SapPurchaseOrderConnector sapPurchaseOrderConnector;

    public SapPurchaseOrderService(
            SapPurchaseOrderConnector sapPurchaseOrderConnector) {
        this.sapPurchaseOrderConnector = sapPurchaseOrderConnector;
    }

    public List<SapPurchaseOrderDto> getPurchaseOrders() {
        return sapPurchaseOrderConnector.getPurchaseOrders();
    }
}