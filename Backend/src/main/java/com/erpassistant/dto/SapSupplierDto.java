package com.erpassistant.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SapSupplierDto {

    @JsonProperty("Supplier")
    private String supplier;

    @JsonProperty("BusinessPartner")
    private String businessPartner;

    @JsonProperty("SupplierAccountGroup")
    private String supplierAccountGroup;

    @JsonProperty("SupplierName")
    private String supplierName;

    public SapSupplierDto() {
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public String getBusinessPartner() {
        return businessPartner;
    }

    public void setBusinessPartner(String businessPartner) {
        this.businessPartner = businessPartner;
    }

    public String getSupplierAccountGroup() {
        return supplierAccountGroup;
    }

    public void setSupplierAccountGroup(String supplierAccountGroup) {
        this.supplierAccountGroup = supplierAccountGroup;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }
}