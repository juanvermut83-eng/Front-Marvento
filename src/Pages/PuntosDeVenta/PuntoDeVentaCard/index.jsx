const PuntoDeVentaCard = ({ index, isActive, punto, onActivate, onSelect }) => {
  return (
    <article className={`sales-point${isActive ? ' sales-point--active' : ''}`}>
      <button
        className="sales-point__select"
        type="button"
        onClick={onSelect}
        onFocus={onActivate}
        onMouseEnter={onActivate}
      >
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{punto.nombre}</strong>
        <small>{punto.direccion}</small>
        <em>{punto.horario}</em>
      </button>

      <a className="sales-point__maps" href={punto.maps} target="_blank" rel="noreferrer">
        Abrir en Google Maps
      </a>
    </article>
  )
}

export default PuntoDeVentaCard
