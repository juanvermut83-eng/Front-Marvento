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

const googleMapsApiKey = import.meta.env.VITE_APP_API_GOOGLE_MAP
let googleMapsScriptPromise

const normalizeSearchText = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const hasCoordinates = (punto) => Number.isFinite(Number(punto.lat)) && Number.isFinite(Number(punto.lng))

const toRadians = (value) => (value * Math.PI) / 180

const getDistanceKm = (origin, punto) => {
    if (!origin || !hasCoordinates(punto)) return null

    const earthRadiusKm = 6371
    const latDistance = toRadians(Number(punto.lat) - origin.lat)
    const lngDistance = toRadians(Number(punto.lng) - origin.lng)
    const originLat = toRadians(origin.lat)
    const pointLat = toRadians(Number(punto.lat))
    const haversine =
        Math.sin(latDistance / 2) ** 2 +
        Math.cos(originLat) * Math.cos(pointLat) * Math.sin(lngDistance / 2) ** 2

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

const formatDistance = (distanceKm) => {
    if (!Number.isFinite(distanceKm)) return ''
    if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`

    return `${distanceKm.toFixed(1).replace('.', ',')} km`
}

const loadGoogleMaps = () => {
    if (!googleMapsApiKey) {
        return Promise.reject(new Error('Falta configurar VITE_APP_API_GOOGLE_MAP'))
    }

    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Google Maps solo esta disponible en el navegador'))
    }

    if (window.google?.maps?.Geocoder) {
        return Promise.resolve(window.google)
    }

    if (!googleMapsScriptPromise) {
        googleMapsScriptPromise = new Promise((resolve, reject) => {
            const existingScript = document.getElementById('google-maps-script')

            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(window.google))
                existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar Google Maps')))
                return
            }

            const script = document.createElement('script')
            script.id = 'google-maps-script'
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(googleMapsApiKey)}`
            script.async = true
            script.defer = true
            script.onload = () => resolve(window.google)
            script.onerror = () => reject(new Error('No se pudo cargar Google Maps'))
            document.head.appendChild(script)
        })
    }

    return googleMapsScriptPromise
}

const geocodeSearch = async (searchTerm) => {
    const google = await loadGoogleMaps()
    const geocoder = new google.maps.Geocoder()

    return new Promise((resolve, reject) => {
        geocoder.geocode(
            {
                address: `${searchTerm}, Buenos Aires, Argentina`,
                componentRestrictions: { country: 'AR' },
                region: 'AR',
            },
            (results, status) => {
                if (status !== 'OK' || !results?.length) {
                    reject(new Error(status || 'No se encontro la ubicacion'))
                    return
                }

                const location = results[0].geometry.location

                resolve({
                    lat: location.lat(),
                    lng: location.lng(),
                    label: results[0].formatted_address,
                })
            }
        )
    })
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
    const [isMapVisible, setIsMapVisible] = useState(false)
    const [searchLocation, setSearchLocation] = useState(null)
    const [searchStatus, setSearchStatus] = useState('idle')
    const [searchMessage, setSearchMessage] = useState('')
    const selectedPoint = useMemo(
        () => puntosDeVenta.find((punto) => punto.id === selectedId) || null,
        [puntosDeVenta, selectedId]
    )
    const filteredPuntos = useMemo(() => {
        const normalizedSearch = normalizeSearchText(searchTerm.trim())

        if (!normalizedSearch) return puntosDeVenta

        const localMatches = puntosDeVenta.filter((punto) => {
            const searchableText = [
                punto.nombre,
                punto.categoria,
                categoriaLabels[punto.categoria],
                punto.direccion,
                punto.localidad,
            ].filter(Boolean).join(' ')

            return normalizeSearchText(searchableText).includes(normalizedSearch)
        })

        if (!searchLocation) return localMatches

        const puntosConDistancia = puntosDeVenta.map((punto) => ({
            ...punto,
            distanceKm: getDistanceKm(searchLocation, punto),
        }))
        const hasDistanceResults = puntosConDistancia.some((punto) => Number.isFinite(punto.distanceKm))

        if (!hasDistanceResults) return localMatches

        return puntosConDistancia.sort((first, second) => {
            if (!Number.isFinite(first.distanceKm)) return 1
            if (!Number.isFinite(second.distanceKm)) return -1

            return first.distanceKm - second.distanceKm
        })
    }, [puntosDeVenta, searchLocation, searchTerm])

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

    useEffect(() => {
        if (typeof window === 'undefined') return undefined

        const mapVisibilityQuery = window.matchMedia('(min-width: 901px)')
        const updateMapVisibility = () => setIsMapVisible(mapVisibilityQuery.matches)

        updateMapVisibility()
        mapVisibilityQuery.addEventListener('change', updateMapVisibility)

        return () => {
            mapVisibilityQuery.removeEventListener('change', updateMapVisibility)
        }
    }, [])

    useEffect(() => {
        const normalizedSearch = searchTerm.trim()

        if (normalizedSearch.length < 3) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchLocation(null)
            setSearchStatus('idle')
            setSearchMessage('')
            return undefined
        }

        let isCurrentSearch = true
        setSearchStatus('searching')
        setSearchMessage('Buscando ubicacion...')

        const searchTimer = setTimeout(() => {
            geocodeSearch(normalizedSearch)
                .then((location) => {
                    if (!isCurrentSearch) return
                    setSearchLocation(location)
                    setSearchStatus('found')
                    setSearchMessage(`Mas cercanos a ${location.label}`)
                })
                .catch(() => {
                    if (!isCurrentSearch) return
                    setSearchLocation(null)
                    setSearchStatus('error')
                    setSearchMessage('No pudimos ubicar esa busqueda. Mostramos coincidencias por texto.')
                })
        }, 650)

        return () => {
            isCurrentSearch = false
            clearTimeout(searchTimer)
        }
    }, [searchTerm])

    useEffect(() => {
        if (!isMapVisible || !searchTerm.trim() || !filteredPuntos.length) return

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedId(filteredPuntos[0].id)
    }, [filteredPuntos, isMapVisible, searchTerm])

    return (
        <section className="sales-points-page">
            <div className="sales-points__intro">
                <span>Puntos de venta</span>
                <h1>Donde encontrar Marvento</h1>
                <p>Comercios, vermuterias y bares donde podes comprar o tomar Marvento.</p>
            </div>

            <div className="sales-points__layout">
                <div className="sales-points__search" role="search">
                    <label htmlFor="sales-point-search">Buscar por direccion, zona o comercio</label>
                    <input
                        id="sales-point-search"
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="diagonal pueyrredon 3291, mar del plata"
                    />
                    <p className={`sales-points__search-status sales-points__search-status--${searchStatus}`}>
                        {searchMessage || `${filteredPuntos.length} lugares disponibles`}
                    </p>
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
                            isActive={isMapVisible && selectedId === punto.id}
                            punto={{
                                ...punto,
                                maps: getMapsUrl(punto),
                                zona: categoriaLabels[punto.categoria] || punto.categoria,
                                horario: Number.isFinite(punto.distanceKm)
                                    ? `${formatDistance(punto.distanceKm)} - ${punto.localidad}`
                                    : `${punto.localidad} - Consultar disponibilidad`,
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
