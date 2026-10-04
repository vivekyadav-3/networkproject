package com.netpulse.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class SubnetCalcRequestDto {

    @NotBlank(message = "IP address cannot be blank")
    @Pattern(regexp = "^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$", message = "Invalid IPv4 address")
    private String ipAddress;

    @NotNull(message = "CIDR cannot be null")
    @Min(value = 1, message = "CIDR must be at least 1")
    @Max(value = 32, message = "CIDR must be at most 32")
    private Integer cidr;

    // No-argument constructor
    public SubnetCalcRequestDto() {
    }

    // Parameterized constructor
    public SubnetCalcRequestDto(String ipAddress, Integer cidr) {
        this.ipAddress = ipAddress;
        this.cidr = cidr;
    }

    // Getters and Setters

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Integer getCidr() {
        return cidr;
    }

    public void setCidr(Integer cidr) {
        this.cidr = cidr;
    }
}