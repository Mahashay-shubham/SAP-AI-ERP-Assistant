package com.erpassistant.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SapProductDto {

    @JsonProperty("Product")
    private String product;

    @JsonProperty("ProductType")
    private String productType;

    @JsonProperty("GrossWeight")
    private BigDecimal grossWeight;

    @JsonProperty("PurchaseOrderQuantityUnit")
    private String purchaseOrderQuantityUnit;

    @JsonProperty("WeightUnit")
    private String weightUnit;

    @JsonProperty("NetWeight")
    private BigDecimal netWeight;

    @JsonProperty("IsMarkedForDeletion")
    private Boolean isMarkedForDeletion;

    public SapProductDto() {
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public BigDecimal getGrossWeight() {
        return grossWeight;
    }

    public void setGrossWeight(BigDecimal grossWeight) {
        this.grossWeight = grossWeight;
    }

    public String getPurchaseOrderQuantityUnit() {
        return purchaseOrderQuantityUnit;
    }

    public void setPurchaseOrderQuantityUnit(String purchaseOrderQuantityUnit) {
        this.purchaseOrderQuantityUnit = purchaseOrderQuantityUnit;
    }

    public String getWeightUnit() {
        return weightUnit;
    }

    public void setWeightUnit(String weightUnit) {
        this.weightUnit = weightUnit;
    }

    public BigDecimal getNetWeight() {
        return netWeight;
    }

    public void setNetWeight(BigDecimal netWeight) {
        this.netWeight = netWeight;
    }

    public Boolean getIsMarkedForDeletion() {
        return isMarkedForDeletion;
    }

    public void setIsMarkedForDeletion(Boolean isMarkedForDeletion) {
        this.isMarkedForDeletion = isMarkedForDeletion;
    }
}