package com.netpulse.repository;

import com.netpulse.entity.Device;
import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    boolean existsByIpAddress(String ipAddress);

    boolean existsByHostname(String hostname);

    Optional<Device> findByIpAddress(String ipAddress);

    List<Device> findByStatus(DeviceStatus status);

    List<Device> findByDeviceType(DeviceType deviceType);
}