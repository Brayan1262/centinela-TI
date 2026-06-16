package com.centinela.repository;

import com.centinela.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, UUID> {
    List<Alerta> findAllByOrderByTimestampDesc();
}
