package com.hssc.courier.controller;

import com.hssc.courier.dto.HojaRutaRequest;
import com.hssc.courier.model.DetalleRuta;
import com.hssc.courier.model.HojaRuta;
import com.hssc.courier.service.HojaRutaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hojas-ruta")
public class HojaRutaController {

    @Autowired
    private HojaRutaService hojaRutaService;

    @GetMapping
    public ResponseEntity<List<HojaRuta>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        if (fecha != null) {
            return ResponseEntity.ok(hojaRutaService.listarPorFecha(fecha));
        }
        return ResponseEntity.ok(hojaRutaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HojaRuta> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(hojaRutaService.buscarPorId(id));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<DetalleRuta>> listarDetalles(@PathVariable Integer id) {
        return ResponseEntity.ok(hojaRutaService.listarDetalles(id));
    }

    @PostMapping
    public ResponseEntity<HojaRuta> crear(@Valid @RequestBody HojaRutaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hojaRutaService.crear(request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<HojaRuta> cambiarEstado(@PathVariable Integer id, @RequestParam String estado) {
        return ResponseEntity.ok(hojaRutaService.cambiarEstado(id, estado));
    }

    @PatchMapping("/detalles/{idDetalle}/entrega")
    public ResponseEntity<DetalleRuta> actualizarEntrega(
            @PathVariable Integer idDetalle, @RequestParam String estado) {
        return ResponseEntity.ok(hojaRutaService.actualizarEntrega(idDetalle, estado));
    }
}
