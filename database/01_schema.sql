-- ============================================================
-- HSSC Courier - Schema de Base de Datos
-- Motor: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS hssc_courier
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE hssc_courier;

-- ------------------------------------------------------------
-- Tabla de Roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_roles (
    idRol       INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(200) NULL,
    PRIMARY KEY (idRol),
    UNIQUE KEY uk_rol_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla de Usuarios (Empleados)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_usuarios (
    idUsuario INT          NOT NULL AUTO_INCREMENT,
    nombre    VARCHAR(100) NOT NULL,
    apellido  VARCHAR(100) NOT NULL,
    correo    VARCHAR(150) NOT NULL,
    password  VARCHAR(255) NOT NULL,
    idRol     INT          NOT NULL,
    estado    TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    PRIMARY KEY (idUsuario),
    UNIQUE KEY uk_usuario_correo (correo),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (idRol) REFERENCES tbl_roles (idRol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla de Clientes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_clientes (
    idCliente       INT          NOT NULL AUTO_INCREMENT,
    tipoDocumento   VARCHAR(10)  NOT NULL COMMENT 'DNI, RUC, CE',
    numeroDocumento VARCHAR(20)  NOT NULL,
    razonSocial     VARCHAR(200) NOT NULL,
    direccion       VARCHAR(300) NOT NULL,
    telefono        VARCHAR(20)  NULL,
    correo          VARCHAR(150) NULL,
    PRIMARY KEY (idCliente),
    UNIQUE KEY uk_cliente_documento (tipoDocumento, numeroDocumento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla de Estados de Paquete
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_estados (
    idEstado    INT         NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200) NULL,
    PRIMARY KEY (idEstado),
    UNIQUE KEY uk_estado_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla de Paquetes (Encomiendas)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_paquetes (
    idPaquete       INT            NOT NULL AUTO_INCREMENT,
    codigoTracking  VARCHAR(50)    NOT NULL COMMENT 'Codigo de barras unico',
    descripcion     VARCHAR(500)   NOT NULL,
    pesoKg          DECIMAL(8, 3)  NOT NULL,
    dimensiones     VARCHAR(100)   NULL COMMENT 'Ej: 30x20x15cm',
    estadoActual    INT            NOT NULL,
    idRemitente     INT            NOT NULL,
    idDestinatario  INT            NOT NULL,
    direccionDestino VARCHAR(300)  NOT NULL,
    fechaRegistro   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones   TEXT           NULL,
    PRIMARY KEY (idPaquete),
    UNIQUE KEY uk_paquete_tracking (codigoTracking),
    CONSTRAINT fk_paquete_estado      FOREIGN KEY (estadoActual)   REFERENCES tbl_estados  (idEstado),
    CONSTRAINT fk_paquete_remitente   FOREIGN KEY (idRemitente)    REFERENCES tbl_clientes (idCliente),
    CONSTRAINT fk_paquete_destinatario FOREIGN KEY (idDestinatario) REFERENCES tbl_clientes (idCliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla de Hojas de Ruta
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_hojas_ruta (
    idHojaRuta      INT         NOT NULL AUTO_INCREMENT,
    idUsuario       INT         NOT NULL COMMENT 'Repartidor asignado',
    fechaAsignacion DATE        NOT NULL,
    vehiculoPlaca   VARCHAR(20) NOT NULL,
    estadoRuta      VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' COMMENT 'PENDIENTE, EN_CURSO, COMPLETADA, CANCELADA',
    observaciones   TEXT        NULL,
    fechaCreacion   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idHojaRuta),
    CONSTRAINT fk_hoja_ruta_usuario FOREIGN KEY (idUsuario) REFERENCES tbl_usuarios (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla de Detalles de Ruta (Asociativa: HojaRuta <-> Paquete)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_detalles_ruta (
    idDetalle       INT         NOT NULL AUTO_INCREMENT,
    idHojaRuta      INT         NOT NULL,
    idPaquete       INT         NOT NULL,
    ordenVisita     INT         NOT NULL DEFAULT 1,
    estadoEntrega   VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' COMMENT 'PENDIENTE, ENTREGADO, NO_ENTREGADO',
    fechaEntrega    DATETIME    NULL,
    observaciones   VARCHAR(300) NULL,
    PRIMARY KEY (idDetalle),
    UNIQUE KEY uk_detalle_hoja_paquete (idHojaRuta, idPaquete),
    CONSTRAINT fk_detalle_hoja_ruta FOREIGN KEY (idHojaRuta) REFERENCES tbl_hojas_ruta  (idHojaRuta),
    CONSTRAINT fk_detalle_paquete   FOREIGN KEY (idPaquete)  REFERENCES tbl_paquetes    (idPaquete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabla de Trazabilidad (Log historico inmutable)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_trazabilidad (
    idTrazabilidad  INT          NOT NULL AUTO_INCREMENT,
    idPaquete       INT          NOT NULL,
    idUsuario       INT          NOT NULL,
    idEstado        INT          NOT NULL,
    codigoLeido     VARCHAR(50)  NULL COMMENT 'Codigo escaneado por la camara',
    fechaHora       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitud         DECIMAL(10, 7) NULL,
    longitud        DECIMAL(10, 7) NULL,
    ubicacionTexto  VARCHAR(300) NULL,
    PRIMARY KEY (idTrazabilidad),
    CONSTRAINT fk_traz_paquete  FOREIGN KEY (idPaquete)  REFERENCES tbl_paquetes (idPaquete),
    CONSTRAINT fk_traz_usuario  FOREIGN KEY (idUsuario)  REFERENCES tbl_usuarios (idUsuario),
    CONSTRAINT fk_traz_estado   FOREIGN KEY (idEstado)   REFERENCES tbl_estados  (idEstado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Indices adicionales para consultas frecuentes
-- ------------------------------------------------------------
CREATE INDEX idx_paquete_estado    ON tbl_paquetes      (estadoActual);
CREATE INDEX idx_paquete_fecha     ON tbl_paquetes      (fechaRegistro);
CREATE INDEX idx_hoja_ruta_fecha   ON tbl_hojas_ruta    (fechaAsignacion);
CREATE INDEX idx_hoja_ruta_usuario ON tbl_hojas_ruta    (idUsuario);
CREATE INDEX idx_traz_paquete      ON tbl_trazabilidad  (idPaquete);
CREATE INDEX idx_traz_fecha        ON tbl_trazabilidad  (fechaHora);
