package com.erpassistant.service;

import org.springframework.stereotype.Component;

import com.erpassistant.dto.SapProductDto;
import com.erpassistant.dto.SapPurchaseOrderDto;
import com.erpassistant.dto.SapSupplierDto;
import com.erpassistant.model.Material;
import com.erpassistant.model.PurchaseOrder;
import com.erpassistant.model.Vendor;

@Component
public class SapDataMapper {

    public Material mapProductToMaterial(SapProductDto sapProduct) {

        Material material = new Material();

        material.setMaterialCode(sapProduct.getProduct());
        material.setCategory(sapProduct.getProductType());

        return material;
    }

    public Vendor mapSupplierToVendor(SapSupplierDto sapSupplier) {

        Vendor vendor = new Vendor();

        vendor.setVendorCode(sapSupplier.getSupplier());
        vendor.setVendorName(sapSupplier.getSupplierName());

        return vendor;
    }

        public PurchaseOrder mapPurchaseOrder(SapPurchaseOrderDto sapPurchaseOrder) {

        PurchaseOrder purchaseOrder = new PurchaseOrder();

        purchaseOrder.setPoNumber(sapPurchaseOrder.getPurchaseOrder());
        purchaseOrder.setOrderDate(
                java.time.LocalDate.parse(sapPurchaseOrder.getPurchaseOrderDate())
        );

        Vendor vendor = new Vendor();
        vendor.setVendorCode(sapPurchaseOrder.getSupplier());

        purchaseOrder.setVendor(vendor);

        return purchaseOrder;
    }
}