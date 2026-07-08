import { useEffect, useState } from 'react';
import { cartData, userData } from '../LocalStorage';
import { AppContext } from './AppContext';
import { URL } from '../Urls';

const DEFAULT_TIENDA_CONFIG = {
    productosVisible: true,
    carritoActivo: true,
};

const AppProvider = ({ children }) => {
    const initialUser = userData();
    const initialCart = cartData();
    //estado data usuario logeado, por eso null es un objeto
    const [userLog, setUserLog] = useState(initialUser);
    //estado para login
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
    //estado nombre admin logeado
    const [nombreUser, setNombreUser] = useState(initialUser?.nombre || initialUser?.user || '');
    //estado para el SEARCH
    const [search, setSearch] = useState('');
    const [cartItems, setCartItems] = useState(initialCart);
    const [configuracionTienda, setConfiguracionTienda] = useState(DEFAULT_TIENDA_CONFIG);
    const [isConfigLoading, setIsConfigLoading] = useState(true);

    const guardarCarrito = (items) => {
        setCartItems(items);
        localStorage.setItem('cartData', JSON.stringify(items));
    };

    const addToCart = (product) => {
        const stockDisponible = Number(product.stock ?? 0);

        if (stockDisponible <= 0) {
            return;
        }

        const existe = cartItems.find((item) => item.id === product.id);

        if (existe) {
            if (existe.cantidad >= stockDisponible) {
                return;
            }

            guardarCarrito(
                cartItems.map((item) =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
            return;
        }

        guardarCarrito([...cartItems, { ...product, stock: stockDisponible, cantidad: 1 }]);
    };

    const updateCartItemQuantity = (id, cantidad) => {
        const cantidadFinal = Number(cantidad);
        const itemActual = cartItems.find((item) => item.id === id);
        const stockDisponible = Number(itemActual?.stock ?? 0);

        if (!Number.isFinite(cantidadFinal) || cantidadFinal < 1) {
            return;
        }

        if (stockDisponible <= 0) {
            removeFromCart(id);
            return;
        }

        guardarCarrito(
            cartItems.map((item) =>
                item.id === id ? { ...item, stock: stockDisponible, cantidad: Math.min(cantidadFinal, stockDisponible) } : item
            )
        );
    };

    const removeFromCart = (id) => {
        guardarCarrito(cartItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        guardarCarrito([]);
    };

    const refreshConfiguracionTienda = async () => {
        try {
            const response = await fetch(`${URL}/configuracion-sitio`);
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'No se pudo cargar la configuracion');
            }

            const nextConfig = {
                ...DEFAULT_TIENDA_CONFIG,
                ...(data.configuracion || {}),
            };

            setConfiguracionTienda(nextConfig);
            return nextConfig;
        } finally {
            setIsConfigLoading(false);
        }
    };

    const login = (user) => {
        if (user) {
            setUserLog(user);
            setNombreUser(user.nombre || user.user || '');
        }
        setIsAuthenticated(true);
    };
    const logout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('dataUser');
        setUserLog(null);
        setNombreUser('');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const handleUserChanged = (event) => {
            const user = event.detail || userData();
            setUserLog(user);
            setIsAuthenticated(Boolean(user));
            setNombreUser(user?.nombre || user?.user || '');
        };

        window.addEventListener('userChanged', handleUserChanged);
        return () => window.removeEventListener('userChanged', handleUserChanged);
    }, []);

    useEffect(() => {
        refreshConfiguracionTienda().catch(() => {
            setConfiguracionTienda(DEFAULT_TIENDA_CONFIG);
        });
    }, []);

    return (
        <AppContext.Provider
            value={{
                userLog,
                setUserLog,
                isAuthenticated,
                nombreUser,
                login,
                logout,
                search,
                setSearch,
                cartItems,
                addToCart,
                updateCartItemQuantity,
                removeFromCart,
                clearCart,
                configuracionTienda,
                setConfiguracionTienda,
                refreshConfiguracionTienda,
                isConfigLoading,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
