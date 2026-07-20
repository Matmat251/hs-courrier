package com.hssc.courier.service;

import com.hssc.courier.model.Trazabilidad;
import com.hssc.courier.repository.TrazabilidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrazabilidadService {

    @Autowired
    private TrazabilidadRepository trazabilidadRepository;

    public List<Trazabilidad> listarPorPaquete(Integer idPaquete) {
        return trazabilidadRepository.findByPaquete_IdPaqueteOrderByFechaHoraAsc(idPaquete);
    }

    public List<Trazabilidad> listarPorTracking(String codigoTracking) {
        return trazabilidadRepository.findByPaquete_CodigoTrackingOrderByFechaHoraAsc(codigoTracking);
    }

    public List<Trazabilidad> listarPorUsuario(Integer idUsuario) {
        return trazabilidadRepository.findByUsuario_IdUsuarioOrderByFechaHoraDesc(idUsuario);
    }

    public List<Trazabilidad> listarTodas() {
        return trazabilidadRepository.findAll();
    }
}
