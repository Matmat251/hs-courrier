package com.hssc.courier.repository;

import com.hssc.courier.model.Trazabilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrazabilidadRepository extends JpaRepository<Trazabilidad, Integer> {

    List<Trazabilidad> findByPaquete_IdPaqueteOrderByFechaHoraAsc(Integer idPaquete);

    List<Trazabilidad> findByPaquete_CodigoTrackingOrderByFechaHoraAsc(String codigoTracking);

    List<Trazabilidad> findByUsuario_IdUsuarioOrderByFechaHoraDesc(Integer idUsuario);
}
