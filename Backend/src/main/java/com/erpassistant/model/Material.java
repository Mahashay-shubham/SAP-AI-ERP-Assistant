package com.erpassistant.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
@Entity
@Table(name = "materials")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Material code is required")
    @Column(nullable = false, unique = true)
    private String materialCode;
    
    @NotBlank(message = "Material name is required")
    @Column(nullable = false)
    private String materialName;
        
    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price cannot be negative")
    private Double price;

    @NotNull(message = "Current stock is required")
    @PositiveOrZero(message = "Current stock cannot be negative")
    private Integer currentStock;

    @NotNull(message = "Reorder level is required")
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;

    // private String category;
    // private Double price;
    // private Integer currentStock;
    // private Integer reorderLevel;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    public Material() {
    }

    public Material(String materialCode, String materialName,
                    String category, Double price,
                    Integer currentStock, Integer reorderLevel) {

        this.materialCode = materialCode;
        this.materialName = materialName;
        this.category = category;
        this.price = price;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaterialCode() {
        return materialCode;
    }

    public void setMaterialCode(String materialCode) {
        this.materialCode = materialCode;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }
    
    public Vendor getVendor() {
    return vendor;
   }

   public void setVendor(Vendor vendor) {
    this.vendor = vendor;
   }

}