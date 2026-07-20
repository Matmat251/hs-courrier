package com.hssc.courier.repository;

import com.hssc.courier.model.DetalleRuta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleRutaRepository extends JpaRepository<DetalleRuta, Integer> {

    List<DetalleRuta> findByHojaRuta_IdHojaRuta(Integer idHojaRuta);

    List<DetalleRuta> findByPaquete_IdPaquete(Integer idPaquete);

    boolean existsByHojaRuta_IdHojaRutaAndPaquete_IdPaquete(Integer idHojaRuta, Integer idPaquete);
}
