package com.hssc.courier.service;

import com.hssc.courier.dto.HojaRutaRequest;
import com.hssc.courier.model.*;
import com.hssc.courier.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class HojaRutaService {

    @Autowired
    private HojaRutaRepository hojaRutaRepository;

    @Autowired
    private DetalleRutaRepository detalleRutaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PaqueteRepository paqueteRepository;

    public List<HojaRuta> listarTodas() {
        return hojaRutaRepository.findAll();
    }

    public HojaRuta buscarPorId(Integer id) {
        return hojaRutaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hoja de ruta no encontrada con id: " + id));
    }

    public List<HojaRuta> listarPorFecha(LocalDate fecha) {
        return hojaRutaRepository.findByFechaAsignacion(fecha);
    }

    public List<DetalleRuta> listarDetalles(Integer idHojaRuta) {
        return detalleRutaRepository.findByHojaRuta_IdHojaRuta(idHojaRuta);
    }

    @Transactional
    public HojaRuta crear(HojaRutaRequest request) {
        Usuario repartidor = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Repartidor no encontrado"));

        HojaRuta hojaRuta = new HojaRuta();
        hojaRuta.setRepartidor(repartidor);
        hojaRuta.setFechaAsignacion(request.getFechaAsignacion());
        hojaRuta.setVehiculoPlaca(request.getVehiculoPlaca());
        hojaRuta.setEstadoRuta("PENDIENTE");
        hojaRuta.setObservaciones(request.getObservaciones());

        HojaRuta guardada = hojaRutaRepository.save(hojaRuta);

        if (request.getPaquetes() != null) {
            for (HojaRutaRequest.DetalleRutaItemRequest item : request.getPaquetes()) {
                Paquete paquete = paqueteRepository.findById(item.getIdPaquete())
                        .orElseThrow(() -> new RuntimeException("Paquete no encontrado: " + item.getIdPaquete()));

                DetalleRuta detalle = new DetalleRuta();
                detalle.setHojaRuta(guardada);
                detalle.setPaquete(paquete);
                detalle.setOrdenVisita(item.getOrdenVisita());
                detalle.setEstadoEntrega("PENDIENTE");
                detalleRutaRepository.save(detalle);
            }
        }

        return guardada;
    }

    @Transactional
    public HojaRuta cambiarEstado(Integer id, String nuevoEstado) {
        HojaRuta hojaRuta = buscarPorId(id);
        hojaRuta.setEstadoRuta(nuevoEstado);
        return hojaRutaRepository.save(hojaRuta);
    }

    @Transactional
    public DetalleRuta actualizarEntrega(Integer idDetalle, String estado) {
        DetalleRuta detalle = detalleRutaRepository.findById(idDetalle)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado con id: " + idDetalle));
        detalle.setEstadoEntrega(estado);
        return detalleRutaRepository.save(detalle);
    }
}
