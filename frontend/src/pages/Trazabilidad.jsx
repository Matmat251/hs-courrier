import { useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import EstadoBadge from '../components/EstadoBadge'

export default function Trazabilidad() {
  const [tracking, setTracking] = useState('')
  const [resultado, setResultado] = useState(null)
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const buscar = async (e) => {
    e.preventDefault()
    if (!tracking.trim()) return
    setLoading(true)
    setError('')
    setResultado(null)
    setHistorial([])
    try {
      const [rPaq, rTraz] = await Promise.all([
        api.get(`/paquetes/tracking/${tracking.trim()}`),
        api.get(`/trazabilidad/tracking/${tracking.trim()}`),
      ])
      setResultado(rPaq.data)
      setHistorial(rTraz.data)
    } catch (err) {
      setError('No se encontro ningun paquete con el codigo: ' + tracking)
    } finally {
      setLoading(false)
    }
  }

  const STATE_DOT_COLOR = {
    EN_ALMACEN:    '#06b6d4',
    EN_RUTA:       '#f59e0b',
    ENTREGADO:     '#10b981',
    NO_ENTREGADO:  '#ef4444',
    EN_DEVOLUCION: '#8b5cf6',
    DEVUELTO:      '#64748b',
  }

  const STATE_ICON = {
    EN_ALMACEN:    'A',
    EN_RUTA:       'R',
    ENTREGADO:     'E',
    NO_ENTREGADO:  'X',
    EN_DEVOLUCION: 'D',
    DEVUELTO:      'V',
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Trazabilidad</h1>
            <p>Consulta el historial completo de movimientos de un paquete</p>
          </div>
        </header>

        <main className="page-body">
          {/* Buscador */}
          <div className="card" style={{ marginBottom: 24 }}>
            <form onSubmit={buscar} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Codigo de Tracking</label>
                <input
                  className="form-input"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="Ej: HSSC-2026-0001"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                Rastrear
              </button>
            </form>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          {resultado && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

              {/* Info del paquete */}
              <div>
                <div className="card" style={{ marginBottom: 16 }}>
                  <h3 style={{ marginBottom: 16 }}>Informacion del Paquete</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>TRACKING</div>
                      <span className="tracking-code" style={{ fontSize: '0.95rem' }}>{resultado.codigoTracking}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>DESCRIPCION</div>
                      <div style={{ fontWeight: 500 }}>{resultado.descripcion}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>PESO</div>
                        <div>{resultado.pesoKg} kg</div>
                      </div>
                      {resultado.dimensiones && (
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>DIMENSIONES</div>
                          <div>{resultado.dimensiones}</div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>ESTADO ACTUAL</div>
                      <EstadoBadge estado={resultado.estado?.nombre} />
                    </div>
                    <div className="divider" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>REMITENTE</div>
                      <div style={{ fontWeight: 500 }}>{resultado.remitente?.razonSocial}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{resultado.remitente?.direccion}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>DESTINATARIO</div>
                      <div style={{ fontWeight: 500 }}>{resultado.destinatario?.razonSocial}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{resultado.direccionDestino}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card">
                <h3 style={{ marginBottom: 20 }}>Historial de Movimientos</h3>
                {historial.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-text">Sin registros de trazabilidad</div>
                  </div>
                ) : (
                  <div className="timeline">
                    {historial.map((t, i) => {
                      const color = STATE_DOT_COLOR[t.estado?.nombre] ?? '#64748b'
                      const icon = STATE_ICON[t.estado?.nombre] ?? '?'
                      return (
                        <div key={t.idTrazabilidad} className="timeline-item">
                          <div
                            className="timeline-dot"
                            style={{ background: `${color}20`, color, border: `2px solid ${color}` }}
                          >
                            {icon}
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-time">
                              {new Date(t.fechaHora).toLocaleString('es-PE', {
                                year: 'numeric', month: 'short', day: '2-digit',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </div>
                            <div className="timeline-state">
                              <EstadoBadge estado={t.estado?.nombre} />
                            </div>
                            <div className="timeline-detail">
                              Operador: {t.usuario?.nombre} {t.usuario?.apellido}
                              {t.ubicacionTexto && ` — ${t.ubicacionTexto}`}
                              {t.latitud && t.longitud && (
                                <span style={{ color: 'var(--text-muted)' }}>
                                  {' '}({parseFloat(t.latitud).toFixed(4)}, {parseFloat(t.longitud).toFixed(4)})
                                </span>
                              )}
                            </div>
                            {t.codigoLeido && (
                              <div style={{ marginTop: 6 }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Codigo leido: </span>
                                <span className="tracking-code">{t.codigoLeido}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {!resultado && !error && !loading && (
            <div className="empty-state" style={{ paddingTop: 80 }}>
              <div className="empty-state-icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="empty-state-text">Ingresa un codigo de tracking para rastrear el paquete</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
