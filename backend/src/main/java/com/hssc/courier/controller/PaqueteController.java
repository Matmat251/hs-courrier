package com.hssc.courier.controller;

import com.hssc.courier.dto.EscaneoRequest;
import com.hssc.courier.dto.PaqueteRequest;
import com.hssc.courier.model.EstadoPaquete;
import com.hssc.courier.model.Paquete;
import com.hssc.courier.model.Trazabilidad;
import com.hssc.courier.repository.EstadoPaqueteRepository;
import com.hssc.courier.service.PaqueteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paquetes")
public class PaqueteController {

    @Autowired
    private PaqueteService paqueteService;

    @Autowired
    private EstadoPaqueteRepository estadoRepository;

    @GetMapping
    public ResponseEntity<List<Paquete>> listar(@RequestParam(required = false) String estado) {
        if (estado != null && !estado.isBlank()) {
            return ResponseEntity.ok(paqueteService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(paqueteService.listarTodos());
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Long>> resumen() {
        return ResponseEntity.ok(paqueteService.obtenerResumen());
    }

    @GetMapping("/estados")
    public ResponseEntity<List<EstadoPaquete>> listarEstados() {
        return ResponseEntity.ok(estadoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paquete> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(paqueteService.buscarPorId(id));
    }

    @GetMapping("/tracking/{codigo}")
    public ResponseEntity<Paquete> buscarPorTracking(@PathVariable String codigo) {
        return ResponseEntity.ok(paqueteService.buscarPorTracking(codigo));
    }

    @PostMapping
    public ResponseEntity<Paquete> crear(@Valid @RequestBody PaqueteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paqueteService.registrar(request));
    }

    @PostMapping("/escanear")
    public ResponseEntity<Trazabilidad> escanear(@Valid @RequestBody EscaneoRequest request) {
        return ResponseEntity.ok(paqueteService.procesarEscaneo(request));
    }
}
