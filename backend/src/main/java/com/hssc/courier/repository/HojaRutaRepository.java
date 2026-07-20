package com.hssc.courier.repository;

import com.hssc.courier.model.HojaRuta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HojaRutaRepository extends JpaRepository<HojaRuta, Integer> {

    List<HojaRuta> findByRepartidor_IdUsuario(Integer idUsuario);

    List<HojaRuta> findByFechaAsignacion(LocalDate fecha);

    List<HojaRuta> findByEstadoRuta(String estadoRuta);

    List<HojaRuta> findByRepartidor_IdUsuarioAndFechaAsignacion(Integer idUsuario, LocalDate fecha);
}
