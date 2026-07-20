package com.hssc.courier.service;

import com.hssc.courier.dto.EscaneoRequest;
import com.hssc.courier.dto.PaqueteRequest;
import com.hssc.courier.model.*;
import com.hssc.courier.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class PaqueteService {

    @Autowired
    private PaqueteRepository paqueteRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EstadoPaqueteRepository estadoRepository;

    @Autowired
    private TrazabilidadRepository trazabilidadRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Paquete> listarTodos() {
        return paqueteRepository.findAll();
    }

    public Paquete buscarPorId(Integer id) {
        return paqueteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paquete no encontrado con id: " + id));
    }

    public Paquete buscarPorTracking(String codigo) {
        return paqueteRepository.findByCodigoTracking(codigo)
                .orElseThrow(() -> new RuntimeException("Paquete no encontrado con tracking: " + codigo));
    }

    public List<Paquete> listarPorEstado(String estado) {
        return paqueteRepository.findByEstado_Nombre(estado);
    }

    @Transactional
    public Paquete registrar(PaqueteRequest request) {
        Cliente remitente = clienteRepository.findById(request.getIdRemitente())
                .orElseThrow(() -> new RuntimeException("Remitente no encontrado"));
        Cliente destinatario = clienteRepository.findById(request.getIdDestinatario())
                .orElseThrow(() -> new RuntimeException("Destinatario no encontrado"));
        EstadoPaquete estadoInicial = estadoRepository.findByNombre("EN_ALMACEN")
                .orElseThrow(() -> new RuntimeException("Estado inicial no configurado en BD"));

        Paquete paquete = new Paquete();
        paquete.setCodigoTracking(generarCodigoTracking());
        paquete.setDescripcion(request.getDescripcion());
        paquete.setPesoKg(request.getPesoKg());
        paquete.setDimensiones(request.getDimensiones());
        paquete.setEstado(estadoInicial);
        paquete.setRemitente(remitente);
        paquete.setDestinatario(destinatario);
        paquete.setDireccionDestino(request.getDireccionDestino());
        paquete.setObservaciones(request.getObservaciones());
        paquete.setFechaRegistro(LocalDateTime.now());

        return paqueteRepository.save(paquete);
    }

    @Transactional
    public Trazabilidad procesarEscaneo(EscaneoRequest request) {
        Paquete paquete = buscarPorTracking(request.getCodigoBarras());

        EstadoPaquete nuevoEstado = estadoRepository.findById(request.getIdNuevoEstado())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar estado del paquete
        paquete.setEstado(nuevoEstado);
        paqueteRepository.save(paquete);

        // Registrar en trazabilidad
        Trazabilidad trazabilidad = new Trazabilidad();
        trazabilidad.setPaquete(paquete);
        trazabilidad.setUsuario(usuario);
        trazabilidad.setEstado(nuevoEstado);
        trazabilidad.setCodigoLeido(request.getCodigoBarras());
        trazabilidad.setFechaHora(LocalDateTime.now());
        trazabilidad.setLatitud(request.getLatitud());
        trazabilidad.setLongitud(request.getLongitud());
        trazabilidad.setUbicacionTexto(request.getUbicacionTexto());

        return trazabilidadRepository.save(trazabilidad);
    }

    public Map<String, Long> obtenerResumen() {
        return Map.of(
                "total",       paqueteRepository.count(),
                "enAlmacen",   paqueteRepository.countByEstadoNombre("EN_ALMACEN"),
                "enRuta",      paqueteRepository.countByEstadoNombre("EN_RUTA"),
                "entregados",  paqueteRepository.countByEstadoNombre("ENTREGADO"),
                "noEntregados",paqueteRepository.countByEstadoNombre("NO_ENTREGADO")
        );
    }

    private String generarCodigoTracking() {
        String anio = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy"));
        long count = paqueteRepository.count() + 1;
        return String.format("HSSC-%s-%04d", anio, count);
    }
}
