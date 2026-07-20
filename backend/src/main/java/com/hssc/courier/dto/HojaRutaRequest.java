package com.hssc.courier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class HojaRutaRequest {

    @NotNull(message = "El repartidor es obligatorio")
    private Integer idUsuario;

    @NotNull(message = "La fecha de asignacion es obligatoria")
    private LocalDate fechaAsignacion;

    @NotBlank(message = "La placa del vehiculo es obligatoria")
    private String vehiculoPlaca;

    private String observaciones;

    private List<DetalleRutaItemRequest> paquetes;

    @Data
    public static class DetalleRutaItemRequest {
        @NotNull
        private Integer idPaquete;
        private Integer ordenVisita = 1;
    }
}
