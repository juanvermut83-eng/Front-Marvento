import { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../Context/AppContext'
import { URL } from '../../Urls'
import './styles.css'

const emptyForm = {
  id: '',
  nombre: '',
  categoria: 'comercio',
  direccion: '',
  localidad: 'Mar del Plata',
  provincia: 'Buenos Aires',
  lat: '',
  lng: '',
  orden: '',
  activo: true,
}

const defaultCoordinates = {
  lat: -38.0055,
  lng: -57.5426,
}

const createId = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

const puntoToForm = (punto) => ({
  id: punto.id,
  nombre: punto.nombre || '',
  categoria: punto.categoria || 'comercio',
  direccion: punto.direccion || '',
  localidad: punto.localidad || '',
  provincia: punto.provincia || 'Buenos Aires',
  lat: String(punto.lat ?? ''),
  lng: String(punto.lng ?? ''),
  orden: String(punto.orden ?? ''),
  activo: punto.activo !== false,
})

const normalizeForm = (formData) => ({
  id: formData.id || createId(`${formData.nombre}-${formData.direccion}`),
  nombre: String(formData.nombre || '').trim(),
  categoria: formData.categoria === 'bar' ? 'bar' : 'comercio',
  direccion: String(formData.direccion || '').trim(),
  localidad: String(formData.localidad || '').trim(),
  provincia: String(formData.provincia || 'Buenos Aires').trim(),
  lat: Number(formData.lat),
  lng: Number(formData.lng),
  orden: Number(formData.orden) || 0,
  activo: Boolean(formData.activo),
})

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('dataUser') || localStorage.getItem('userData') || 'null')
  } catch {
    return null
  }
}

const getAuthToken = (userLog) => {
  const data = userLog || getStoredUser()

  return data?.token ||
    data?.accessToken ||
    data?.authToken ||
    data?.user?.token ||
    data?.user?.accessToken ||
    data?.data?.token ||
    data?.data?.accessToken ||
    ''
}

const buildAuthHeaders = (token) => (
  token ? { Authorization: `Bearer ${token}` } : {}
)

const AdminPointsHeader = ({ onCreate }) => (
  <header className="admin-points__header">
    <div>
      <span>Mapa</span>
      <h1>Puntos de venta</h1>
      <p>Administra comercios, bares y coordenadas visibles en el mapa publico.</p>
    </div>
    <div className="admin-points__header-actions">
      <button type="button" onClick={onCreate}>Nuevo punto</button>
    </div>
  </header>
)

const AdminPointsMetrics = ({ stats }) => (
  <div className="admin-points__metrics">
    <article><span>Total</span><strong>{stats.total}</strong></article>
    <article><span>Activos</span><strong>{stats.activos}</strong></article>
    <article><span>Comercios</span><strong>{stats.comercios}</strong></article>
    <article><span>Bares</span><strong>{stats.bares}</strong></article>
  </div>
)

