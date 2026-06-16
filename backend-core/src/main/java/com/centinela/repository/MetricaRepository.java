package com.centinela.repository;

import com.centinela.model.Metrica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

import java.util.List;

@Repository
public interface MetricaRepository extends JpaRepository<Metrica, UUID> {
    List<Metrica> findTop20ByOrderByTimestampDesc();
}
