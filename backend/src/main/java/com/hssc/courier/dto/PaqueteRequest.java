package com.hssc.courier.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaqueteRequest {

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "0.001", message = "El peso debe ser mayor a 0")
    private BigDecimal pesoKg;

    private String dimensiones;

    @NotNull(message = "El remitente es obligatorio")
    private Integer idRemitente;

    @NotNull(message = "El destinatario es obligatorio")
    private Integer idDestinatario;

    @NotBlank(message = "La direccion de destino es obligatoria")
    private String direccionDestino;

    private String observaciones;
}
