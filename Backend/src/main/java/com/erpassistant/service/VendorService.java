package com.erpassistant.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erpassistant.model.Vendor;
import com.erpassistant.repository.VendorRepository;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor addVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public Vendor updateVendor(Long id, Vendor updatedVendor) {
        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vendor not found with id: " + id)
                );

        existingVendor.setVendorCode(updatedVendor.getVendorCode());
        existingVendor.setVendorName(updatedVendor.getVendorName());
        existingVendor.setEmail(updatedVendor.getEmail());
        existingVendor.setPhone(updatedVendor.getPhone());
        existingVendor.setRating(updatedVendor.getRating());

        return vendorRepository.save(existingVendor);
    }

    public void deleteVendor(Long id) {
        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vendor not found with id: " + id)
                );

        vendorRepository.delete(existingVendor);
    }

    public Vendor getRecommendedVendor() {
    return vendorRepository.findTopByOrderByRatingDesc()
            .orElseThrow(() -> new RuntimeException("No vendors available"));
    }
}