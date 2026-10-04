package com.netpulse.dto;

public class SubnetCalcResponseDto {

    private String ipAddress;
    private Integer cidr;
    private String networkAddress;
    private String broadcastAddress;
    private String subnetMask;
    private String wildcardMask;
    private String firstUsableHost;
    private String lastUsableHost;
    private long totalHosts;
    private long usableHosts;
    private String ipClass;
    private String binarySubnetMask;

    // No-argument constructor
    public SubnetCalcResponseDto() {
    }

    // All-arguments constructor
    public SubnetCalcResponseDto(
            String ipAddress,
            Integer cidr,
            String networkAddress,
            String broadcastAddress,
            String subnetMask,
            String wildcardMask,
            String firstUsableHost,
            String lastUsableHost,
            long totalHosts,
            long usableHosts,
            String ipClass,
            String binarySubnetMask) {

        this.ipAddress = ipAddress;
        this.cidr = cidr;
        this.networkAddress = networkAddress;
        this.broadcastAddress = broadcastAddress;
        this.subnetMask = subnetMask;
        this.wildcardMask = wildcardMask;
        this.firstUsableHost = firstUsableHost;
        this.lastUsableHost = lastUsableHost;
        this.totalHosts = totalHosts;
        this.usableHosts = usableHosts;
        this.ipClass = ipClass;
        this.binarySubnetMask = binarySubnetMask;
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

    public String getNetworkAddress() {
        return networkAddress;
    }

    public void setNetworkAddress(String networkAddress) {
        this.networkAddress = networkAddress;
    }

    public String getBroadcastAddress() {
        return broadcastAddress;
    }

    public void setBroadcastAddress(String broadcastAddress) {
        this.broadcastAddress = broadcastAddress;
    }

    public String getSubnetMask() {
        return subnetMask;
    }

    public void setSubnetMask(String subnetMask) {
        this.subnetMask = subnetMask;
    }

    public String getWildcardMask() {
        return wildcardMask;
    }

    public void setWildcardMask(String wildcardMask) {
        this.wildcardMask = wildcardMask;
    }

    public String getFirstUsableHost() {
        return firstUsableHost;
    }

    public void setFirstUsableHost(String firstUsableHost) {
        this.firstUsableHost = firstUsableHost;
    }

    public String getLastUsableHost() {
        return lastUsableHost;
    }

    public void setLastUsableHost(String lastUsableHost) {
        this.lastUsableHost = lastUsableHost;
    }

    public long getTotalHosts() {
        return totalHosts;
    }

    public void setTotalHosts(long totalHosts) {
        this.totalHosts = totalHosts;
    }

    public long getUsableHosts() {
        return usableHosts;
    }

    public void setUsableHosts(long usableHosts) {
        this.usableHosts = usableHosts;
    }

    public String getIpClass() {
        return ipClass;
    }

    public void setIpClass(String ipClass) {
        this.ipClass = ipClass;
    }

    public String getBinarySubnetMask() {
        return binarySubnetMask;
    }

    public void setBinarySubnetMask(String binarySubnetMask) {
        this.binarySubnetMask = binarySubnetMask;
    }
}
