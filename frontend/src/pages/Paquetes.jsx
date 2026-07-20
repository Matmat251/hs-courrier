import { useEffect, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import EstadoBadge from '../components/EstadoBadge'

const EMPTY_FORM = {
  descripcion: '',
  pesoKg: '',
  dimensiones: '',
  idRemitente: '',
  idDestinatario: '',
  direccionDestino: '',
  observaciones: '',
}

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([])
  const [clientes, setClientes] = useState([])
  const [buscar, setBuscar] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const cargar = () => {
    setLoading(true)
    Promise.all([
      api.get('/paquetes'),
      api.get('/clientes'),
    ]).then(([r1, r2]) => {
      setPaquetes(r1.data)
      setClientes(r2.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const filtrados = paquetes.filter((p) => {
    const matchText =
      p.codigoTracking.toLowerCase().includes(buscar.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(buscar.toLowerCase()) ||
      p.destinatario?.razonSocial?.toLowerCase().includes(buscar.toLowerCase())
    const matchEstado = filtroEstado ? p.estado?.nombre === filtroEstado : true
    return matchText && matchEstado
  })

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const guardar = async () => {
    setSaving(true)
    setError('')
    try {
      await api.post('/paquetes', {
        ...form,
        pesoKg: parseFloat(form.pesoKg),
        idRemitente: parseInt(form.idRemitente),
        idDestinatario: parseInt(form.idDestinatario),
      })
      setModal(null)
      cargar()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al registrar paquete')
    } finally {
      setSaving(false)
    }
  }

  const ESTADOS = ['EN_ALMACEN', 'EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'EN_DEVOLUCION', 'DEVUELTO']

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Paquetes</h1>
            <p>Gestion de encomiendas y seguimiento</p>
          </div>
        </header>

        <main className="page-body">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-input-wrapper">
                <span className="search-icon">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  className="form-input search-input"
                  placeholder="Buscar por tracking, descripcion o destinatario..."
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                />
              </div>
              <select
                className="form-select"
                style={{ width: 160 }}
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {ESTADOS.map((e) => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
              </select>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {filtrados.length} paquete(s)
              </span>
            </div>
            <div className="toolbar-right">
              <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setError(''); setModal('crear') }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Registrar Paquete
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
                    <th>Tracking</th>
                    <th>Descripcion</th>
                    <th>Peso</th>
                    <th>Remitente</th>
                    <th>Destinatario</th>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div className="empty-state-text">Sin paquetes que mostrar</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {filtrados.map((p) => (
                    <tr key={p.idPaquete}>
                      <td><span className="tracking-code">{p.codigoTracking}</span></td>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.pesoKg} kg</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{p.remitente?.razonSocial}</td>
                      <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{p.destinatario?.razonSocial}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.direccionDestino}</td>
                      <td><EstadoBadge estado={p.estado?.nombre} /></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {new Date(p.fechaRegistro).toLocaleDateString('es-PE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {modal === 'crear' && (
        <Modal
          title="Registrar Nuevo Paquete"
          onClose={() => setModal(null)}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar} disabled={saving}>
                {saving ? <span className="spinner" /> : null}
                Registrar
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Descripcion del paquete</label>
            <input name="descripcion" className="form-input" value={form.descripcion} onChange={handleChange} required placeholder="Ej: Laptop HP ProBook 450" />
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input name="pesoKg" type="number" step="0.001" min="0.001" className="form-input" value={form.pesoKg} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Dimensiones</label>
              <input name="dimensiones" className="form-input" value={form.dimensiones} onChange={handleChange} placeholder="Ej: 30x20x15cm" />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Remitente</label>
              <select name="idRemitente" className="form-select" value={form.idRemitente} onChange={handleChange} required>
                <option value="">Seleccionar remitente...</option>
                {clientes.map((c) => (
                  <option key={c.idCliente} value={c.idCliente}>{c.razonSocial}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Destinatario</label>
              <select name="idDestinatario" className="form-select" value={form.idDestinatario} onChange={handleChange} required>
                <option value="">Seleccionar destinatario...</option>
                {clientes.map((c) => (
                  <option key={c.idCliente} value={c.idCliente}>{c.razonSocial}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Direccion de destino</label>
            <input name="direccionDestino" className="form-input" value={form.direccionDestino} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones</label>
            <textarea name="observaciones" className="form-textarea" value={form.observaciones} onChange={handleChange} placeholder="Fragil, no voltear, etc." />
          </div>
        </Modal>
      )}
    </div>
  )
}
