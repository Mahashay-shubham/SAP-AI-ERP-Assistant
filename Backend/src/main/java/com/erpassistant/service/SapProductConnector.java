package com.erpassistant.service;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.erpassistant.dto.SapProductDto;
import com.fasterxml.jackson.annotation.JsonProperty;

@Component
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
public class SapProductConnector {

    private final RestClient sapRestClient;

    public SapProductConnector(RestClient sapRestClient) {
        this.sapRestClient = sapRestClient;
    }

    public List<SapProductDto> getProducts() {

        SapProductResponse response = sapRestClient
                .get()
                .uri("/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product?$top=50")
                .header("Accept", "application/json")
                .retrieve()
                .body(SapProductResponse.class);

        return response.getD().getResults();
    }

    private static class SapProductResponse {

        private SapProductData d;

        public SapProductData getD() {
            return d;
        }

        @SuppressWarnings("unused")
        public void setD(SapProductData d) {
            this.d = d;
        }
    }

    private static class SapProductData {

        @JsonProperty("results")
        private List<SapProductDto> results;

        public List<SapProductDto> getResults() {
            return results;
        }

        @SuppressWarnings("unused")
        public void setResults(List<SapProductDto> results) {
            this.results = results;
        }
    }
}