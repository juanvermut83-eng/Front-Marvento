import { useEffect, useState } from 'react';
import { cartData, userData } from '../LocalStorage';
import { AppContext } from './AppContext';

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

    const guardarCarrito = (items) => {
        setCartItems(items);
        localStorage.setItem('cartData', JSON.stringify(items));
    };

    const addToCart = (product) => {
        const existe = cartItems.find((item) => item.id === product.id);

        if (existe) {
            guardarCarrito(
                cartItems.map((item) =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
            return;
        }

        guardarCarrito([...cartItems, { ...product, cantidad: 1 }]);
    };

    const updateCartItemQuantity = (id, cantidad) => {
        const cantidadFinal = Number(cantidad);

        if (!Number.isFinite(cantidadFinal) || cantidadFinal < 1) {
            return;
        }

        guardarCarrito(
            cartItems.map((item) =>
                item.id === id ? { ...item, cantidad: cantidadFinal } : item
            )
        );
    };

    const removeFromCart = (id) => {
        guardarCarrito(cartItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        guardarCarrito([]);
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
            }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
