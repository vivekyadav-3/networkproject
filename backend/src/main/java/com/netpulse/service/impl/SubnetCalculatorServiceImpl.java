package com.netpulse.service.impl;

import com.netpulse.dto.SubnetCalcRequestDto;
import com.netpulse.dto.SubnetCalcResponseDto;
import com.netpulse.service.SubnetCalculatorService;
import org.springframework.stereotype.Service;

@Service
public class SubnetCalculatorServiceImpl implements SubnetCalculatorService {

    @Override
    public SubnetCalcResponseDto calculate(SubnetCalcRequestDto requestDto) {
        String ipStr = requestDto.getIpAddress().trim();
        int cidr = requestDto.getCidr();

        long ip = ipToLong(ipStr);

        // Subnet Mask & Wildcard Mask
        long mask = cidr == 0 ? 0L : (0xFFFFFFFFL << (32 - cidr)) & 0xFFFFFFFFL;
        long wildcard = ~mask & 0xFFFFFFFFL;

        // Network & Broadcast Addresses
        long network = ip & mask;
        long broadcast = network | wildcard;

        // Total and Usable Hosts
        long totalHosts = (long) Math.pow(2, 32 - cidr);
        long usableHosts;
        long firstUsable;
        long lastUsable;

        if (cidr == 32) {
            usableHosts = 1;
            firstUsable = network;
            lastUsable = network;
        } else if (cidr == 31) {
            // RFC 3021: Point-to-Point links
            usableHosts = 2;
            firstUsable = network;
            lastUsable = broadcast;
        } else {
            usableHosts = Math.max(0, totalHosts - 2);
            firstUsable = network + 1;
            lastUsable = broadcast - 1;
        }

        String networkAddress = longToIp(network);
        String broadcastAddress = longToIp(broadcast);
        String subnetMask = longToIp(mask);
        String wildcardMask = longToIp(wildcard);
        String firstUsableHost = longToIp(firstUsable);
        String lastUsableHost = longToIp(lastUsable);
        String ipClass = determineIpClass(ip);
        String binarySubnetMask = toBinaryString(mask);

        return new SubnetCalcResponseDto(
                ipStr,
                cidr,
                networkAddress,
                broadcastAddress,
                subnetMask,
                wildcardMask,
                firstUsableHost,
                lastUsableHost,
                totalHosts,
                usableHosts,
                ipClass,
                binarySubnetMask
        );
    }

    private long ipToLong(String ipAddress) {
        String[] octets = ipAddress.split("\\.");
        long result = 0;
        for (int i = 0; i < 4; i++) {
            result = (result << 8) | Long.parseLong(octets[i]);
        }
        return result & 0xFFFFFFFFL;
    }

    private String longToIp(long ip) {
        return String.format("%d.%d.%d.%d",
                (ip >> 24) & 0xFF,
                (ip >> 16) & 0xFF,
                (ip >> 8) & 0xFF,
                ip & 0xFF
        );
    }

    private String toBinaryString(long mask) {
        return String.format("%8s.%8s.%8s.%8s",
                String.format("%8s", Long.toBinaryString((mask >> 24) & 0xFF)).replace(' ', '0'),
                String.format("%8s", Long.toBinaryString((mask >> 16) & 0xFF)).replace(' ', '0'),
                String.format("%8s", Long.toBinaryString((mask >> 8) & 0xFF)).replace(' ', '0'),
                String.format("%8s", Long.toBinaryString(mask & 0xFF)).replace(' ', '0')
        );
    }

    private String determineIpClass(long ip) {
        long firstOctet = (ip >> 24) & 0xFF;
        if (firstOctet >= 1 && firstOctet <= 126) {
            return "Class A" + (firstOctet == 10 ? " (Private)" : "");
        } else if (firstOctet == 127) {
            return "Loopback";
        } else if (firstOctet >= 128 && firstOctet <= 191) {
            long secondOctet = (ip >> 16) & 0xFF;
            boolean isPrivate = (firstOctet == 172 && secondOctet >= 16 && secondOctet <= 31);
            return "Class B" + (isPrivate ? " (Private)" : "");
        } else if (firstOctet >= 192 && firstOctet <= 223) {
            long secondOctet = (ip >> 16) & 0xFF;
            boolean isPrivate = (firstOctet == 192 && secondOctet == 168);
            return "Class C" + (isPrivate ? " (Private)" : "");
        } else if (firstOctet >= 224 && firstOctet <= 239) {
            return "Class D (Multicast)";
        } else {
            return "Class E (Experimental)";
        }
    }
}
