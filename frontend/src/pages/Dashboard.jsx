import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import EstadoBadge from '../components/EstadoBadge'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const COLORS = ['#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

export default function Dashboard() {
  const [resumen, setResumen] = useState(null)
  const [paquetes, setPaquetes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/paquetes/resumen'),
      api.get('/paquetes'),
    ]).then(([r1, r2]) => {
      setResumen(r1.data)
      setPaquetes(r2.data.slice(0, 8))
    }).finally(() => setLoading(false))
  }, [])

  const chartData = resumen
    ? [
        { name: 'En Almacen',   value: Number(resumen.enAlmacen)    },
        { name: 'En Ruta',      value: Number(resumen.enRuta)       },
        { name: 'Entregados',   value: Number(resumen.entregados)   },
        { name: 'No Entregados',value: Number(resumen.noEntregados) },
      ]
    : []

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1>Dashboard</h1>
            <p>Resumen general del sistema logistico</p>
          </div>
          <Link to="/paquetes" className="btn btn-primary btn-sm">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Paquete
          </Link>
        </header>

        <main className="page-body">
          {/* Stats */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon cyan">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="stat-value">{resumen?.total ?? 0}</div>
                <div className="stat-label">Total Paquetes</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon cyan">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <div className="stat-value">{resumen?.enAlmacen ?? 0}</div>
                <div className="stat-label">En Almacen</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <div className="stat-value">{resumen?.enRuta ?? 0}</div>
                <div className="stat-label">En Ruta</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="stat-value">{resumen?.entregados ?? 0}</div>
                <div className="stat-label">Entregados</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="stat-value">{resumen?.noEntregados ?? 0}</div>
                <div className="stat-label">No Entregados</div>
              </div>
            </div>
          </div>

          {/* Grafico + Tabla ultimos paquetes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

            {/* Grafico de barras */}
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Distribucion por Estado</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#1a2236',
                      border: '1px solid #1e2d45',
                      borderRadius: 8,
                      color: '#f1f5f9',
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ultimos paquetes */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Ultimos Paquetes</h3>
                <Link to="/paquetes" className="btn btn-ghost btn-sm">Ver todos</Link>
              </div>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Tracking</th>
                      <th>Descripcion</th>
                      <th>Destinatario</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paquetes.length === 0 && (
                      <tr>
                        <td colSpan={4}>
                          <div className="empty-state">
                            <div className="empty-state-text">Sin paquetes registrados</div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {paquetes.map((p) => (
                      <tr key={p.idPaquete}>
                        <td><span className="tracking-code">{p.codigoTracking}</span></td>
                        <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{p.destinatario?.razonSocial}</td>
                        <td><EstadoBadge estado={p.estado?.nombre} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
