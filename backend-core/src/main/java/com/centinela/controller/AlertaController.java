package com.centinela.controller;

import com.centinela.model.Alerta;
import com.centinela.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    // Abierto sin token para que la IA guarde la alerta
    @PostMapping
    public ResponseEntity<Alerta> crearAlerta(@RequestBody Alerta alerta) {
        Alerta alertaGuardada = alertaService.guardarAlerta(alerta);
        return new ResponseEntity<>(alertaGuardada, HttpStatus.CREATED);
    }

    // Requiere token JWT por la SecurityConfig
    @GetMapping
    public ResponseEntity<List<Alerta>> obtenerAlertas() {
        return ResponseEntity.ok(alertaService.obtenerTodasLasAlertas());
    }
}
