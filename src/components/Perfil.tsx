import { useState } from 'react';
import { authService } from '../services/authService';
import type { MiPerfilResponse } from '../types/auth';

export const Perfil = () => {
  const [token, setToken] = useState('');
  const [perfil, setPerfil] = useState<MiPerfilResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const obtenerPerfil = async () => {
    if (!token) {
      setError('Por favor ingresa un token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authService.obtenerMiPerfil(token);
      setPerfil(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Token de Acceso
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Pega aquí el token obtenido del login"
          className="w-full p-3 border rounded-lg h-20"
        />
      </div>

      <button
        onClick={obtenerPerfil}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 mb-4"
      >
        {loading ? 'Cargando...' : 'Obtener Perfil'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {perfil && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">Datos del Perfil:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(perfil, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}; 