package com.netpulse.controller;

import com.netpulse.dto.SubnetCalcRequestDto;
import com.netpulse.dto.SubnetCalcResponseDto;
import com.netpulse.service.SubnetCalculatorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subnet")
public class SubnetController {

    private final SubnetCalculatorService subnetCalculatorService;

    public SubnetController(SubnetCalculatorService subnetCalculatorService) {
        this.subnetCalculatorService = subnetCalculatorService;
    }

    @PostMapping("/calculate")
    public SubnetCalcResponseDto calculateSubnet(
            @Valid @RequestBody SubnetCalcRequestDto requestDto) {
        return subnetCalculatorService.calculate(requestDto);
    }
}
