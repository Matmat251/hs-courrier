-- ============================================================
-- HSSC Courier - Datos Iniciales (Seed)
-- Ejecutar DESPUES de 01_schema.sql
-- ============================================================

USE hssc_courier;

-- ------------------------------------------------------------
-- Roles del sistema
-- ------------------------------------------------------------
INSERT INTO tbl_roles (nombre, descripcion) VALUES
    ('ADMIN',         'Administrador del sistema con acceso total'),
    ('RECEPCIONISTA', 'Registra y clasifica paquetes en almacen'),
    ('COORDINADOR',   'Crea y gestiona las hojas de ruta de despacho'),
    ('REPARTIDOR',    'Ejecuta las entregas y escanea paquetes en campo');

-- ------------------------------------------------------------
-- Estados de paquete
-- ------------------------------------------------------------
INSERT INTO tbl_estados (nombre, descripcion) VALUES
    ('EN_ALMACEN',     'El paquete fue recibido y esta en almacen'),
    ('EN_RUTA',        'El paquete esta siendo transportado por el repartidor'),
    ('ENTREGADO',      'El paquete fue entregado al destinatario'),
    ('NO_ENTREGADO',   'El intento de entrega fallo'),
    ('EN_DEVOLUCION',  'El paquete esta siendo devuelto al remitente'),
    ('DEVUELTO',       'El paquete fue devuelto al remitente');

-- ------------------------------------------------------------
-- Usuarios de prueba
-- Passwords cifradas con BCrypt (valor en texto plano: "Admin1234")
-- ------------------------------------------------------------
INSERT INTO tbl_usuarios (nombre, apellido, correo, password, idRol, estado) VALUES
    ('Admin',     'Sistema',    'admin@hssc.com',        '$2a$10$kZdRNeWsj1EQwxBba9hQOusBaflqDc6ul7QFZ2/1/NNjuuWKsd/Ou', 1, 1),
    ('Maria',     'Lopez',      'recepcion@hssc.com',    '$2a$10$kZdRNeWsj1EQwxBba9hQOusBaflqDc6ul7QFZ2/1/NNjuuWKsd/Ou', 2, 1),
    ('Carlos',    'Mendoza',    'coordinador@hssc.com',  '$2a$10$kZdRNeWsj1EQwxBba9hQOusBaflqDc6ul7QFZ2/1/NNjuuWKsd/Ou', 3, 1),
    ('Jorge',     'Ramirez',    'repartidor1@hssc.com',  '$2a$10$kZdRNeWsj1EQwxBba9hQOusBaflqDc6ul7QFZ2/1/NNjuuWKsd/Ou', 4, 1),
    ('Luis',      'Vargas',     'repartidor2@hssc.com',  '$2a$10$kZdRNeWsj1EQwxBba9hQOusBaflqDc6ul7QFZ2/1/NNjuuWKsd/Ou', 4, 1);

-- ------------------------------------------------------------
-- Clientes de prueba
-- ------------------------------------------------------------
INSERT INTO tbl_clientes (tipoDocumento, numeroDocumento, razonSocial, direccion, telefono, correo) VALUES
    ('RUC', '20512345678', 'Importaciones El Sol SAC',    'Av. Industrial 1450, Lima',          '01-3456789', 'ventas@elsol.com'),
    ('RUC', '20609876543', 'Tech Solutions Peru SRL',     'Calle Los Pinos 234, Miraflores',    '01-7654321', 'compras@techperu.com'),
    ('DNI', '45678901',    'Ana Maria Torres Chavez',     'Jr. Las Flores 789, San Borja',      '987654321',  'ana.torres@gmail.com'),
    ('DNI', '32109876',    'Roberto Silva Huanca',        'Av. La Marina 3200, San Miguel',     '976543210',  'rsilva@outlook.com'),
    ('RUC', '20734567890', 'Comercial Norte EIRL',        'Calle Principal 100, Los Olivos',    '01-5432167', 'info@comnorte.pe'),
    ('CE',  'CE-987654',   'Zhang Wei Importaciones',     'Av. Argentina 560, Callao',          '999888777',  'zw.imports@email.com');

