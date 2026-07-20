package com.hssc.courier.repository;

import com.hssc.courier.model.Paquete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaqueteRepository extends JpaRepository<Paquete, Integer> {

    Optional<Paquete> findByCodigoTracking(String codigoTracking);

    boolean existsByCodigoTracking(String codigoTracking);

    List<Paquete> findByEstado_Nombre(String nombreEstado);

    List<Paquete> findByDescripcionContainingIgnoreCase(String texto);

    @Query("SELECT COUNT(p) FROM Paquete p WHERE p.estado.nombre = :estado")
    long countByEstadoNombre(String estado);
}
