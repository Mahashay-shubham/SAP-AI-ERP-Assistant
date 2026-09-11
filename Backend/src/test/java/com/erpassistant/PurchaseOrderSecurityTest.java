package com.erpassistant;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.erpassistant.service.PurchaseOrderService;
import com.erpassistant.security.JwtService;
import com.erpassistant.security.CustomUserDetailsService;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PurchaseOrderSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PurchaseOrderService purchaseOrderService;
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @Test
    void employeeShouldNotCreatePurchaseOrder() throws Exception {

        mockMvc.perform(
                post("/api/purchase-orders")
                        .with(user("employee@test.com")
                                .roles("EMPLOYEE"))
                        .param("materialId", "1")
                        .param("vendorId", "1")
                        .param("quantity", "5")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    void managerShouldBeAllowedToCreatePurchaseOrder() throws Exception {

        mockMvc.perform(
                post("/api/purchase-orders")
                        .with(user("manager@test.com")
                                .roles("MANAGER"))
                        .param("materialId", "1")
                        .param("vendorId", "1")
                        .param("quantity", "5")
        )
        .andExpect(status().isOk());
    }
}