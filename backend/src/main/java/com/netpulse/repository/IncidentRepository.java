package com.netpulse.repository;

import com.netpulse.entity.Incident;
import com.netpulse.entity.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findByHost(String host);

    List<Incident> findAllByOrderByCreatedAtDesc();
}
