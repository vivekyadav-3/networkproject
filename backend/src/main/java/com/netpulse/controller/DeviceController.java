package com.netpulse.controller;

import com.netpulse.dto.DeviceRequestDto;
import com.netpulse.dto.DeviceResponseDto;
import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;
import com.netpulse.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    // 1. Create a new device
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeviceResponseDto createDevice(
            @Valid @RequestBody DeviceRequestDto requestDto) {

        return deviceService.createDevice(requestDto);
    }

    // 2. Get all devices
    @GetMapping
    public List<DeviceResponseDto> getAllDevices() {

        return deviceService.getAllDevices();
    }

    // 3. Get device by ID
    @GetMapping("/{id}")
    public DeviceResponseDto getDeviceById(
            @PathVariable Long id) {

        return deviceService.getDeviceById(id);
    }

    // 4. Update device
    @PutMapping("/{id}")
    public DeviceResponseDto updateDevice(
            @PathVariable Long id,
            @Valid @RequestBody DeviceRequestDto requestDto) {

        return deviceService.updateDevice(id, requestDto);
    }

    // 5. Delete device
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDevice(
            @PathVariable Long id) {

        deviceService.deleteDevice(id);
    }

    // 6. Get devices by status
    @GetMapping("/status/{status}")
    public List<DeviceResponseDto> getDevicesByStatus(
            @PathVariable DeviceStatus status) {

        return deviceService.getDevicesByStatus(status);
    }

    // 7. Get devices by type
    @GetMapping("/type/{type}")
    public List<DeviceResponseDto> getDevicesByType(
            @PathVariable DeviceType type) {

        return deviceService.getDevicesByType(type);
    }
}