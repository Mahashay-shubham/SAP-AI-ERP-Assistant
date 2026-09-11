package com.erpassistant.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service("geminiAIProvider")
public class GeminiAIProvider implements AIProvider {

    private final RestClient restClient;

    public GeminiAIProvider(
            @Value("${GEMINI_API_KEY:}") String apiKey) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "GEMINI_API_KEY environment variable is not set."
            );
        }

        this.restClient = RestClient.builder()
                .baseUrl(
                        "https://generativelanguage.googleapis.com/v1beta"
                )
                .defaultHeader(
                        "x-goog-api-key",
                        apiKey
                )
                .defaultHeader(
                        "Content-Type",
                        "application/json"
                )
                .build();
    }

    @Override
    public String generateResponse(String prompt) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        Map<String, Object> response =
                restClient.post()
                        .uri("/models/gemini-3.6-flash:generateContent")
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException(
                    "Gemini returned no response candidates."
            );
        }

        Map<String, Object> content =
                (Map<String, Object>) candidates.get(0).get("content");

        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            throw new IllegalStateException(
                    "Gemini returned no response content."
            );
        }

        return (String) parts.get(0).get("text");
    }
}