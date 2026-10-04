package com.netpulse.controller;

import com.netpulse.dto.IncidentResponse;
import com.netpulse.dto.NetworkIncidentRequest;
import com.netpulse.entity.enums.IncidentStatus;
import com.netpulse.service.IncidentAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class JevController {

    private final IncidentAnalysisService analysisService;

    public JevController(IncidentAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    // 1. Analyze network telemetry using Jev structured decision engine
    @PostMapping("/analyze")
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse analyzeTelemetry(@Valid @RequestBody NetworkIncidentRequest request) {
        return analysisService.analyzeAndRecord(request);
    }

    // 2. Retrieve all recorded incidents (ordered newest first)
    @GetMapping("/incidents")
    public List<IncidentResponse> getAllIncidents() {
        return analysisService.getAllIncidents();
    }

    // 3. Retrieve incident details by ID
    @GetMapping("/incidents/{id}")
    public IncidentResponse getIncidentById(@PathVariable Long id) {
        return analysisService.getIncidentById(id);
    }

    // 4. Update incident status (e.g., RESOLVED, UNDER_REVIEW)
    @PatchMapping("/incidents/{id}/status")
    public IncidentResponse updateStatus(
            @PathVariable Long id,
            @RequestParam IncidentStatus status) {
        return analysisService.updateIncidentStatus(id, status);
    }
}
