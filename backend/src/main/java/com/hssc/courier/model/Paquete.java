package com.hssc.courier.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tbl_paquetes")
public class Paquete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPaquete;

    @Column(nullable = false, unique = true, length = 50)
    private String codigoTracking;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(nullable = false, precision = 8, scale = 3)
    private BigDecimal pesoKg;

    @Column(length = 100)
    private String dimensiones;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estadoActual", nullable = false)
    private EstadoPaquete estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idRemitente", nullable = false)
    private Cliente remitente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idDestinatario", nullable = false)
    private Cliente destinatario;

    @Column(nullable = false, length = 300)
    private String direccionDestino;

    @Column(nullable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}
