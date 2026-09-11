package com.erpassistant.controller;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpassistant.dto.SapProductDto;
import com.erpassistant.service.SapProductService;

@RestController
@ConditionalOnProperty(
        name = "sap.s4hana.enabled",
        havingValue = "true"
)
@RequestMapping("/api/sap")
public class SapProductController {

    private final SapProductService sapProductService;

    public SapProductController(SapProductService sapProductService) {
        this.sapProductService = sapProductService;
    }

    @GetMapping("/products")
    public List<SapProductDto> getProducts() {
        return sapProductService.getProducts();
    }
}