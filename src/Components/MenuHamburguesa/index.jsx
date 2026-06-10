import './style.css'

const MenuHamburguesa = ({ isOpen, onClick }) => {
  return (
    <button
      className={`hamburger ${isOpen ? 'hamburger--open' : ''}`}
      type="button"
      aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className="hamburger__line" />
      <span className="hamburger__line" />
      <span className="hamburger__line" />
    </button>
  )
}

export default MenuHamburguesa
