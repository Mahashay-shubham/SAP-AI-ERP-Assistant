package com.erpassistant.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;

// @Service("openAIProvider")
public class OpenAIProvider implements AIProvider {

    private final RestClient restClient;

    public OpenAIProvider(
            @Value("${OPENAI_API_KEY:}") String apiKey) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "OPENAI_API_KEY environment variable is not set."
            );
        }

        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(
                        "Authorization",
                        "Bearer " + apiKey
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
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                )
        );

        Map<String, Object> response =
                restClient.post()
                        .uri("/chat/completions")
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

        List<Map<String, Object>> choices =
                (List<Map<String, Object>>) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new IllegalStateException(
                    "OpenAI returned no response choices."
            );
        }

        Map<String, Object> firstChoice = choices.get(0);

        Map<String, Object> message =
                (Map<String, Object>) firstChoice.get("message");

        return (String) message.get("content");
    }
}