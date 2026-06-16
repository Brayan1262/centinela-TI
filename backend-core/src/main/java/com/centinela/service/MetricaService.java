package com.centinela.service;

import com.centinela.model.Metrica;
import com.centinela.repository.MetricaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Collections;
@Service
public class MetricaService {

    private final MetricaRepository metricaRepository;

    @Autowired
    public MetricaService(MetricaRepository metricaRepository) {
        this.metricaRepository = metricaRepository;
    }

    public Metrica guardarMetrica(Metrica metrica) {
        if (metrica.getTimestamp() == null) {
            metrica.setTimestamp(LocalDateTime.now());
        }
        return metricaRepository.save(metrica);
    }

    public List<Metrica> obtenerRecientes() {
        List<Metrica> recientes = metricaRepository.findTop20ByOrderByTimestampDesc();
        Collections.reverse(recientes);
        return recientes;
    }
}
