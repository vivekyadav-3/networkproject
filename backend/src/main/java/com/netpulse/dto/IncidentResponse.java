package com.netpulse.dto;

import com.netpulse.entity.enums.IncidentStatus;
import com.netpulse.entity.enums.IncidentType;
import com.netpulse.entity.enums.Severity;

import java.time.LocalDateTime;

public class IncidentResponse {

    private Long id;
    private String host;
    private IncidentType incidentType;
    private Severity severity;
    private Double confidence;
    private Boolean requiresEscalation;
    private Double latencyMs;
    private Double packetLossPercent;
    private Double dnsLatencyMs;
    private Integer activeConnections;
    private Integer failedConnections;
    private String summary;
    private IncidentStatus status;
    private LocalDateTime createdAt;

    public IncidentResponse() {
    }

    public IncidentResponse(Long id, String host, IncidentType incidentType, Severity severity,
            Double confidence, Boolean requiresEscalation, Double latencyMs,
            Double packetLossPercent, Double dnsLatencyMs, Integer activeConnections,
            Integer failedConnections, String summary, IncidentStatus status,
            LocalDateTime createdAt) {
        this.id = id;
        this.host = host;
        this.incidentType = incidentType;
        this.severity = severity;
        this.confidence = confidence;
        this.requiresEscalation = requiresEscalation;
        this.latencyMs = latencyMs;
        this.packetLossPercent = packetLossPercent;
        this.dnsLatencyMs = dnsLatencyMs;
        this.activeConnections = activeConnections;
        this.failedConnections = failedConnections;
        this.summary = summary;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public IncidentType getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(IncidentType incidentType) {
        this.incidentType = incidentType;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public Boolean getRequiresEscalation() {
        return requiresEscalation;
    }

    public void setRequiresEscalation(Boolean requiresEscalation) {
        this.requiresEscalation = requiresEscalation;
    }

    public Double getLatencyMs() {
        return latencyMs;
    }

    public void setLatencyMs(Double latencyMs) {
        this.latencyMs = latencyMs;
    }

    public Double getPacketLossPercent() {
        return packetLossPercent;
    }

    public void setPacketLossPercent(Double packetLossPercent) {
        this.packetLossPercent = packetLossPercent;
    }

    public Double getDnsLatencyMs() {
        return dnsLatencyMs;
    }

    public void setDnsLatencyMs(Double dnsLatencyMs) {
        this.dnsLatencyMs = dnsLatencyMs;
    }

    public Integer getActiveConnections() {
        return activeConnections;
    }

    public void setActiveConnections(Integer activeConnections) {
        this.activeConnections = activeConnections;
    }

    public Integer getFailedConnections() {
        return failedConnections;
    }

    public void setFailedConnections(Integer failedConnections) {
        this.failedConnections = failedConnections;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
