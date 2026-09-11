package com.erpassistant.service;

import org.springframework.stereotype.Service;

@Service("localAIProvider")
public class LocalAIProvider implements AIProvider {

    @Override
    public String generateResponse(String prompt) {

        return "Local AI Provider is active. "
                + "ERP context has been successfully prepared for AI processing.\n\n"
                + "Prompt received:\n"
                + prompt;
    }
}