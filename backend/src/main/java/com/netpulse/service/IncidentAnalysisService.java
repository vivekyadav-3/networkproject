package com.netpulse.service;

import com.netpulse.dto.IncidentResponse;
import com.netpulse.dto.NetworkIncidentRequest;
import com.netpulse.entity.Incident;
import com.netpulse.entity.enums.IncidentStatus;
import com.netpulse.entity.enums.IncidentType;
import com.netpulse.entity.enums.Severity;
import com.netpulse.exception.ResourceNotFoundException;
import com.netpulse.repository.IncidentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(IncidentAnalysisService.class);

    private final JevService jevService;
    private final IncidentRepository incidentRepository;

    public IncidentAnalysisService(JevService jevService, IncidentRepository incidentRepository) {
        this.jevService = jevService;
        this.incidentRepository = incidentRepository;
    }

    @Transactional
    public IncidentResponse analyzeAndRecord(NetworkIncidentRequest request) {
        log.info("Analyzing telemetry for host: {}, latency: {}ms, loss: {}%",
                request.getHost(), request.getLatencyMs(), request.getPacketLossPercent());

        // 1. Fast deterministic check: if strictly normal, no need for AI intervention
        boolean isCompletelyNormal = (request.getPacketLossPercent() <= 0.0
                && request.getLatencyMs() < 80.0
                && (request.getFailedConnections() == null || request.getFailedConnections() == 0)
                && (request.getDnsLatencyMs() == null || request.getDnsLatencyMs() < 50.0)
                && (request.getEvents() == null || request.getEvents().isEmpty()));

        IncidentType type;
        Severity severity;
        Double confidence;
        Boolean requiresEscalation;
        String summary;

        if (isCompletelyNormal) {
            type = IncidentType.UNKNOWN;
            severity = Severity.LOW;
            confidence = 0.99;
            requiresEscalation = false;
            summary = "Telemetry nominal. Network health optimal.";
        } else {
            // 2. Delegate to Jev structured AI decision engine
            JevService.AnalysisResult result = jevService.evaluateIncident(request);
            type = result.getIncidentType();
            severity = result.getSeverity();
            confidence = result.getConfidence();
            requiresEscalation = result.getRequiresEscalation();
            summary = result.getSummary();
        }

        // 3. Persist incident record in DB
        Incident incident = new Incident(
                request.getHost(),
                type,
                severity,
                confidence,
                requiresEscalation,
                request.getLatencyMs(),
                request.getPacketLossPercent(),
                request.getDnsLatencyMs(),
                request.getActiveConnections(),
                request.getFailedConnections(),
                summary,
                IncidentStatus.OPEN
        );

        Incident saved = incidentRepository.save(incident);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + id));
        return mapToDto(incident);
    }

    @Transactional
    public IncidentResponse updateIncidentStatus(Long id, IncidentStatus status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + id));
        incident.setStatus(status);
        Incident updated = incidentRepository.save(incident);
        return mapToDto(updated);
    }

    private IncidentResponse mapToDto(Incident inc) {
        return new IncidentResponse(
                inc.getId(),
                inc.getHost(),
                inc.getIncidentType(),
                inc.getSeverity(),
                inc.getConfidence(),
                inc.getRequiresEscalation(),
                inc.getLatencyMs(),
                inc.getPacketLossPercent(),
                inc.getDnsLatencyMs(),
                inc.getActiveConnections(),
                inc.getFailedConnections(),
                inc.getSummary(),
                inc.getStatus(),
                inc.getCreatedAt()
        );
    }
}
