import { useEffect, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import EstadoBadge from '../components/EstadoBadge'

const EMPTY_FORM = {
  idUsuario: '',
  fechaAsignacion: new Date().toISOString().split('T')[0],
  vehiculoPlaca: '',
  observaciones: '',
  paquetes: [],
}

export default function HojasRuta() {
  const [hojas, setHojas] = useState([])
  const [repartidores, setRepartidores] = useState([])
  const [paquetesDisponibles, setPaquetesDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [detallesModal, setDetallesModal] = useState(null)
  const [detalles, setDetalles] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedPaquetes, setSelectedPaquetes] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const cargar = () => {
    setLoading(true)
    Promise.all([
      api.get('/hojas-ruta'),
      api.get('/usuarios/repartidores'),
      api.get('/paquetes?estado=EN_ALMACEN'),
    ]).then(([r1, r2, r3]) => {
      setHojas(r1.data)
      setRepartidores(r2.data)
      setPaquetesDisponibles(r3.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const verDetalles = async (hoja) => {
    setDetallesModal(hoja)
    const r = await api.get(`/hojas-ruta/${hoja.idHojaRuta}/detalles`)
    setDetalles(r.data)
  }

  const togglePaquete = (id) => {
    setSelectedPaquetes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const guardar = async () => {
    setSaving(true)
    setError('')
    try {
      await api.post('/hojas-ruta', {
        ...form,
        idUsuario: parseInt(form.idUsuario),
        paquetes: selectedPaquetes.map((id, i) => ({ idPaquete: id, ordenVisita: i + 1 })),
      })
      setModal(null)
      setSelectedPaquetes([])
      cargar()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al crear hoja de ruta')
    } finally {
      setSaving(false)
    }
  }

  const cambiarEstado = async (id, estado) => {
    await api.patch(`/hojas-ruta/${id}/estado?estado=${estado}`)
    cargar()
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Hojas de Ruta</h1>
            <p>Asignacion de despacho diario</p>
          </div>
        </header>

        <main className="page-body">
          <div className="toolbar">
            <div className="toolbar-left">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {hojas.length} hoja(s) de ruta
              </span>
            </div>
            <div className="toolbar-right">
              <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setSelectedPaquetes([]); setError(''); setModal('crear') }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Hoja de Ruta
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Repartidor</th>
                    <th>Fecha</th>
                    <th>Vehiculo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {hojas.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-state-text">Sin hojas de ruta creadas</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {hojas.map((h) => (
                    <tr key={h.idHojaRuta}>
                      <td style={{ color: 'var(--text-muted)' }}>#{h.idHojaRuta}</td>
                      <td style={{ fontWeight: 500 }}>{h.repartidor?.nombre} {h.repartidor?.apellido}</td>
                      <td>{new Date(h.fechaAsignacion + 'T00:00:00').toLocaleDateString('es-PE')}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                          {h.vehiculoPlaca}
                        </span>
                      </td>
                      <td><EstadoBadge estado={h.estadoRuta} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => verDetalles(h)}>Ver Detalles</button>
                          {h.estadoRuta === 'PENDIENTE' && (
                            <button className="btn btn-primary btn-sm" onClick={() => cambiarEstado(h.idHojaRuta, 'EN_CURSO')}>
                              Iniciar
                            </button>
                          )}
                          {h.estadoRuta === 'EN_CURSO' && (
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-success)' }} onClick={() => cambiarEstado(h.idHojaRuta, 'COMPLETADA')}>
                              Completar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal crear hoja de ruta */}
      {modal === 'crear' && (
        <Modal
          title="Nueva Hoja de Ruta"
          onClose={() => setModal(null)}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar} disabled={saving}>
                {saving ? <span className="spinner" /> : null}
                Crear Hoja
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Repartidor</label>
              <select name="idUsuario" className="form-select" value={form.idUsuario} onChange={(e) => setForm(p => ({ ...p, idUsuario: e.target.value }))} required>
                <option value="">Seleccionar repartidor...</option>
                {repartidores.map((u) => (
                  <option key={u.idUsuario} value={u.idUsuario}>{u.nombre} {u.apellido}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Asignacion</label>
              <input type="date" className="form-input" value={form.fechaAsignacion} onChange={(e) => setForm(p => ({ ...p, fechaAsignacion: e.target.value }))} required />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Placa del Vehiculo</label>
              <input className="form-input" value={form.vehiculoPlaca} onChange={(e) => setForm(p => ({ ...p, vehiculoPlaca: e.target.value }))} placeholder="ABC-123" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones</label>
            <textarea className="form-textarea" value={form.observaciones} onChange={(e) => setForm(p => ({ ...p, observaciones: e.target.value }))} />
          </div>

          <div className="divider" />
          <h4 style={{ color: 'var(--text-secondary)' }}>Paquetes a asignar ({selectedPaquetes.length} seleccionados)</h4>

          <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            {paquetesDisponibles.length === 0 && (
              <div className="empty-state" style={{ padding: 24 }}>
                <div className="empty-state-text">Sin paquetes disponibles en almacen</div>
              </div>
            )}
            {paquetesDisponibles.map((p) => (
              <label key={p.idPaquete} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--color-border)',
                background: selectedPaquetes.includes(p.idPaquete) ? 'var(--color-primary-glow)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                <input
                  type="checkbox"
                  checked={selectedPaquetes.includes(p.idPaquete)}
                  onChange={() => togglePaquete(p.idPaquete)}
                  style={{ accentColor: 'var(--color-primary)', width: 16, height: 16, flexShrink: 0 }}
                />
                <div>
                  <span className="tracking-code">{p.codigoTracking}</span>
                  <span style={{ marginLeft: 10, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{p.descripcion}</span>
                </div>
              </label>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal detalles */}
      {detallesModal && (
        <Modal
          title={`Detalles - Hoja de Ruta #${detallesModal.idHojaRuta}`}
          onClose={() => setDetallesModal(null)}
          size="lg"
        >
          <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>REPARTIDOR</span>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{detallesModal.repartidor?.nombre} {detallesModal.repartidor?.apellido}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>VEHICULO</span>
              <div style={{ fontWeight: 600, marginTop: 2, fontFamily: 'monospace', color: 'var(--color-primary)' }}>{detallesModal.vehiculoPlaca}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ESTADO</span>
              <div style={{ marginTop: 4 }}><EstadoBadge estado={detallesModal.estadoRuta} /></div>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Tracking</th>
                  <th>Descripcion</th>
                  <th>Destino</th>
                  <th>Estado Entrega</th>
                </tr>
              </thead>
              <tbody>
                {detalles.length === 0 && (
                  <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-text">Sin paquetes asignados</div></div></td></tr>
                )}
                {detalles.map((d) => (
                  <tr key={d.idDetalle}>
                    <td style={{ color: 'var(--text-muted)' }}>{d.ordenVisita}</td>
                    <td><span className="tracking-code">{d.paquete?.codigoTracking}</span></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.paquete?.descripcion}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.paquete?.direccionDestino}</td>
                    <td><EstadoBadge estado={d.estadoEntrega} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  )
}
