package com.hssc.courier.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tbl_detalles_ruta")
public class DetalleRuta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDetalle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idHojaRuta", nullable = false)
    private HojaRuta hojaRuta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idPaquete", nullable = false)
    private Paquete paquete;

    @Column(nullable = false)
    private Integer ordenVisita = 1;

    @Column(nullable = false, length = 20)
    private String estadoEntrega = "PENDIENTE";

    private LocalDateTime fechaEntrega;

    @Column(length = 300)
    private String observaciones;
}
