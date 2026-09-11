package com.erpassistant.service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final AIProvider aiProvider;
    private final ERPContextService erpContextService;

    public AIService(
            @Qualifier("geminiAIProvider") AIProvider aiProvider,
            ERPContextService erpContextService) {

        this.aiProvider = aiProvider;
        this.erpContextService = erpContextService;
    }

    public String askAI(String question) {

        String erpContext;

        Pattern pattern = Pattern.compile(
                "\\bMAT-[A-Za-z0-9-]+\\b",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(question);

        if (matcher.find()) {

            String materialCode = matcher.group();

            erpContext =
                    erpContextService.getMaterialContextByCode(materialCode);

        } else {

            erpContext =
                    erpContextService.getMaterialContext();
        }

        String promptText =
                "You are an AI ERP Assistant.\n\n"
                + "Your job is to answer the user's ERP-related question using the ERP "
                + "data provided below.\n\n"
                + "ERP GROUNDING RULES:\n"
                + "1. Use the provided ERP context as the source of truth for ERP data.\n"
                + "2. Do not invent or assume ERP facts such as stock, prices, materials, "
                + "vendors, purchase orders, or transactions.\n"
                + "3. If the requested ERP information is not present in the context, "
                + "clearly state that the information is not available in the provided ERP data.\n"
                + "4. You may perform simple calculations, comparisons, and reasoning "
                + "using the provided ERP data.\n"
                + "5. Give a clear and concise business-oriented answer.\n\n"
                + "ERP CONTEXT:\n"
                + erpContext
                + "\n\nUSER QUESTION:\n"
                + question;

        return aiProvider.generateResponse(promptText);
    }
}