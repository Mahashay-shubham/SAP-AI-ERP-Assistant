package com.erpassistant.service;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.erpassistant.dto.SapSupplierDto;
import com.fasterxml.jackson.annotation.JsonProperty;

@Component
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
public class SapSupplierConnector {

    private final RestClient sapRestClient;

    public SapSupplierConnector(RestClient sapRestClient) {
        this.sapRestClient = sapRestClient;
    }

    public List<SapSupplierDto> getSuppliers() {

        SapSupplierResponse response = sapRestClient
                .get()
                .uri("/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier?$top=50")
                .header("Accept", "application/json")
                .retrieve()
                .body(SapSupplierResponse.class);

        return response.getD().getResults();
    }

    private static class SapSupplierResponse {

        private SapSupplierData d;

        public SapSupplierData getD() {
            return d;
        }
        
        @SuppressWarnings("unused")
        public void setD(SapSupplierData d) {
            this.d = d;
        }
    }

    private static class SapSupplierData {

        @JsonProperty("results")
        private List<SapSupplierDto> results;

        public List<SapSupplierDto> getResults() {
            return results;
        }
        
        @SuppressWarnings("unused")
        public void setResults(List<SapSupplierDto> results) {
            this.results = results;
        }
    }
}