-- ------------------------------------------------------------
-- Paquetes de prueba
-- ------------------------------------------------------------
INSERT INTO tbl_paquetes (codigoTracking, descripcion, pesoKg, dimensiones, estadoActual, idRemitente, idDestinatario, direccionDestino, observaciones) VALUES
    ('HSSC-2026-0001', 'Laptop HP ProBook 450',          2.500, '38x26x3cm',   1, 1, 3, 'Jr. Las Flores 789, San Borja',         'Fragil, no voltear'),
    ('HSSC-2026-0002', 'Repuestos electronicos varios',  0.800, '20x15x10cm',  1, 2, 4, 'Av. La Marina 3200, San Miguel',        NULL),
    ('HSSC-2026-0003', 'Ropa deportiva (caja)',           3.200, '45x35x20cm',  2, 5, 3, 'Jr. Las Flores 789, San Borja',         NULL),
    ('HSSC-2026-0004', 'Libros universitarios',           4.100, '40x30x25cm',  3, 1, 6, 'Av. Argentina 560, Callao',             'Entregar en mano'),
    ('HSSC-2026-0005', 'Teclado mecanico gaming',         1.200, '45x15x5cm',   1, 2, 5, 'Calle Principal 100, Los Olivos',       NULL),
    ('HSSC-2026-0006', 'Monitor LED 24 pulgadas',         5.500, '60x45x15cm',  4, 3, 1, 'Av. Industrial 1450, Lima',             'Segunda entrega');

-- ------------------------------------------------------------
-- Hoja de ruta de prueba
-- ------------------------------------------------------------
INSERT INTO tbl_hojas_ruta (idUsuario, fechaAsignacion, vehiculoPlaca, estadoRuta) VALUES
    (4, CURDATE(), 'ABC-123', 'EN_CURSO'),
    (5, CURDATE(), 'XYZ-456', 'PENDIENTE');

-- Detalles de la hoja de ruta 1
INSERT INTO tbl_detalles_ruta (idHojaRuta, idPaquete, ordenVisita, estadoEntrega) VALUES
    (1, 3, 1, 'ENTREGADO'),
    (1, 1, 2, 'PENDIENTE');

-- Detalles de la hoja de ruta 2
INSERT INTO tbl_detalles_ruta (idHojaRuta, idPaquete, ordenVisita, estadoEntrega) VALUES
    (2, 2, 1, 'PENDIENTE'),
    (2, 5, 2, 'PENDIENTE');

-- ------------------------------------------------------------
-- Registros de trazabilidad de prueba
-- ------------------------------------------------------------
INSERT INTO tbl_trazabilidad (idPaquete, idUsuario, idEstado, codigoLeido, fechaHora, latitud, longitud, ubicacionTexto) VALUES
    (3, 2, 1, 'HSSC-2026-0003', DATE_SUB(NOW(), INTERVAL 8 HOUR),  -12.0464,  -77.0428, 'Almacen Central - Lima'),
    (3, 4, 2, 'HSSC-2026-0003', DATE_SUB(NOW(), INTERVAL 3 HOUR),  -12.1011,  -77.0220, 'San Borja - Av. Guardia Civil'),
    (3, 4, 3, 'HSSC-2026-0003', DATE_SUB(NOW(), INTERVAL 1 HOUR),  -12.1088,  -77.0177, 'Jr. Las Flores 789, San Borja'),
    (4, 2, 1, 'HSSC-2026-0004', DATE_SUB(NOW(), INTERVAL 24 HOUR), -12.0464,  -77.0428, 'Almacen Central - Lima'),
    (4, 5, 2, 'HSSC-2026-0004', DATE_SUB(NOW(), INTERVAL 20 HOUR), -12.0560,  -77.0826, 'Callao - Av. Venezuela'),
    (4, 5, 3, 'HSSC-2026-0004', DATE_SUB(NOW(), INTERVAL 18 HOUR), -12.0553,  -77.1196, 'Av. Argentina 560, Callao');
