import { useEffect, useMemo, useState } from 'react'
import { URL } from '../../Urls'
import PuntoDeVentaCard from './PuntoDeVentaCard'
import './styles.css'

const fallbackPuntos = [
    { id: 'aroma-de-vid', nombre: 'Aroma de Vid', categoria: 'comercio', direccion: 'Gral. Roca 2787', localidad: 'Mar del Plata' },
    { id: 'sr-v', nombre: 'Sr V.', categoria: 'comercio', direccion: 'Santa Fe 1821', localidad: 'Mar del Plata' },
    { id: 'pipita-drinks', nombre: 'Pipita Drinks', categoria: 'comercio', direccion: '3 de Febrero 3060', localidad: 'Mar del Plata' },
    { id: 'di-vino', nombre: 'Di Vino', categoria: 'comercio', direccion: 'Acevedo 4988', localidad: 'Mar del Plata' },
    { id: 'saber-beber', nombre: 'Saber Beber', categoria: 'comercio', direccion: 'Fortunato de la Plaza 3460', localidad: 'Mar del Plata' },
    { id: 'la-vasca-rivadavia', nombre: 'La Vasca', categoria: 'comercio', direccion: 'Rivadavia 2120', localidad: 'Mar del Plata' },
    { id: 'la-vasca-colon', nombre: 'La Vasca', categoria: 'comercio', direccion: 'Av. Colon 1716', localidad: 'Mar del Plata' },
    { id: 'bacco', nombre: 'Bacco', categoria: 'comercio', direccion: 'Av. Independencia 2302', localidad: 'Mar del Plata' },
    { id: 'cabrales-rivadavia', nombre: 'Cabrales', categoria: 'comercio', direccion: 'Rivadavia 3171', localidad: 'Mar del Plata' },
    { id: 'cabrales-alberti', nombre: 'Cabrales', categoria: 'comercio', direccion: 'Alberti 1343', localidad: 'Mar del Plata' },
    { id: 'cabrales-constitucion', nombre: 'Cabrales', categoria: 'comercio', direccion: 'Av. Constitucion 4274', localidad: 'Mar del Plata' },
    { id: 'cabrales-paseo-aldrey', nombre: 'Cabrales', categoria: 'comercio', direccion: 'Paseo Aldrey, Sarmiento 2685', localidad: 'Mar del Plata' },
    { id: 'cabrales-alem', nombre: 'Cabrales', categoria: 'comercio', direccion: 'Alem 3790', localidad: 'Mar del Plata' },
    { id: 'cava-mitre', nombre: 'Cava Mitre', categoria: 'comercio', direccion: 'La Rioja 2126', localidad: 'Mar del Plata' },
    { id: 'la-artesana', nombre: 'La Artesana', categoria: 'comercio', direccion: 'Av. Constitucion 5674', localidad: 'Mar del Plata' },
    { id: 'la-diagonal', nombre: 'La Diagonal', categoria: 'comercio', direccion: 'Lisandro de la Torre 919', localidad: 'Mar del Plata' },
    { id: 'de-buena-cepa', nombre: 'De Buena Cepa Vinoteca', categoria: 'comercio', direccion: 'Av. Argentina 100 esq. Aldo', localidad: 'Sierra de los Padres' },
    { id: 'sin-nombre', nombre: 'Sin Nombre', categoria: 'bar', direccion: 'Mitre 3121', localidad: 'Mar del Plata' },
    { id: 'buchon', nombre: 'Buchon', categoria: 'bar', direccion: 'Almafuerte 215', localidad: 'Mar del Plata' },
    { id: 'la-bulonera', nombre: 'La Bulonera', categoria: 'bar', direccion: 'Av. Centenario 1147', localidad: 'Balcarce' },
].map((punto, index) => ({
    ...punto,
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${punto.direccion}, ${punto.localidad}`)}`,
    orden: index + 1,
}))

const categoriaLabels = {
    comercio: 'Comercio',
    bar: 'Vermuteria / Bar',
}

const getMapsUrl = (punto) => {
    if (punto.maps) return punto.maps

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${punto.direccion}, ${punto.localidad}`)}`
}

