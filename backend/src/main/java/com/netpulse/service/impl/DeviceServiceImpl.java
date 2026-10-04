package com.netpulse.service.impl;

import com.netpulse.dto.DeviceRequestDto;
import com.netpulse.dto.DeviceResponseDto;
import com.netpulse.entity.Device;
import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;
import com.netpulse.exception.ResourceNotFoundException;
import com.netpulse.repository.DeviceRepository;
import com.netpulse.service.DeviceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceServiceImpl(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public DeviceResponseDto createDevice(DeviceRequestDto requestDto) {

        // Validate IP uniqueness
        if (deviceRepository.existsByIpAddress(requestDto.getIpAddress())) {
            throw new IllegalArgumentException("IP already in use");
        }

        // Validate hostname uniqueness
        if (deviceRepository.existsByHostname(requestDto.getHostname())) {
            throw new IllegalArgumentException("Hostname already in use");
        }

        // Create entity
        Device device = new Device();

        device.setHostname(requestDto.getHostname());
        device.setIpAddress(requestDto.getIpAddress());
        device.setMacAddress(requestDto.getMacAddress());
        device.setDeviceType(requestDto.getDeviceType());
        device.setStatus(requestDto.getStatus());

        // Save entity
        Device savedDevice = deviceRepository.save(device);

        // Return response DTO
        return mapToResponseDto(savedDevice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponseDto> getAllDevices() {

        return deviceRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DeviceResponseDto getDeviceById(Long id) {

        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device not found with id: " + id));

        return mapToResponseDto(device);
    }

    @Override
    public DeviceResponseDto updateDevice(
            Long id,
            DeviceRequestDto requestDto) {

        // Find existing device
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device not found with id: " + id));

        // Update fields
        device.setHostname(requestDto.getHostname());
        device.setIpAddress(requestDto.getIpAddress());
        device.setMacAddress(requestDto.getMacAddress());
        device.setDeviceType(requestDto.getDeviceType());
        device.setStatus(requestDto.getStatus());

        // Save updated entity
        Device updatedDevice = deviceRepository.save(device);

        return mapToResponseDto(updatedDevice);
    }

    @Override
    public void deleteDevice(Long id) {

        // Check if device exists
        if (!deviceRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Device not found with id: " + id);
        }

        deviceRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponseDto> getDevicesByStatus(
            DeviceStatus status) {

        return deviceRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponseDto> getDevicesByType(
            DeviceType type) {

        return deviceRepository.findByDeviceType(type)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    // Entity -> Response DTO
    private DeviceResponseDto mapToResponseDto(Device device) {

        return new DeviceResponseDto(
                device.getId(),
                device.getHostname(),
                device.getIpAddress(),
                device.getMacAddress(),
                device.getDeviceType(),
                device.getStatus());
    }
}