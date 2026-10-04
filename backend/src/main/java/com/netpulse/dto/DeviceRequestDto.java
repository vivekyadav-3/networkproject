package com.netpulse.dto;

import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class DeviceRequestDto {

    @NotBlank(message = "Hostname cannot be blank")
    private String hostname;

    @NotBlank(message = "IP address cannot be blank")
    @Pattern(regexp = "^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$", message = "Invalid IPv4 address")
    private String ipAddress;

    private String macAddress;

    @NotNull(message = "Device type cannot be null")
    private DeviceType deviceType;

    @NotNull(message = "Device status cannot be null")
    private DeviceStatus status;

    // No-argument constructor
    public DeviceRequestDto() {
    }

    // Parameterized constructor
    public DeviceRequestDto(
            String hostname,
            String ipAddress,
            String macAddress,
            DeviceType deviceType,
            DeviceStatus status) {

        this.hostname = hostname;
        this.ipAddress = ipAddress;
        this.macAddress = macAddress;
        this.deviceType = deviceType;
        this.status = status;
    }

    // Getters and Setters

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }

    public DeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceType deviceType) {
        this.deviceType = deviceType;
    }

    public DeviceStatus getStatus() {
        return status;
    }

    public void setStatus(DeviceStatus status) {
        this.status = status;
    }
}