package com.hssc.courier.repository;

import com.hssc.courier.model.EstadoPaquete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoPaqueteRepository extends JpaRepository<EstadoPaquete, Integer> {

    Optional<EstadoPaquete> findByNombre(String nombre);
}
