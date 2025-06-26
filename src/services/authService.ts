import type { 
  PropietarioLoginRequest, 
  PropietarioVerifyRequest, 
  PropietarioLoginResponse,
  LoginResponse,
  MiPerfilResponse,
  MiHogarResponse,
  MiComunidadResponse,
  ErrorResponse 
} from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  // Iniciar login - enviar código SMS
  iniciarLogin: async (datos: PropietarioLoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth_propietarios/propietario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Error al iniciar el login');
    }
    
    return response.json();
  },

  // Verificar código SMS
  verificarCodigo: async (datos: PropietarioVerifyRequest): Promise<PropietarioLoginResponse> => {
    const response = await fetch(`${API_URL}/auth_propietarios/propietario/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Error al verificar el código');
    }
    
    return response.json();
  },

  // Obtener mi perfil
  obtenerMiPerfil: async (token: string): Promise<MiPerfilResponse> => {
    const response = await fetch(`${API_URL}/datos_propietario/mi-perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Error al obtener el perfil');
    }
    
    return response.json();
  },

  // Obtener mi hogar
  obtenerMiHogar: async (token: string): Promise<MiHogarResponse> => {
    const response = await fetch(`${API_URL}/datos_propietario/mi-hogar`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Error al obtener el hogar');
    }
    
    return response.json();
  },

  // Obtener mi comunidad
  obtenerMiComunidad: async (token: string): Promise<MiComunidadResponse> => {
    const response = await fetch(`${API_URL}/datos_propietario/mi-comunidad`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Error al obtener la comunidad');
    }
    
    return response.json();
  },
}; 