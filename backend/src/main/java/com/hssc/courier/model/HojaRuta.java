package com.hssc.courier.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tbl_hojas_ruta")
public class HojaRuta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHojaRuta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario repartidor;

    @Column(nullable = false)
    private LocalDate fechaAsignacion;

    @Column(nullable = false, length = 20)
    private String vehiculoPlaca;

    @Column(nullable = false, length = 20)
    private String estadoRuta = "PENDIENTE";

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}
