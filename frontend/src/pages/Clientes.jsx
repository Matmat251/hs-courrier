import { useEffect, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'

const EMPTY = {
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  razonSocial: '',
  direccion: '',
  telefono: '',
  correo: '',
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [buscar, setBuscar] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'crear' | 'editar'
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const cargar = () => {
    setLoading(true)
    api.get('/clientes').then((r) => setClientes(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const filtrados = clientes.filter((c) =>
    c.razonSocial.toLowerCase().includes(buscar.toLowerCase()) ||
    c.numeroDocumento.includes(buscar)
  )

  const abrirCrear = () => { setForm(EMPTY); setError(''); setModal('crear') }
  const abrirEditar = (c) => {
    setForm({ ...c })
    setError('')
    setModal('editar')
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const guardar = async () => {
    setSaving(true)
    setError('')
    try {
      if (modal === 'crear') {
        await api.post('/clientes', form)
      } else {
        await api.put(`/clientes/${form.idCliente}`, form)
      }
      setModal(null)
      cargar()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm('Confirmar eliminacion del cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      cargar()
    } catch (err) {
      alert(err.response?.data?.message ?? 'Error al eliminar')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Clientes</h1>
            <p>Remitentes y destinatarios registrados</p>
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
                  placeholder="Buscar por nombre o documento..."
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {filtrados.length} resultado(s)
              </span>
            </div>
            <div className="toolbar-right">
              <button className="btn btn-primary" onClick={abrirCrear}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Cliente
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
                    <th>Documento</th>
                    <th>Razon Social</th>
                    <th>Direccion</th>
                    <th>Telefono</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                            </svg>
                          </div>
                          <div className="empty-state-text">Sin clientes registrados</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {filtrados.map((c) => (
                    <tr key={c.idCliente}>
                      <td>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.tipoDocumento}</span>{' '}
                        <strong>{c.numeroDocumento}</strong>
                      </td>
                      <td style={{ fontWeight: 500 }}>{c.razonSocial}</td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.direccion}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.telefono ?? '-'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.correo ?? '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(c)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.idCliente)}>Eliminar</button>
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

      {modal && (
        <Modal
          title={modal === 'crear' ? 'Nuevo Cliente' : 'Editar Cliente'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar} disabled={saving}>
                {saving ? <span className="spinner" /> : null}
                Guardar
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Tipo de Documento</label>
              <select name="tipoDocumento" className="form-select" value={form.tipoDocumento} onChange={handleChange}>
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carnet de Extranjeria</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Numero de Documento</label>
              <input name="numeroDocumento" className="form-input" value={form.numeroDocumento} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Razon Social / Nombre completo</label>
            <input name="razonSocial" className="form-input" value={form.razonSocial} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Direccion</label>
            <input name="direccion" className="form-input" value={form.direccion} onChange={handleChange} required />
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Telefono</label>
              <input name="telefono" className="form-input" value={form.telefono ?? ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Correo</label>
              <input name="correo" type="email" className="form-input" value={form.correo ?? ''} onChange={handleChange} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
