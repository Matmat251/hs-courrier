const STATE_CONFIG = {
  EN_ALMACEN:    { label: 'En Almacen',    cls: 'badge-cyan'   },
  EN_RUTA:       { label: 'En Ruta',       cls: 'badge-orange' },
  ENTREGADO:     { label: 'Entregado',     cls: 'badge-green'  },
  NO_ENTREGADO:  { label: 'No Entregado',  cls: 'badge-red'    },
  EN_DEVOLUCION: { label: 'En Devolucion', cls: 'badge-purple' },
  DEVUELTO:      { label: 'Devuelto',      cls: 'badge-gray'   },
  PENDIENTE:     { label: 'Pendiente',     cls: 'badge-cyan'   },
  EN_CURSO:      { label: 'En Curso',      cls: 'badge-orange' },
  COMPLETADA:    { label: 'Completada',    cls: 'badge-green'  },
  CANCELADA:     { label: 'Cancelada',     cls: 'badge-red'    },
}

export default function EstadoBadge({ estado }) {
  const cfg = STATE_CONFIG[estado] ?? { label: estado, cls: 'badge-gray' }
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
}