const getEmbedUrl = (punto) => {
    const query = punto
        ? `${punto.direccion}, ${punto.localidad}, Buenos Aires, Argentina`
        : 'Mar del Plata, Sierra de los Padres, Balcarce, Buenos Aires, Argentina'
    const zoom = punto ? 17 : 10

    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`
}

const PuntosDeVenta = () => {
    const [puntosDeVenta, setPuntosDeVenta] = useState(fallbackPuntos)
    const [selectedId, setSelectedId] = useState(fallbackPuntos[0]?.id || '')
    const [searchTerm, setSearchTerm] = useState('')
    const selectedPoint = useMemo(
        () => puntosDeVenta.find((punto) => punto.id === selectedId) || null,
        [puntosDeVenta, selectedId]
    )
    const filteredPuntos = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        if (!normalizedSearch) return puntosDeVenta

        return puntosDeVenta.filter((punto) => {
            const searchableText = [
                punto.nombre,
                punto.categoria,
                categoriaLabels[punto.categoria],
                punto.direccion,
                punto.localidad,
            ].filter(Boolean).join(' ').toLowerCase()

            return searchableText.includes(normalizedSearch)
        })
    }, [puntosDeVenta, searchTerm])

    useEffect(() => {
        const fetchPuntos = async () => {
            try {
                const response = await fetch(`${URL}/puntos-venta`)
                const data = await response.json().catch(() => ({}))

                if (!response.ok) {
                    throw new Error(data.message || 'No se pudieron cargar los puntos de venta')
                }

                if (Array.isArray(data.puntos) && data.puntos.length) {
                    setPuntosDeVenta(data.puntos)
                    setSelectedId(data.puntos[0]?.id || '')
                }
            } catch {
                setPuntosDeVenta(fallbackPuntos)
                setSelectedId(fallbackPuntos[0]?.id || '')
            }
        }

        fetchPuntos()
    }, [])

    return (
        <section className="sales-points-page">
            <div className="sales-points__intro">
                <span>Puntos de venta</span>
                <h1>Donde encontrar Marvento</h1>
                <p>Comercios, vermuterias y bares donde podes comprar o tomar Marvento.</p>
            </div>

            <div className="sales-points__layout">
                <div className="sales-points__mobile-search" role="search">
                    <label htmlFor="sales-point-search">Buscar por zona, direccion o comercio</label>
                    <input
                        id="sales-point-search"
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Ej: Alem, Cabrales, Balcarce"
                    />
                    <p>{filteredPuntos.length} lugares disponibles</p>
                </div>

                <div className="sales-map" aria-label="Mapa de puntos de venta">
                    <div className="sales-map__canvas">
                        <iframe
                            title={selectedPoint ? `Mapa de ${selectedPoint.nombre}` : 'Mapa de puntos de venta Marvento'}
                            src={getEmbedUrl(selectedPoint)}
                            key={selectedPoint?.id || 'general'}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    <div className="sales-map__detail">
                        {selectedPoint ? (
                            <>
                                <span>{categoriaLabels[selectedPoint.categoria] || selectedPoint.categoria}</span>
                                <strong>{selectedPoint.nombre}</strong>
                                <p>{selectedPoint.direccion}, {selectedPoint.localidad}</p>
                                <a href={getMapsUrl(selectedPoint)} target="_blank" rel="noreferrer">
                                    Abrir en Google Maps
                                </a>
                            </>
                        ) : (
                            <>
                                <span>Puntos de venta</span>
                                <strong>Elegi un comercio</strong>
                                <p>Hace click en una card para ver su ubicacion en el mapa.</p>
                            </>
                        )}
                    </div>
                </div>

                <aside className="sales-points__list" aria-label="Listado de comercios">
                    {filteredPuntos.map((punto, index) => (
                        <PuntoDeVentaCard
                            index={index}
                            isActive={selectedId === punto.id}
                            punto={{
                                ...punto,
                                maps: getMapsUrl(punto),
                                zona: categoriaLabels[punto.categoria] || punto.categoria,
                                horario: `${punto.localidad} - Consultar disponibilidad`,
                            }}
                            key={punto.id}
                            onSelect={() => setSelectedId(punto.id)}
                        />
                    ))}
                    {!filteredPuntos.length && (
                        <div className="sales-points__empty">
                            No encontramos puntos de venta con esa busqueda.
                        </div>
                    )}
                </aside>
            </div>
        </section>
    )
}

export default PuntosDeVenta
