package com.centinela.controller;

import com.centinela.model.Metrica;
import com.centinela.service.MetricaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/metricas")
@CrossOrigin(origins = "*")
public class MetricaController {

    private final MetricaService metricaService;

    @Autowired
    public MetricaController(MetricaService metricaService) {
        this.metricaService = metricaService;
    }

    @PostMapping
    public ResponseEntity<Metrica> recibirMetricas(@RequestBody Metrica metrica) {
        Metrica metricaGuardada = metricaService.guardarMetrica(metrica);
        return new ResponseEntity<>(metricaGuardada, HttpStatus.CREATED);
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<Metrica>> obtenerRecientes() {
        return ResponseEntity.ok(metricaService.obtenerRecientes());
    }
}
