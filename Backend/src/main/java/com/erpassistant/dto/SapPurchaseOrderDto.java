package com.erpassistant.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SapPurchaseOrderDto {

    @JsonProperty("PurchaseOrder")
    private String purchaseOrder;

    @JsonProperty("PurchaseOrderType")
    private String purchaseOrderType;

    @JsonProperty("PurchaseOrderDate")
    private String purchaseOrderDate;

    @JsonProperty("Supplier")
    private String supplier;

    @JsonProperty("CompanyCode")
    private String companyCode;

    @JsonProperty("PurchasingOrganization")
    private String purchasingOrganization;

    @JsonProperty("PurchasingGroup")
    private String purchasingGroup;

    @JsonProperty("DocumentCurrency")
    private String documentCurrency;

    public SapPurchaseOrderDto() {
    }

    public String getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(String purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }

    public String getPurchaseOrderType() {
        return purchaseOrderType;
    }

    public void setPurchaseOrderType(String purchaseOrderType) {
        this.purchaseOrderType = purchaseOrderType;
    }

    public String getPurchaseOrderDate() {
        return purchaseOrderDate;
    }

    public void setPurchaseOrderDate(String purchaseOrderDate) {
        this.purchaseOrderDate = purchaseOrderDate;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getPurchasingOrganization() {
        return purchasingOrganization;
    }

    public void setPurchasingOrganization(String purchasingOrganization) {
        this.purchasingOrganization = purchasingOrganization;
    }

    public String getPurchasingGroup() {
        return purchasingGroup;
    }

    public void setPurchasingGroup(String purchasingGroup) {
        this.purchasingGroup = purchasingGroup;
    }

    public String getDocumentCurrency() {
        return documentCurrency;
    }

    public void setDocumentCurrency(String documentCurrency) {
        this.documentCurrency = documentCurrency;
    }
}