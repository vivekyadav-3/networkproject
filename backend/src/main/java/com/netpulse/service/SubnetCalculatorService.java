package com.netpulse.service;

import com.netpulse.dto.SubnetCalcRequestDto;
import com.netpulse.dto.SubnetCalcResponseDto;

public interface SubnetCalculatorService {

    SubnetCalcResponseDto calculate(SubnetCalcRequestDto requestDto);
}
