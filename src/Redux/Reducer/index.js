import { combineReducers } from 'redux'
import { 
    GET_ALL_USUARIOS,
    GET_USUARIOS_BY_ROL,
    GET_USER_BY_DNI,
    GET_USER_BY_ID,
    LOADING,
    LOGIN,
    MODIFICA_USUARIO,
    REGISTRARSE,
    RESET_LOGIN,
    RESET_USER,
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
