package com.netpulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class NetworkIncidentRequest {

    @NotBlank(message = "Host cannot be blank")
    private String host;

    @NotNull(message = "Latency must be provided")
    private Double latencyMs;

    @NotNull(message = "Packet loss percent must be provided")
    private Double packetLossPercent;

    private Double dnsLatencyMs;

    private Integer activeConnections;

    private Integer failedConnections;

    private List<String> events = new ArrayList<>();

    public NetworkIncidentRequest() {
    }

    public NetworkIncidentRequest(String host, Double latencyMs, Double packetLossPercent,
            Double dnsLatencyMs, Integer activeConnections,
            Integer failedConnections, List<String> events) {
        this.host = host;
        this.latencyMs = latencyMs;
        this.packetLossPercent = packetLossPercent;
        this.dnsLatencyMs = dnsLatencyMs;
        this.activeConnections = activeConnections;
        this.failedConnections = failedConnections;
        this.events = events != null ? events : new ArrayList<>();
    }

    // Getters and Setters

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
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

    public List<String> getEvents() {
        return events;
    }

    public void setEvents(List<String> events) {
        this.events = events;
    }
}
