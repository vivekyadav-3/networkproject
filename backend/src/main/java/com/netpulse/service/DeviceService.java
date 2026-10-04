package com.netpulse.service;

import com.netpulse.dto.DeviceRequestDto;
import com.netpulse.dto.DeviceResponseDto;
import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;

import java.util.List;

public interface DeviceService {

    DeviceResponseDto createDevice(DeviceRequestDto requestDto);

    List<DeviceResponseDto> getAllDevices();

    DeviceResponseDto getDeviceById(Long id);

    DeviceResponseDto updateDevice(Long id, DeviceRequestDto requestDto);

    void deleteDevice(Long id);

    List<DeviceResponseDto> getDevicesByStatus(DeviceStatus status);

    List<DeviceResponseDto> getDevicesByType(DeviceType type);
}
