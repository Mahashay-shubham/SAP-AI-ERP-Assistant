package com.erpassistant.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erpassistant.model.Material;

@Service
public class ERPContextService {

    private final MaterialService materialService;

    public ERPContextService(MaterialService materialService) {
        this.materialService = materialService;
    }

    public String getMaterialContext() {

        List<Material> materials = materialService.getAllMaterials();

        if (materials.isEmpty()) {
            return "No material data is currently available in the ERP system.";
        }

        StringBuilder context = new StringBuilder();

        context.append("ERP MATERIAL DATA:\n");

        for (Material material : materials) {

            context.append("Material Code: ")
                    .append(material.getMaterialCode())
                    .append("\n");

            context.append("Material Name: ")
                    .append(material.getMaterialName())
                    .append("\n");

            context.append("Category: ")
                    .append(material.getCategory())
                    .append("\n");

            context.append("Price: ")
                    .append(material.getPrice())
                    .append("\n");

            context.append("Current Stock: ")
                    .append(material.getCurrentStock())
                    .append("\n");

            context.append("Reorder Level: ")
                    .append(material.getReorderLevel())
                    .append("\n");

            context.append("---\n");
        }

        return context.toString();
    }

    public String getMaterialContextByCode(String materialCode) {

        List<Material> materials = materialService.getAllMaterials();

        for (Material material : materials) {

                if (material.getMaterialCode().equalsIgnoreCase(materialCode)) {

                StringBuilder context = new StringBuilder();

                context.append("ERP MATERIAL DATA:\n");

                context.append("Material Code: ")
                        .append(material.getMaterialCode())
                        .append("\n");

                context.append("Material Name: ")
                        .append(material.getMaterialName())
                        .append("\n");

                context.append("Category: ")
                        .append(material.getCategory())
                        .append("\n");

                context.append("Price: ")
                        .append(material.getPrice())
                        .append("\n");

                context.append("Current Stock: ")
                        .append(material.getCurrentStock())
                        .append("\n");

                context.append("Reorder Level: ")
                        .append(material.getReorderLevel())
                        .append("\n");

                return context.toString();
                }
        }

        return "No material was found with material code: " + materialCode;
   }
}