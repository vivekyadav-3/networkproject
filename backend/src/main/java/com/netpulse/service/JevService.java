package com.netpulse.service;

import com.netpulse.dto.JevDecisionRequest;
import com.netpulse.dto.JevDecisionResponse;
import com.netpulse.dto.NetworkIncidentRequest;
import com.netpulse.entity.enums.IncidentType;
import com.netpulse.entity.enums.Severity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JevService {

    private static final Logger log = LoggerFactory.getLogger(JevService.class);

    private final JevClient jevClient;
    private final String model;

    public JevService(JevClient jevClient, @Value("${jev.model:jev-latest}") String model) {
        this.jevClient = jevClient;
        this.model = model;
    }

    public AnalysisResult evaluateIncident(NetworkIncidentRequest request) {
        // 1. Build the network state payload
        Map<String, Object> state = new HashMap<>();
        state.put("host", request.getHost());
        state.put("latency_ms", request.getLatencyMs());
        state.put("packet_loss_percent", request.getPacketLossPercent());
        state.put("dns_latency_ms", request.getDnsLatencyMs() != null ? request.getDnsLatencyMs() : 0.0);
        state.put("active_connections", request.getActiveConnections() != null ? request.getActiveConnections() : 0);
        state.put("failed_connections", request.getFailedConnections() != null ? request.getFailedConnections() : 0);
        state.put("recent_events", request.getEvents());

        // 2. Build the three typed Jev questions
        Map<String, Object> questions = new HashMap<>();

        // Question 1: Incident Type (Choice)
        Map<String, Object> typeQuestion = new HashMap<>();
        typeQuestion.put("type", "choice");
        typeQuestion.put("instructions", "What is the primary network incident type based on metrics and events?");
        Map<String, String> typeCriteria = new HashMap<>();
        typeCriteria.put("NETWORK_DEGRADATION", "High latency or sustained packet loss affecting quality");
        typeCriteria.put("DNS_FAILURE", "High DNS latency or inability to resolve hostnames");
        typeCriteria.put("CONNECTION_FAILURE", "Substantial failed TCP/socket connections or refused connections");
        typeCriteria.put("SERVER_UNAVAILABLE", "Target host is unreachable, timeouts across all probes");
        typeCriteria.put("UNKNOWN", "Normal telemetry or conflicting/insufficient data");
        typeQuestion.put("criteria", typeCriteria);
        questions.put("incident_type", typeQuestion);

        // Question 2: Severity (Score)
        Map<String, Object> severityQuestion = new HashMap<>();
        severityQuestion.put("type", "score");
        severityQuestion.put("instructions", "Assess the operational severity of this incident.");
        severityQuestion.put("criteria", List.of("LOW", "MEDIUM", "HIGH", "CRITICAL"));
        questions.put("severity", severityQuestion);

        // Question 3: Escalation (Noul / Yes-No)
        Map<String, Object> escalationQuestion = new HashMap<>();
        escalationQuestion.put("type", "noul");
        escalationQuestion.put("instructions", "Does this incident require immediate on-call human intervention?");
        questions.put("requires_escalation", escalationQuestion);

        // 3. Dispatch to Jev
        JevDecisionRequest decisionRequest = new JevDecisionRequest(model, state, questions);

        try {
            JevDecisionResponse response = jevClient.decide(decisionRequest);
            return parseResponse(response);
        } catch (Exception ex) {
            log.error("Jev evaluation failed, applying fallback deterministic analysis: {}", ex.getMessage());
            return fallbackEvaluation(request, ex.getMessage());
        }
    }

    private AnalysisResult parseResponse(JevDecisionResponse response) {
        IncidentType type = IncidentType.UNKNOWN;
        Severity severity = Severity.LOW;
        Double confidence = 0.85;
        Boolean requiresEscalation = false;
        String reasoning = "Evaluated via Jev AI structured decision model.";

        if (response != null && response.getAnswers() != null) {
            JevDecisionResponse.JevAnswer typeAns = response.getAnswers().get("incident_type");
            if (typeAns != null && typeAns.getValue() != null) {
                try {
                    type = IncidentType.valueOf(typeAns.getValue().toString().toUpperCase());
                } catch (IllegalArgumentException ignored) {
                    type = IncidentType.NETWORK_DEGRADATION;
                }
                if (typeAns.getConfidence() != null) {
                    confidence = typeAns.getConfidence();
                }
            }

            JevDecisionResponse.JevAnswer sevAns = response.getAnswers().get("severity");
            if (sevAns != null && sevAns.getValue() != null) {
                try {
                    severity = Severity.valueOf(sevAns.getValue().toString().toUpperCase());
                } catch (IllegalArgumentException ignored) {
                    severity = Severity.MEDIUM;
                }
            }

            JevDecisionResponse.JevAnswer escAns = response.getAnswers().get("requires_escalation");
            if (escAns != null && escAns.getValue() != null) {
                requiresEscalation = Boolean.parseBoolean(escAns.getValue().toString());
            }

            if (typeAns != null && typeAns.getReasoning() != null) {
                reasoning = typeAns.getReasoning();
            }
        }

        return new AnalysisResult(type, severity, confidence, requiresEscalation, reasoning);
    }

    private AnalysisResult fallbackEvaluation(NetworkIncidentRequest req, String errorReason) {
        IncidentType type = IncidentType.UNKNOWN;
        Severity severity = Severity.LOW;
        boolean escalate = false;

        if (req.getPacketLossPercent() > 30.0 || req.getLatencyMs() > 400.0) {
            type = IncidentType.NETWORK_DEGRADATION;
            severity = Severity.HIGH;
            escalate = true;
        } else if (req.getFailedConnections() != null && req.getFailedConnections() > 20) {
            type = IncidentType.CONNECTION_FAILURE;
            severity = Severity.HIGH;
            escalate = true;
        } else if (req.getDnsLatencyMs() != null && req.getDnsLatencyMs() > 150.0) {
            type = IncidentType.DNS_FAILURE;
            severity = Severity.MEDIUM;
        }

        return new AnalysisResult(
                type,
                severity,
                0.75,
                escalate,
                "Deterministic rule applied (Jev fallback: " + errorReason + ")"
        );
    }

    public static class AnalysisResult {
        private final IncidentType incidentType;
        private final Severity severity;
        private final Double confidence;
        private final Boolean requiresEscalation;
        private final String summary;

        public AnalysisResult(IncidentType incidentType, Severity severity,
                              Double confidence, Boolean requiresEscalation, String summary) {
            this.incidentType = incidentType;
            this.severity = severity;
            this.confidence = confidence;
            this.requiresEscalation = requiresEscalation;
            this.summary = summary;
        }

        public IncidentType getIncidentType() { return incidentType; }
        public Severity getSeverity() { return severity; }
        public Double getConfidence() { return confidence; }
        public Boolean getRequiresEscalation() { return requiresEscalation; }
        public String getSummary() { return summary; }
    }
}
