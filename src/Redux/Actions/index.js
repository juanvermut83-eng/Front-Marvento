import axios from "axios";
import { URL } from "../../Urls";
import {
    CREATE_PRODUCTO,
    DELETE_PRODUCTO,
    GET_ALL_USUARIOS,
    GET_CONFIGURACION_SITIO,
    GET_PRODUCTOS,
    GET_PRODUCTOS_ADMIN,
    GET_USUARIOS_BY_ROL,
    GET_USER_BY_DNI,
    GET_USER_BY_ID,
    LOADING,
    LOGIN,
    MODIFICA_USUARIO,
    REGISTRARSE,
    RESET_LOGIN,
    RESET_USER,
    UPDATE_CONFIGURACION_SITIO,
    UPDATE_PRODUCTO,
} from "./actionType";

const getAuthConfig = () => {
    let data;
    try {
        data = JSON.parse(localStorage.getItem('dataUser') || localStorage.getItem('userData') || 'null');
    } catch {
        return {};
    }

    const token =
        data?.token ||
        data?.accessToken ||
        data?.authToken ||
        data?.user?.token ||
        data?.user?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken;
    if (!token) return {};

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const getErrorMessage = (error, fallbackMessage) =>
    error.response?.data?.message ||
    error.response?.data?.msg ||
    error.response?.data?.error ||
    error.response?.data ||
    fallbackMessage;


// =================================
// USUARIOS
// =================================
export const login = (data) => {
    return async function (dispatch) {
        const resp = await axios.post(`${URL}/auth/login`, data);
        localStorage.setItem('userData', JSON.stringify(resp.data.user));
        window.dispatchEvent(new CustomEvent('userChanged', { detail: resp.data.user }));
        dispatch({ type: LOGIN, payload: resp.data.user });
        return resp.data;
    }
}

export const resetLogin = () => {
    return {
        type: RESET_LOGIN,
    }
}

//login google
export const loginGoogle = (credential) => {
    return async function (dispatch) {
        try {
            const resp = await axios.post(`${URL}/auth/login/google`, { tokenId: credential });
            localStorage.setItem('userData', JSON.stringify(resp.data.user));
            window.dispatchEvent(new CustomEvent('userChanged', { detail: resp.data.user }));
            dispatch({ type: LOGIN, payload: resp.data.user });
            return resp.data;
        } catch (error) {
            console.error("Error logging in", error.response?.data || error.message);
            return {
                error: true,
                message: error.response?.data?.message || "Error al iniciar sesion con Google.",
            };
        }
    }
}

//registrarse
//action con manejo de errores
export const registrarse = (data) => {
    return async function (dispatch) {
        try {
            const resp = await axios.post(`${URL}/registrarse`, data);
            dispatch({ type: REGISTRARSE, payload: resp.data });
            return resp.data; // ðŸ‘‰ el back deberÃ­a enviar algo como { message: "success" }
        } catch (error) {
            console.error("Error en registrarse:", error);

            // Capturamos y devolvemos el mensaje del backend (si existe)
            return {
                error: true,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.msg ||
                    error.response?.data?.error ||
                    error.response?.data ||
                    "Error al registrar el articulo.",
            };
        }
    };
};

//trea todos las personas
export const getAllUsuarios = () => {
    return async function (dispatch) {
        try {
            const resp = await axios.get(`${URL}/personas`);
            dispatch({ type: GET_ALL_USUARIOS, payload: resp.data });
            return resp.data;
        } catch (error) {
            if (error?.response?.status === 404) {
                dispatch({ type: GET_ALL_USUARIOS, payload: [] });
                return [];
            }
            throw error;
        }
    }
}

//trae por rol
export const getUsuarioByRol = (rol) => {
    return async function (dispatch) {
        try {
            const resp = await axios.get(`${URL}/personas/rol/${rol}`);
            dispatch({ type: GET_USUARIOS_BY_ROL, payload: resp.data });
            return resp.data;
        } catch (error) {
            if (error?.response?.status === 404) {
                dispatch({ type: GET_USUARIOS_BY_ROL, payload: [] });
                return [];
            }
            throw error;
        }
    }
};

//trae usuario por id
export const getUsuarioById = (id) => {
    return async function (dispatch) {
        const resp = await axios.get(`${URL}/personas/${id}`);
        //localStorage.setItem('dataUser', JSON.stringify(resp.data));
        dispatch({ type: GET_USER_BY_ID, payload: resp.data });
        return resp.data;
    }
}

//trae usuario por DNI
export const getUsuarioByDNI = (dni) => {
    return async function (dispatch) {
        const resp = await axios.get(`${URL}/personas/dni/${dni}`);
        dispatch({ type: GET_USER_BY_DNI, payload: resp.data });
        return resp.data;
    }
}

//reset usuario
export const resetUsuario = () => {
    return {
        type: RESET_USER,
    }
}

//modifica usuario - con manejo de errores
export const modificaUsuario = (id, data) => {
    return async function (dispatch) {
        const config = getAuthConfig();
        try {
            const resp = await axios.put(`${URL}/personas/modifica/${id}`, data, config);
            dispatch({ type: MODIFICA_USUARIO, payload: resp.data });
            return resp.data;
        } catch (error) {
            console.error("Error en modificaUsuario:", error);

            return {
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Error al modificar el usuario.",
            };
        }
    };
};

//modifica contrasena
export const modificaContrasena = (id, password) => {
    return async function (dispatch) {
        const resp = await axios.put(`${URL}/personas/modificaPass/${id}`, { password });
        dispatch({ type: 'MODIFICA_CONTRASENA', payload: resp.data });
        return resp.data;
    }
}

// Eliminar usuario
export const eliminaUsuario = (id) => {
    return async function () {
        const config = getAuthConfig();
        try {
            const resp = await axios.delete(`${URL}/personas/eliminar/${id}`, config);
            return resp.data; // contiene { message: 'Usuario eliminado correctamente' }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return {
                message: error.response?.data?.message || 'Error al eliminar usuario'
            };
        }
    };
};

