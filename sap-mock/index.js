const express = require("express");

const app = express();
const PORT = 3001;

const products = [
    {
        Product: "PRD-10001",
        ProductType: "FERT",
        GrossWeight: "12.500",
        PurchaseOrderQuantityUnit: "EA",
        WeightUnit: "KG",
        NetWeight: "12.000",
        IsMarkedForDeletion: false
    },
    {
        Product: "PRD-10002",
        ProductType: "HALB",
        GrossWeight: "8.200",
        PurchaseOrderQuantityUnit: "EA",
        WeightUnit: "KG",
        NetWeight: "7.900",
        IsMarkedForDeletion: false
    },
    {
        Product: "PRD-10003",
        ProductType: "ROH",
        GrossWeight: "5.500",
        PurchaseOrderQuantityUnit: "EA",
        WeightUnit: "KG",
        NetWeight: "5.200",
        IsMarkedForDeletion: false
    }
];

app.get(
    "/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product",
    (req, res) => {
        res.json({
            d: {
                __count: String(products.length),
                results: products
            }
        });
    }
);

app.listen(PORT, () => {
    console.log(`Mock SAP server running on http://localhost:${PORT}`);
});

app.get("/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier", (req, res) => {
    res.json({
        d: {
            __count: "3",
            results: [
                {
                    Supplier: "SUP-10001",
                    BusinessPartner: "BP-10001",
                    SupplierAccountGroup: "0001",
                    SupplierName: "ABC Suppliers"
                },
                {
                    Supplier: "SUP-10002",
                    BusinessPartner: "BP-10002",
                    SupplierAccountGroup: "0002",
                    SupplierName: "Global Industrial Supplies"
                },
                {
                    Supplier: "SUP-10003",
                    BusinessPartner: "BP-10003",
                    SupplierAccountGroup: "0001",
                    SupplierName: "Prime Materials Ltd"
                }
            ]
        }
    });
});

const purchaseOrders = [
    {
        PurchaseOrder: "4500001001",
        PurchaseOrderType: "NB",
        PurchaseOrderDate: "2026-09-01",
        Supplier: "SUP-10001",
        CompanyCode: "1000",
        PurchasingOrganization: "1000",
        PurchasingGroup: "001",
        DocumentCurrency: "INR"
    },
    {
        PurchaseOrder: "4500001002",
        PurchaseOrderType: "NB",
        PurchaseOrderDate: "2026-09-02",
        Supplier: "SUP-10002",
        CompanyCode: "1000",
        PurchasingOrganization: "1000",
        PurchasingGroup: "002",
        DocumentCurrency: "INR"
    },
    {
        PurchaseOrder: "4500001003",
        PurchaseOrderType: "NB",
        PurchaseOrderDate: "2026-09-03",
        Supplier: "SUP-10003",
        CompanyCode: "1000",
        PurchasingOrganization: "1000",
        PurchasingGroup: "001",
        DocumentCurrency: "INR"
    }
];

app.get("/PurchaseOrder", (req, res) => {
    res.json({
        "@odata.context": "$metadata#PurchaseOrder",
        value: purchaseOrders
    });
});