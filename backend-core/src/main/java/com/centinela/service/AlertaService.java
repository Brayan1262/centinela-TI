package com.centinela.service;

import com.centinela.model.Alerta;
import com.centinela.model.EstadoAlerta;
import com.centinela.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Alerta guardarAlerta(Alerta alerta) {
        if (alerta.getTimestamp() == null) {
            alerta.setTimestamp(LocalDateTime.now());
        }
        if (alerta.getEstado() == null) {
            alerta.setEstado(EstadoAlerta.PENDIENTE);
        }
        Alerta saved = alertaRepository.save(alerta);
        
        // Broadcast para actualizar la tabla en tiempo real
        messagingTemplate.convertAndSend("/topic/alertas", saved);
        
        return saved;
    }

    public List<Alerta> obtenerTodasLasAlertas() {
        return alertaRepository.findAllByOrderByTimestampDesc();
    }
}