const AdminPointsConfirm = ({ pointToDelete, onCancel, onConfirm }) => {
  if (!pointToDelete) return null

  return (
    <div className="admin-points__confirm" role="alertdialog" aria-modal="false">
      <div className="admin-points__confirm-panel">
        <div>
          <strong>Desea eliminar?</strong>
          <span>{pointToDelete.nombre}</span>
        </div>
        <div className="admin-points__confirm-actions">
          <button type="button" onClick={onCancel}>Cancelar</button>
          <button type="button" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

const AdminPointForm = ({ editingId, formData, onCancel, onChange, onSubmit }) => {
  if (!editingId) return null

  return (
    <form className="admin-points__form" onSubmit={onSubmit}>
      <div className="admin-points__form-title">
        <h2>{editingId === 'nuevo' ? 'Nuevo punto' : 'Editar punto'}</h2>
        <button type="button" onClick={onCancel}>Cerrar</button>
      </div>

      <label>
        Nombre
        <input name="nombre" value={formData.nombre} onChange={onChange} />
      </label>
      <label>
        Categoria
        <select name="categoria" value={formData.categoria} onChange={onChange}>
          <option value="comercio">Comercio</option>
          <option value="bar">Vermuteria / Bar</option>
        </select>
      </label>
      <label>
        Direccion
        <input name="direccion" value={formData.direccion} onChange={onChange} />
      </label>
      <label>
        Localidad
        <input name="localidad" value={formData.localidad} onChange={onChange} />
      </label>
      <label>
        Provincia
        <input name="provincia" value={formData.provincia} onChange={onChange} />
      </label>
      <label className="admin-points__checkbox">
        <input type="checkbox" name="activo" checked={formData.activo} onChange={onChange} />
        Visible en mapa
      </label>

      <div className="admin-points__form-actions">
        <button type="button" onClick={onCancel}>Cancelar</button>
        <button type="submit">Guardar punto</button>
      </div>
    </form>
  )
}

const AdminPointsTable = ({ isLoading, puntos, onDelete, onEdit, onToggle }) => (
  <div className="admin-points__panel">
    {isLoading && <div className="admin-points__empty">Cargando puntos...</div>}
    {!isLoading && !puntos.length && <div className="admin-points__empty">Todavia no hay puntos cargados.</div>}
    {!isLoading && Boolean(puntos.length) && (
      <div className="admin-points__table-wrap">
        <table className="admin-points__table">
          <thead>
            <tr>
              <th>Punto</th>
              <th>Direccion</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {puntos.map((punto) => (
              <tr key={punto.id}>
                <td>
                  <strong>{punto.nombre}</strong>
                  <span>{punto.categoria === 'bar' ? 'Vermuteria / Bar' : 'Comercio'}</span>
                </td>
                <td>{punto.direccion}, {punto.localidad}</td>
                <td>
                  <button
                    type="button"
                    className={`admin-points__status ${punto.activo === false ? 'admin-points__status--off' : ''}`}
                    onClick={() => onToggle(punto)}
                  >
                    {punto.activo === false ? 'Oculto' : 'Visible'}
                  </button>
                </td>
                <td>
                  <div className="admin-points__actions">
                    <button type="button" onClick={() => onEdit(punto)}>Editar</button>
                    <button type="button" onClick={() => onDelete(punto)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

const AdminPuntosVenta = () => {
  const { userLog } = useContext(AppContext)
  const [puntos, setPuntos] = useState([])
  const [editingId, setEditingId] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pointToDelete, setPointToDelete] = useState(null)

  const authToken = useMemo(() => getAuthToken(userLog), [userLog])
  const authHeaders = useMemo(() => buildAuthHeaders(authToken), [authToken])
  const stats = useMemo(() => ({
    total: puntos.length,
    activos: puntos.filter((punto) => punto.activo !== false).length,
    comercios: puntos.filter((punto) => punto.categoria !== 'bar').length,
    bares: puntos.filter((punto) => punto.categoria === 'bar').length,
  }), [puntos])

  const fetchPuntos = async () => {
    try {
      setError('')
      const response = await fetch(`${URL}/puntos-venta/admin`, { headers: authHeaders })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudieron cargar los puntos de venta')
      }

      setPuntos(data.puntos || [])
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar los puntos de venta')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPuntos()
      return
    }

    setIsLoading(false)
    setError('No se encontro una sesion valida para cargar puntos de venta.')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken])

  const showMessage = (successMessage) => {
    setMessage(successMessage)
    window.setTimeout(() => setMessage(''), 2400)
  }

  const startCreate = () => {
    setEditingId('nuevo')
    setFormData({ ...emptyForm, orden: String((puntos.length || 0) + 1) })
  }

  const startEdit = (punto) => {
    setEditingId(punto.id)
    setFormData(puntoToForm(punto))
  }

  const cancelEdit = () => {
    setEditingId('')
    setFormData(emptyForm)
  }

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const savePunto = async (event) => {
    event.preventDefault()
    const punto = {
      ...normalizeForm(formData),
      lat: Number(formData.lat) || defaultCoordinates.lat,
      lng: Number(formData.lng) || defaultCoordinates.lng,
      orden: Number(formData.orden) || (puntos.length || 0) + 1,
    }

    if (!punto.nombre || !punto.direccion || !punto.localidad || !Number.isFinite(punto.lat) || !Number.isFinite(punto.lng)) {
      setError('Completa nombre, direccion y localidad.')
      return
    }

    try {
      setError('')
      const isNew = editingId === 'nuevo'
      const response = await fetch(`${URL}/puntos-venta${isNew ? '' : `/${editingId}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(punto),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar el punto de venta')
      }

      showMessage(isNew ? 'Punto creado con exito.' : 'Punto actualizado con exito.')
      cancelEdit()
      await fetchPuntos()
    } catch (requestError) {
      setError(requestError.message || 'No se pudo guardar el punto de venta')
    }
  }

  const toggleActivo = async (punto) => {
    try {
      setError('')
      const response = await fetch(`${URL}/puntos-venta/${punto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ ...punto, activo: punto.activo === false }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo cambiar el estado')
      }

      showMessage('Estado actualizado.')
      await fetchPuntos()
    } catch (requestError) {
      setError(requestError.message || 'No se pudo cambiar el estado')
    }
  }

  const confirmDelete = async () => {
    if (!pointToDelete) return

    try {
      setError('')
      const response = await fetch(`${URL}/puntos-venta/${pointToDelete.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo eliminar el punto de venta')
      }

      showMessage('Punto eliminado con exito.')
      setPointToDelete(null)
      await fetchPuntos()
    } catch (requestError) {
      setError(requestError.message || 'No se pudo eliminar el punto de venta')
    }
  }

  return (
    <section className="admin-points">
      <AdminPointsHeader onCreate={startCreate} />
      <AdminPointsMetrics stats={stats} />

      {message && <div className="admin-points__message">{message}</div>}
      {error && <div className="admin-points__message admin-points__message--error">{error}</div>}

      <AdminPointsConfirm
        pointToDelete={pointToDelete}
        onCancel={() => setPointToDelete(null)}
        onConfirm={confirmDelete}
      />
      <AdminPointForm
        editingId={editingId}
        formData={formData}
        onCancel={cancelEdit}
        onChange={handleChange}
        onSubmit={savePunto}
      />
      <AdminPointsTable
        isLoading={isLoading}
        puntos={puntos}
        onDelete={setPointToDelete}
        onEdit={startEdit}
        onToggle={toggleActivo}
      />
    </section>
  )
}

export default AdminPuntosVenta