// =================================
// PRODUCTOS
// =================================
export const getProductos = () => {
    return async function (dispatch) {
        const resp = await axios.get(`${URL}/productos`);
        const productos = resp.data.productos || [];
        dispatch({ type: GET_PRODUCTOS, payload: productos });
        return productos;
    };
};

export const getProductosAdmin = () => {
    return async function (dispatch) {
        const resp = await axios.get(`${URL}/productos/admin`, getAuthConfig());
        const productos = resp.data.productos || [];
        dispatch({ type: GET_PRODUCTOS_ADMIN, payload: productos });
        return productos;
    };
};

export const crearProducto = (producto) => {
    return async function (dispatch) {
        try {
            const resp = await axios.post(`${URL}/productos`, producto, getAuthConfig());
            dispatch({ type: CREATE_PRODUCTO, payload: resp.data.producto });
            return resp.data.producto;
        } catch (error) {
            throw new Error(getErrorMessage(error, "No se pudo crear el producto"), { cause: error });
        }
    };
};

export const modificarProducto = (slug, producto) => {
    return async function (dispatch) {
        try {
            const resp = await axios.put(`${URL}/productos/${slug}`, producto, getAuthConfig());
            dispatch({ type: UPDATE_PRODUCTO, payload: resp.data.producto });
            return resp.data.producto;
        } catch (error) {
            throw new Error(getErrorMessage(error, "No se pudo actualizar el producto"), { cause: error });
        }
    };
};

export const eliminarProducto = (slug) => {
    return async function (dispatch) {
        try {
            const resp = await axios.delete(`${URL}/productos/${slug}`, getAuthConfig());
            dispatch({ type: DELETE_PRODUCTO, payload: slug });
            return resp.data;
        } catch (error) {
            throw new Error(getErrorMessage(error, "No se pudo eliminar el producto"), { cause: error });
        }
    };
};

// =================================
// CONFIGURACION SITIO
// =================================
export const getConfiguracionSitioAdmin = () => {
    return async function (dispatch) {
        const resp = await axios.get(`${URL}/configuracion-sitio/admin`, getAuthConfig());
        const configuracion = resp.data.configuracion || {};
        dispatch({ type: GET_CONFIGURACION_SITIO, payload: configuracion });
        return configuracion;
    };
};

export const actualizarConfiguracionSitio = (configuracion) => {
    return async function (dispatch) {
        try {
            const resp = await axios.put(`${URL}/configuracion-sitio/admin`, configuracion, getAuthConfig());
            const configuracionActualizada = resp.data.configuracion || {};
            dispatch({ type: UPDATE_CONFIGURACION_SITIO, payload: configuracionActualizada });
            return configuracionActualizada;
        } catch (error) {
            throw new Error(getErrorMessage(error, "No se pudo actualizar la configuracion"), { cause: error });
        }
    };
};

//-----------------------------------
//Paso LOADING a FALSE
export const ActualizoLoading = () => {
    return {
        type: LOADING,
        payload: false
    }
};
