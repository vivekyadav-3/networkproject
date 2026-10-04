package com.netpulse.entity;

import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;
import jakarta.persistence.*;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String hostname;

    @Column(nullable = false, unique = true)
    private String ipAddress;

    private String macAddress;

    @Enumerated(EnumType.STRING)
    private DeviceType deviceType;

    @Enumerated(EnumType.STRING)
    private DeviceStatus status;

    public Device() {
    }

    public Device(String hostname, String ipAddress, String macAddress, DeviceType deviceType, DeviceStatus status) {
        this.hostname = hostname;
        this.ipAddress = ipAddress;
        this.macAddress = macAddress;
        this.deviceType = deviceType;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
