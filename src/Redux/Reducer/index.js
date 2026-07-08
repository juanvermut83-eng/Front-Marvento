import { combineReducers } from 'redux'
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
} from '../Actions/actionType'
const initialState = {
    loading: false,
    error: null,
    dataUsuario: null,
    usuarios: [],
    usuariosByRol: [],
    usuarioById: null,
    usuarioByDni: null,
    usuarioModificado: null,
    productos: [],
    productosAdmin: [],
    configuracionSitio: {
        productosVisible: true,
        carritoActivo: true,
    },
}

export const SET_LOADING = 'SET_LOADING'
export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export const setLoading = (payload) => ({
    type: SET_LOADING,
    payload,
})

export const setError = (payload) => ({
    type: SET_ERROR,
    payload,
})

export const clearError = () => ({
    type: CLEAR_ERROR,
})

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }

        case REGISTRARSE:
            return {
                ...state,
                dataUsuario: action.payload
            }
        case LOGIN:
            return {
                ...state,
                dataUsuario: action.payload,
            }
        case RESET_LOGIN:
            return {
                ...state,
                dataUsuario: null,
            }
        case GET_ALL_USUARIOS:
            return {
                ...state,
                usuarios: action.payload,
            }
        case GET_USUARIOS_BY_ROL:
            return {
                ...state,
                usuariosByRol: action.payload,
            }
        case GET_USER_BY_ID:
            return {
                ...state,
                usuarioById: action.payload,
            }
        case GET_USER_BY_DNI:
            return {
                ...state,
                usuarioByDni: action.payload,
            }
        case RESET_USER:
            return {
                ...state,
                usuarioById: null,
                usuarioByDni: null,
                dataUsuario: null,
            }
        case MODIFICA_USUARIO:
            return {
                ...state,
                usuarioModificado: action.payload,
            }
        case GET_PRODUCTOS:
            return {
                ...state,
                productos: action.payload,
            }
        case GET_PRODUCTOS_ADMIN:
            return {
                ...state,
                productosAdmin: action.payload,
            }
        case CREATE_PRODUCTO:
            return {
                ...state,
                productosAdmin: [...state.productosAdmin, action.payload].filter(Boolean),
            }
        case UPDATE_PRODUCTO:
            return {
                ...state,
                productos: state.productos.map((producto) =>
                    producto.id === action.payload?.id ? action.payload : producto
                ),
                productosAdmin: state.productosAdmin.map((producto) =>
                    producto.id === action.payload?.id ? action.payload : producto
                ),
            }
        case DELETE_PRODUCTO:
            return {
                ...state,
                productos: state.productos.filter((producto) => producto.id !== action.payload),
                productosAdmin: state.productosAdmin.filter((producto) => producto.id !== action.payload),
            }
        case GET_CONFIGURACION_SITIO:
        case UPDATE_CONFIGURACION_SITIO:
            return {
                ...state,
                configuracionSitio: {
                    ...state.configuracionSitio,
                    ...action.payload,
                },
            }
        case LOADING:
            return {
                ...state,
                loading: action.payload,
            }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    app: appReducer,
    dataUsuario: (state = initialState.dataUsuario, action) => appReducer({ ...initialState, dataUsuario: state }, action).dataUsuario,
})

export default rootReducer
