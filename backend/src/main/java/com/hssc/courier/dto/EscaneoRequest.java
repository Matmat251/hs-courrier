package com.hssc.courier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EscaneoRequest {

    @NotBlank(message = "El codigo de barras es obligatorio")
    private String codigoBarras;

    @NotNull(message = "El nuevo estado es obligatorio")
    private Integer idNuevoEstado;

    @NotNull(message = "El usuario es obligatorio")
    private Integer idUsuario;

    private BigDecimal latitud;
    private BigDecimal longitud;
    private String ubicacionTexto;
}
