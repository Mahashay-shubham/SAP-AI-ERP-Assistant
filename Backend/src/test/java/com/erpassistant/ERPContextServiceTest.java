package com.erpassistant;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.erpassistant.service.ERPContextService;

@SpringBootTest
class ERPContextServiceTest {

    @Autowired
    private ERPContextService erpContextService;

    @Test
    void shouldRetrieveMaterialContext() {

        String context = erpContextService.getMaterialContext();

        assertNotNull(context);

        System.out.println("\n===== ERP MATERIAL CONTEXT =====");
        System.out.println(context);
        System.out.println("===== END ERP MATERIAL CONTEXT =====\n");
    }
}