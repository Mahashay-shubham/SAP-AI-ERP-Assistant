package com.erpassistant.service;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.erpassistant.dto.SapPurchaseOrderDto;

@Component
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
public class SapPurchaseOrderConnector {

    private final RestClient sapRestClient;

    public SapPurchaseOrderConnector(RestClient sapRestClient) {
        this.sapRestClient = sapRestClient;
    }

    public List<SapPurchaseOrderDto> getPurchaseOrders() {

        SapPurchaseOrderResponse response = sapRestClient
                .get()
                .uri("/PurchaseOrder?$top=50")
                .header("Accept", "application/json")
                .retrieve()
                .body(SapPurchaseOrderResponse.class);

        return response.getValue();
    }

    private static class SapPurchaseOrderResponse {

        private List<SapPurchaseOrderDto> value;

        public List<SapPurchaseOrderDto> getValue() {
            return value;
        }
        
        @SuppressWarnings("unused")
        public void setValue(List<SapPurchaseOrderDto> value) {
            this.value = value;
        }
        
    }
}