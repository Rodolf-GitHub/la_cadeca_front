import { useState } from 'react';
import { authService } from '../services/authService';

export const Login = () => {
  const [telefono, setTelefono] = useState('');
  const [codigo, setCodigo] = useState('');
  const [paso, setPaso] = useState<'telefono' | 'codigo'>('telefono');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [codigoDebug, setCodigoDebug] = useState('');

  const enviarCodigo = async () => {
    if (!telefono) {
      setError('Por favor ingresa tu teléfono');
      return;
    }

    setLoading(true);
    setError('');
    setCodigoDebug('');

    try {
      const response = await authService.iniciarLogin({ telf_1: telefono });
      setPaso('codigo');
      
      // En modo debug, el backend puede devolver el código directamente
      if (response.codigo) {
        setCodigoDebug(response.codigo);
        setCodigo(response.codigo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código');
    } finally {
      setLoading(false);
    }
  };

  const verificarCodigo = async () => {
    if (!codigo) {
      setError('Por favor ingresa el código');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verificarCodigo({ 
        telf_1: telefono, 
        codigo 
      });
      setToken(response.access);
      setError('¡Login exitoso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login Fincashop</h2>
      
      {error && (
        <div className={`mb-4 p-3 rounded ${error.includes('¡Login exitoso!') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}

      {token && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">Token de Acceso:</h3>
          <div className="bg-white p-3 rounded border text-xs font-mono break-all">
            {token}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(token)}
            className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Copiar Token
          </button>
        </div>
      )}

      {paso === 'telefono' ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="34666777888"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            onClick={enviarCodigo}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </div>
      ) : (
        <div>
          {codigoDebug && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-1">Código Debug:</h3>
              <div className="bg-white p-2 rounded border text-lg font-mono text-center">
                {codigoDebug}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Código SMS
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full p-3 border rounded-lg text-center text-lg font-mono"
            />
          </div>
          <button
            onClick={verificarCodigo}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
          <button
            onClick={() => {
              setPaso('telefono');
              setCodigo('');
              setCodigoDebug('');
              setToken('');
            }}
            className="w-full mt-2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
          >
            Cambiar Teléfono
          </button>
        </div>
      )}
    </div>
  );
}; 