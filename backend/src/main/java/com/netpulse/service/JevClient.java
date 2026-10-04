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
            @Value("${jev.api.url}") String apiUrl,
            @Value("${jev.api.key:}") String apiKey) {
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
