package com.netpulse.config;

import com.netpulse.entity.Device;
import com.netpulse.entity.Incident;
import com.netpulse.entity.enums.DeviceStatus;
import com.netpulse.entity.enums.DeviceType;
import com.netpulse.entity.enums.IncidentStatus;
import com.netpulse.entity.enums.IncidentType;
import com.netpulse.entity.enums.Severity;
import com.netpulse.repository.DeviceRepository;
import com.netpulse.repository.IncidentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final DeviceRepository deviceRepository;
    private final IncidentRepository incidentRepository;

    public DataInitializer(DeviceRepository deviceRepository, IncidentRepository incidentRepository) {
        this.deviceRepository = deviceRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public void run(String... args) {
        if (deviceRepository.count() == 0) {
            log.info("Seeding initial network devices into database...");
            deviceRepository.saveAll(List.of(
                    new Device("Core-Router-01", "192.168.1.1", "AA:BB:CC:DD:EE:01", DeviceType.ROUTER, DeviceStatus.ONLINE),
                    new Device("Dist-Switch-01", "192.168.1.2", "AA:BB:CC:DD:EE:02", DeviceType.SWITCH, DeviceStatus.ONLINE),
                    new Device("Edge-Firewall-01", "192.168.1.254", "AA:BB:CC:DD:EE:FE", DeviceType.FIREWALL, DeviceStatus.ONLINE)
            ));
            log.info("Seeded 3 managed network devices.");
        }

        if (incidentRepository.count() == 0) {
            log.info("Seeding initial demonstration incident record...");
            Incident sampleIncident = new Incident(
                    "Core-Router-01",
                    IncidentType.NETWORK_DEGRADATION,
                    Severity.HIGH,
                    0.92,
                    true,
                    420.0,
                    28.5,
                    32.0,
                    180,
                    42,
                    "High latency and intermittent packet loss detected across backbone interface ge-0/0/0.",
                    IncidentStatus.OPEN
            );
            incidentRepository.save(sampleIncident);
            log.info("Seeded sample incident record.");
        }
    }
}
