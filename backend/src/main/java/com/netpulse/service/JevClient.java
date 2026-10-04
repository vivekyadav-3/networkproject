package com.netpulse.service;

import com.netpulse.dto.JevDecisionRequest;
import com.netpulse.dto.JevDecisionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class JevClient {

    private static final Logger log = LoggerFactory.getLogger(JevClient.class);

    private final RestClient restClient;
    private final String apiUrl;
    private final String apiKey;

    public JevClient(RestClient.Builder restClientBuilder,
            @Value("${jev.api.url:https://api.typesafe.ai/v1/systemone}") String apiUrl,
            @Value("${jev.api.key:apikey_2449698bc53f7af4d9b82d1c5bf54bcacb0_ffe1de3d81523d92b0569d799866262d6d37cc825dfd24426ddf429e44fc7f87}") String apiKey) {
        this.restClient = restClientBuilder.build();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    public JevDecisionResponse decide(JevDecisionRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Jev API key is missing. Set the JEV_API_KEY environment variable.");
        }

        log.info("Sending structured decision request to Jev at {}", apiUrl);

        return restClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(JevDecisionResponse.class);
    }
}
