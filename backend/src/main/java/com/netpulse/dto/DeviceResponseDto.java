package com.netpulse.dto;

import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;

public class DeviceResponseDto {

    private Long id;
    private String hostname;
    private String ipAddress;
    private String macAddress;
    private DeviceType deviceType;
    private DeviceStatus status;

    public DeviceResponseDto() {
    }

    public DeviceResponseDto(Long id, String hostname, String ipAddress,
            String macAddress, DeviceType deviceType, DeviceStatus status) {
        this.id = id;
        this.hostname = hostname;
        this.ipAddress = ipAddress;
        this.macAddress = macAddress;
        this.deviceType = deviceType;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
    public DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(DeviceType deviceType) { this.deviceType = deviceType; }
    public DeviceStatus getStatus() { return status; }
    public void setStatus(DeviceStatus status) { this.status = status; }
}
