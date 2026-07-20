package com.hssc.courier.controller;

import com.hssc.courier.model.Trazabilidad;
import com.hssc.courier.service.TrazabilidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trazabilidad")
public class TrazabilidadController {

    @Autowired
    private TrazabilidadService trazabilidadService;

    @GetMapping
    public ResponseEntity<List<Trazabilidad>> listarTodas() {
        return ResponseEntity.ok(trazabilidadService.listarTodas());
    }

    @GetMapping("/paquete/{idPaquete}")
    public ResponseEntity<List<Trazabilidad>> listarPorPaquete(@PathVariable Integer idPaquete) {
        return ResponseEntity.ok(trazabilidadService.listarPorPaquete(idPaquete));
    }

    @GetMapping("/tracking/{codigo}")
    public ResponseEntity<List<Trazabilidad>> listarPorTracking(@PathVariable String codigo) {
        return ResponseEntity.ok(trazabilidadService.listarPorTracking(codigo));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Trazabilidad>> listarPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(trazabilidadService.listarPorUsuario(idUsuario));
    }
}
