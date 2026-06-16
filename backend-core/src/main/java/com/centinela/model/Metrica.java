package com.centinela.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "metricas")
@Data
@NoArgsConstructor
public class Metrica {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Double cpu;
    private Double ram;
    private Double disco;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "servidor_id")
    private String servidorId;
}
