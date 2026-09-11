package com.erpassistant.dto;

public class AnalyticsDto {

    private long totalMaterials;
    private long totalVendors;
    private long lowStockMaterials;
    private long totalInventoryTransactions;

    private long totalStockQuantity;
    private double totalInventoryValue;

    private long totalGoodsReceiptQuantity;
    private long totalGoodsIssueQuantity;

    private long goodsReceiptTransactions;
    private long goodsIssueTransactions;

    private long totalPurchaseOrders;
    private long receivedPurchaseOrders;
    private long pendingPurchaseOrders;
    private long createdPurchaseOrders;
    private long approvedPurchaseOrders;
    private long orderedPurchaseOrders;

    private double totalPurchaseOrderValue;
    private double receivedPurchaseOrderValue;
    private double pendingPurchaseOrderValue;

    public AnalyticsDto() {
    }

    public long getTotalMaterials() {
        return totalMaterials;
    }

    public void setTotalMaterials(long totalMaterials) {
        this.totalMaterials = totalMaterials;
    }

    public long getTotalVendors() {
    return totalVendors;
    }

    public void setTotalVendors(long totalVendors) {
        this.totalVendors = totalVendors;
    }

    public long getLowStockMaterials() {
        return lowStockMaterials;
    }

    public void setLowStockMaterials(long lowStockMaterials) {
        this.lowStockMaterials = lowStockMaterials;
    }

    public long getTotalInventoryTransactions() {
        return totalInventoryTransactions;
    }

    public void setTotalInventoryTransactions(long totalInventoryTransactions) {
        this.totalInventoryTransactions = totalInventoryTransactions;
    }

    public long getTotalStockQuantity() {
        return totalStockQuantity;
    }

    public void setTotalStockQuantity(long totalStockQuantity) {
        this.totalStockQuantity = totalStockQuantity;
    }

    public double getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(double totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public long getTotalGoodsReceiptQuantity() {
        return totalGoodsReceiptQuantity;
    }

    public void setTotalGoodsReceiptQuantity(long totalGoodsReceiptQuantity) {
        this.totalGoodsReceiptQuantity = totalGoodsReceiptQuantity;
    }

    public long getTotalGoodsIssueQuantity() {
        return totalGoodsIssueQuantity;
    }

    public void setTotalGoodsIssueQuantity(long totalGoodsIssueQuantity) {
        this.totalGoodsIssueQuantity = totalGoodsIssueQuantity;
    }

    public long getGoodsReceiptTransactions() {
        return goodsReceiptTransactions;
    }

    public void setGoodsReceiptTransactions(long goodsReceiptTransactions) {
        this.goodsReceiptTransactions = goodsReceiptTransactions;
    }

    public long getGoodsIssueTransactions() {
        return goodsIssueTransactions;
    }

    public void setGoodsIssueTransactions(long goodsIssueTransactions) {
        this.goodsIssueTransactions = goodsIssueTransactions;
    }

    public long getTotalPurchaseOrders() {
        return totalPurchaseOrders;
    }

    public void setTotalPurchaseOrders(long totalPurchaseOrders) {
        this.totalPurchaseOrders = totalPurchaseOrders;
    }

    public long getReceivedPurchaseOrders() {
        return receivedPurchaseOrders;
    }

    public void setReceivedPurchaseOrders(long receivedPurchaseOrders) {
        this.receivedPurchaseOrders = receivedPurchaseOrders;
    }

    public long getPendingPurchaseOrders() {
        return pendingPurchaseOrders;
    }

    public void setPendingPurchaseOrders(long pendingPurchaseOrders) {
        this.pendingPurchaseOrders = pendingPurchaseOrders;
    }

    public long getCreatedPurchaseOrders() {
        return createdPurchaseOrders;
    }

    public void setCreatedPurchaseOrders(long createdPurchaseOrders) {
        this.createdPurchaseOrders = createdPurchaseOrders;
    }

    public long getApprovedPurchaseOrders() {
        return approvedPurchaseOrders;
    }

    public void setApprovedPurchaseOrders(long approvedPurchaseOrders) {
        this.approvedPurchaseOrders = approvedPurchaseOrders;
    }

    public long getOrderedPurchaseOrders() {
        return orderedPurchaseOrders;
    }

    public void setOrderedPurchaseOrders(long orderedPurchaseOrders) {
        this.orderedPurchaseOrders = orderedPurchaseOrders;
    }

    public double getTotalPurchaseOrderValue() {
        return totalPurchaseOrderValue;
    }

    public void setTotalPurchaseOrderValue(double totalPurchaseOrderValue) {
        this.totalPurchaseOrderValue = totalPurchaseOrderValue;
    }

    public double getReceivedPurchaseOrderValue() {
        return receivedPurchaseOrderValue;
    }

    public void setReceivedPurchaseOrderValue(double receivedPurchaseOrderValue) {
        this.receivedPurchaseOrderValue = receivedPurchaseOrderValue;
    }

    public double getPendingPurchaseOrderValue() {
        return pendingPurchaseOrderValue;
    }

    public void setPendingPurchaseOrderValue(double pendingPurchaseOrderValue) {
        this.pendingPurchaseOrderValue = pendingPurchaseOrderValue;
    }
}