import { useEffect, useRef, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import EstadoBadge from '../components/EstadoBadge'
import { useAuth } from '../context/AuthContext'

export default function Escaneo() {
  const { user } = useAuth()
  const [codigoManual, setCodigoManual] = useState('')
  const [estados, setEstados] = useState([])
  const [idNuevoEstado, setIdNuevoEstado] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [coords, setCoords] = useState(null)
  const [paqueteEncontrado, setPaqueteEncontrado] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const videoRef = useRef(null)
  const [camaraActiva, setCamaraActiva] = useState(false)
  const [streamRef, setStreamRef] = useState(null)

  useEffect(() => {
    api.get('/paquetes/estados').then((r) => {
      setEstados(r.data)
      if (r.data.length > 0) setIdNuevoEstado(r.data[0].idEstado)
    })
    // Intentar obtener coordenadas GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords(null),
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [])

  const activarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setStreamRef(stream)
      setCamaraActiva(true)
    } catch {
      setError('No se pudo acceder a la camara. Usa el ingreso manual.')
    }
  }

  const detenerCamara = () => {
    if (streamRef) {
      streamRef.getTracks().forEach((t) => t.stop())
      setStreamRef(null)
    }
    setCamaraActiva(false)
  }

  const buscarPaquete = async (codigo) => {
    if (!codigo.trim()) return
    setLoading(true)
    setError('')
    setPaqueteEncontrado(null)
    try {
      const r = await api.get(`/paquetes/tracking/${codigo.trim()}`)
      setPaqueteEncontrado(r.data)
    } catch {
      setError('Paquete no encontrado con codigo: ' + codigo)
    } finally {
      setLoading(false)
    }
  }

  const procesarEscaneo = async () => {
    if (!paqueteEncontrado || !idNuevoEstado) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        codigoBarras: paqueteEncontrado.codigoTracking,
        idNuevoEstado: parseInt(idNuevoEstado),
        idUsuario: user.idUsuario,
        ubicacionTexto: ubicacion || null,
        latitud: coords?.lat ?? null,
        longitud: coords?.lng ?? null,
      }
      const r = await api.post('/paquetes/escanear', payload)
      setResultado(r.data)
      setSuccess('Escaneo registrado correctamente. Estado actualizado.')
      setPaqueteEncontrado(null)
      setCodigoManual('')
      setUbicacion('')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al procesar escaneo')
    } finally {
      setLoading(false)
    }
  }

  const limpiar = () => {
    setPaqueteEncontrado(null)
    setResultado(null)
    setCodigoManual('')
    setError('')
    setSuccess('')
    setUbicacion('')
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Escaneo Movil</h1>
            <p>Registra el movimiento de un paquete mediante codigo de barras o ingreso manual</p>
          </div>
        </header>

        <main className="page-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* Panel izquierdo: entrada */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Camara */}
              <div className="card">
                <h3 style={{ marginBottom: 16 }}>Escaneo por Camara</h3>
                {!camaraActiva ? (
                  <button className="btn btn-secondary" onClick={activarCamara} style={{ width: '100%' }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    Activar Camara
                  </button>
                ) : (
                  <div>
                    <div className="scanner-container">
                      <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                      <div className="scanner-overlay">
                        <div className="scanner-target">
                          <div className="scan-line" />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <button className="btn btn-danger btn-sm" onClick={detenerCamara}>Detener Camara</button>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        Apunta al codigo de barras del paquete e ingresa el codigo manualmente abajo.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ingreso manual */}
              <div className="card">
                <h3 style={{ marginBottom: 16 }}>Ingreso Manual del Codigo</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="form-input"
                    value={codigoManual}
                    onChange={(e) => setCodigoManual(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && buscarPaquete(codigoManual)}
                    placeholder="HSSC-2026-0001"
                    style={{ fontFamily: 'monospace', flex: 1 }}
                  />
                  <button className="btn btn-primary" onClick={() => buscarPaquete(codigoManual)} disabled={loading}>
                    {loading ? <span className="spinner" /> : 'Buscar'}
                  </button>
                </div>
              </div>

              {/* GPS */}
              <div className="card card-sm">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: coords ? 'var(--color-success)' : 'var(--color-danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {coords
                      ? `GPS activo: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                      : 'GPS no disponible — se guardara sin coordenadas'}
                  </span>
                </div>
              </div>
            </div>

            {/* Panel derecho: paquete encontrado y accion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {resultado && !paqueteEncontrado && (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3>Ultimo Registro</h3>
                    <button className="btn btn-ghost btn-sm" onClick={limpiar}>Nuevo</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estado actualizado a:</div>
                    <EstadoBadge estado={resultado.estado?.nombre} />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {new Date(resultado.fechaHora).toLocaleString('es-PE')}
                    </div>
                  </div>
                </div>
              )}

              {paqueteEncontrado && (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <h3>Paquete Encontrado</h3>
                    <button className="btn btn-ghost btn-sm" onClick={limpiar}>Limpiar</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TRACKING</span>
                      <div><span className="tracking-code">{paqueteEncontrado.codigoTracking}</span></div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DESCRIPCION</span>
                      <div style={{ fontWeight: 500 }}>{paqueteEncontrado.descripcion}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DESTINATARIO</span>
                      <div>{paqueteEncontrado.destinatario?.razonSocial}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{paqueteEncontrado.direccionDestino}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTADO ACTUAL</span>
                      <div style={{ marginTop: 4 }}><EstadoBadge estado={paqueteEncontrado.estado?.nombre} /></div>
                    </div>
                  </div>

                  <div className="divider" style={{ marginBottom: 16 }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Nuevo Estado</label>
                      <select
                        className="form-select"
                        value={idNuevoEstado}
                        onChange={(e) => setIdNuevoEstado(e.target.value)}
                      >
                        {estados.map((e) => (
                          <option key={e.idEstado} value={e.idEstado}>{e.nombre.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ubicacion (opcional)</label>
                      <input
                        className="form-input"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        placeholder="Ej: Almacen Central - Lima"
                      />
                    </div>

                    <button
                      className="btn btn-primary btn-lg"
                      onClick={procesarEscaneo}
                      disabled={loading}
                      style={{ marginTop: 4 }}
                    >
                      {loading ? <span className="spinner" /> : (
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      Confirmar Escaneo
                    </button>
                  </div>
                </div>
              )}

              {!paqueteEncontrado && !resultado && (
                <div className="card">
                  <div className="empty-state" style={{ padding: 40 }}>
                    <div className="empty-state-icon">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5V16a2 2 0 00-2-2H6a2 2 0 00-2 2v.5" />
                      </svg>
                    </div>
                    <div className="empty-state-text">Escanea o ingresa un codigo de tracking para comenzar</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
