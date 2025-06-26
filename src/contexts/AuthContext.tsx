import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { PropietarioLoginResponse, MiPerfilResponse, MiHogarResponse, MiComunidadResponse } from '../types/auth';

// Tipos para el estado
interface AuthState {
  isAuthenticated: boolean;
  user: PropietarioLoginResponse | null;
  token: string | null;
  perfil: MiPerfilResponse | null;
  hogar: MiHogarResponse | null;
  comunidad: MiComunidadResponse | null;
  loading: boolean;
  error: string | null;
}

// Tipos para las acciones
type AuthAction =
  | { type: 'SET_USER'; payload: PropietarioLoginResponse }
  | { type: 'SET_PERFIL'; payload: MiPerfilResponse }
  | { type: 'SET_HOGAR'; payload: MiHogarResponse }
  | { type: 'SET_COMUNIDAD'; payload: MiComunidadResponse }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  perfil: null,
  hogar: null,
  comunidad: null,
  loading: false,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        token: action.payload.access,
        isAuthenticated: true,
        error: null,
      };
    case 'SET_PERFIL':
      return { ...state, perfil: action.payload };
    case 'SET_HOGAR':
      return { ...state, hogar: action.payload };
    case 'SET_COMUNIDAD':
      return { ...state, comunidad: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

// Contexto
interface AuthContextType extends AuthState {
  setUser: (user: PropietarioLoginResponse) => void;
  setPerfil: (perfil: MiPerfilResponse) => void;
  setHogar: (hogar: MiHogarResponse) => void;
  setComunidad: (comunidad: MiComunidadResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setUser = (user: PropietarioLoginResponse) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setPerfil = (perfil: MiPerfilResponse) => {
    dispatch({ type: 'SET_PERFIL', payload: perfil });
  };

  const setHogar = (hogar: MiHogarResponse) => {
    dispatch({ type: 'SET_HOGAR', payload: hogar });
  };

  const setComunidad = (comunidad: MiComunidadResponse) => {
    dispatch({ type: 'SET_COMUNIDAD', payload: comunidad });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    setUser,
    setPerfil,
    setHogar,
    setComunidad,
    setLoading,
    setError,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 