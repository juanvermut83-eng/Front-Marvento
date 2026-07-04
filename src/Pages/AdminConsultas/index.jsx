import { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../Context/AppContext'
import { URL } from '../../Urls'
import './styles.css'

const estados = ['NUEVA', 'LEIDA', 'RESPONDIDA', 'ARCHIVADA']

const estadoLabels = {
  NUEVA: 'Nueva',
  LEIDA: 'Leida',
  RESPONDIDA: 'Respondida',
  ARCHIVADA: 'Archivada',
}

const motivoLabels = {
  compra: 'Compra online',
  mayorista: 'Venta mayorista',
  evento: 'Eventos',
  'puntos-de-venta': 'Puntos de venta',
  otro: 'Otro',
}

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(value))
    : '-'

const AdminConsultas = () => {
  const { userLog } = useContext(AppContext)
  const [consultas, setConsultas] = useState([])
  const [resumen, setResumen] = useState({ total: 0, NUEVA: 0, LEIDA: 0, RESPONDIDA: 0, ARCHIVADA: 0 })
  const [estadoFiltro, setEstadoFiltro] = useState('TODAS')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')

  const fetchConsultas = async () => {
    try {
      setError('')
      const response = await fetch(`${URL}/consultas/admin`, {
        headers: {
          Authorization: `Bearer ${userLog?.token}`,
        },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudieron obtener las consultas')
      }

      setConsultas(data.consultas || [])
      setResumen(data.resumen || { total: 0, NUEVA: 0, LEIDA: 0, RESPONDIDA: 0, ARCHIVADA: 0 })
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron obtener las consultas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userLog?.token) {
      fetchConsultas()
    }
  }, [userLog?.token])

  const consultasFiltradas = useMemo(() => {
    if (estadoFiltro === 'TODAS') return consultas
    return consultas.filter((consulta) => consulta.estado === estadoFiltro)
  }, [consultas, estadoFiltro])

  const updateEstado = async (consulta, estado) => {
    if (consulta.estado === estado) return

    try {
      setUpdatingId(consulta.id)
      const response = await fetch(`${URL}/consultas/${consulta.id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userLog?.token}`,
        },
        body: JSON.stringify({ estado }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo actualizar la consulta')
      }

      setConsultas((items) => items.map((item) => (item.id === consulta.id ? data.consulta : item)))
      await fetchConsultas()
    } catch (requestError) {
      setError(requestError.message || 'No se pudo actualizar la consulta')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <section className="admin-consultas">
      <header className="admin-consultas__header">
        <span>Gestion</span>
        <h1>Consultas</h1>
        <p>Mensajes enviados desde el formulario de contacto del sitio.</p>
      </header>

      <div className="admin-consultas__metrics">
        <article>
          <span>Total</span>
          <strong>{resumen.total}</strong>
        </article>
        <article>
          <span>Nuevas</span>
          <strong>{resumen.NUEVA}</strong>
        </article>
        <article>
          <span>Respondidas</span>
          <strong>{resumen.RESPONDIDA}</strong>
        </article>
      </div>

      <div className="admin-consultas__filters" aria-label="Filtrar consultas">
        {['TODAS', ...estados].map((estado) => (
          <button
            className={estadoFiltro === estado ? 'admin-consultas__filter admin-consultas__filter--active' : 'admin-consultas__filter'}
            type="button"
            key={estado}
            onClick={() => setEstadoFiltro(estado)}
          >
            {estado === 'TODAS' ? 'Todas' : estadoLabels[estado]}
          </button>
        ))}
      </div>

      <div className="admin-consultas__panel">
        {isLoading && <div className="admin-consultas__empty">Cargando consultas...</div>}
        {error && <div className="admin-consultas__error">{error}</div>}
        {!isLoading && !error && !consultasFiltradas.length && (
          <div className="admin-consultas__empty">No hay consultas para este filtro.</div>
        )}
        {!isLoading && !error && Boolean(consultasFiltradas.length) && (
          <div className="admin-consultas__items">
            {consultasFiltradas.map((consulta) => (
              <article className="admin-consulta" key={consulta.id}>
                <div className="admin-consulta__top">
                  <span className={`admin-consulta__status admin-consulta__status--${consulta.estado.toLowerCase()}`}>
                    {estadoLabels[consulta.estado] || consulta.estado}
                  </span>
                  <time>{formatDate(consulta.createdAt)}</time>
                </div>

                <div className="admin-consulta__body">
                  <div>
                    <strong>{consulta.nombre}</strong>
                    <span>{motivoLabels[consulta.motivo] || consulta.motivo}</span>
                  </div>
                  <p>{consulta.mensaje}</p>
                </div>

                <div className="admin-consulta__contact">
                  {consulta.email && <a href={`mailto:${consulta.email}`}>{consulta.email}</a>}
                  {consulta.telefono && <a href={`https://wa.me/${consulta.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{consulta.telefono}</a>}
                </div>

                <div className="admin-consulta__actions">
                  {estados.map((estado) => (
                    <button
                      type="button"
                      key={estado}
                      disabled={updatingId === consulta.id || consulta.estado === estado}
                      onClick={() => updateEstado(consulta, estado)}
                    >
                      {estadoLabels[estado]}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminConsultas
