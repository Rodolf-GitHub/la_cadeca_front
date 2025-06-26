import { useState, useEffect } from 'react';
import type { MonedaResponse, ConversionResponse } from '../types/moneda';
import { monedaService } from '../services/monedaService';

// Función para formatear números grandes
const formatearNumero = (numero: number | string): string => {
  const num = typeof numero === 'string' ? parseFloat(numero) : numero;
  if (isNaN(num)) return '0';
  
  // Si el número es muy grande, usa notación científica
  if (num >= 1e6 || num <= -1e6) {
    return num.toExponential(2);
  }
  
  // Para números normales, usa separador de miles y máximo 2 decimales
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(num);
};

export const Calculadora = () => {
  const [monedas, setMonedas] = useState<MonedaResponse[]>([]);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<string>('USD');
  const [cantidad, setCantidad] = useState<string>('1');
  const [resultado, setResultado] = useState<ConversionResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  useEffect(() => {
    cargarMonedas();
  }, []);

  useEffect(() => {
    // Realizar conversión inicial de 1 USD
    if (monedas.length > 0) {
      handleConversion();
    }
  }, [monedas]);

  const cargarMonedas = async () => {
    try {
      setCargando(true);
      const data = await monedaService.listarMonedas();
      setMonedas(data);
    } catch {
      setError('Error al cargar las monedas');
    } finally {
      setCargando(false);
    }
  };

  const handleConversion = async () => {
    if (!monedaSeleccionada || !cantidad) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      setCargando(true);
      setError('');
      const data = await monedaService.convertir({
        codigo_moneda: monedaSeleccionada,
        cantidad: parseFloat(cantidad),
      });
      setResultado(data);
    } catch {
      setError('Error al realizar la conversión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Sección de entrada */}
        <div className="bg-green-800 p-3 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Conversor de Divisas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white">
                Moneda
              </label>
              <select
                className="w-full p-2.5 rounded-lg bg-green-700 text-white border border-green-600 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={monedaSeleccionada}
                onChange={(e) => setMonedaSeleccionada(e.target.value)}
              >
                {monedas.map((moneda) => (
                  <option key={moneda.codigo_moneda} value={moneda.codigo_moneda}>
                    {moneda.nombre} ({moneda.codigo_moneda})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white">
                Cantidad
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full p-2.5 rounded-lg bg-green-700 text-white border border-green-600 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Ingrese la cantidad"
                  min="0"
                  step="any"
                />
              </div>
            </div>
          </div>

          {/* Botón de conversión */}
          <button
            onClick={handleConversion}
            disabled={cargando}
            className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:bg-green-800 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {cargando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Convirtiendo...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Convertir</span>
              </>
            )}
          </button>
        </div>

        {/* Sección de resultados */}
        <div className="p-3 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {resultado && !cargando && (
            <div className="space-y-4">
              {/* Encabezado de la conversión */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-xl sm:text-2xl font-bold text-gray-800">
                  <span title={resultado.moneda_origen.cantidad.toString()}>
                    {formatearNumero(resultado.moneda_origen.cantidad)}
                  </span>
                  <span className="text-green-800">{resultado.moneda_origen.codigo_moneda}</span>
                </div>
                <div className="text-gray-500 text-sm mt-0.5">
                  {resultado.moneda_origen.nombre}
                </div>
              </div>

              {/* Símbolo de equivalencia */}
              <div className="flex justify-center">
                <div className="w-12 h-px bg-gray-300 my-3"></div>
              </div>

              {/* Grid de conversiones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {resultado.conversiones.map((conversion, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span 
                            className="text-lg font-bold text-green-800 truncate"
                            title={conversion.cantidad.toString()}
                          >
                            {formatearNumero(conversion.cantidad)}
                          </span>
                          <span className="text-sm font-medium text-gray-600 shrink-0">
                            {conversion.codigo_moneda}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5 truncate">
                          {conversion.nombre}
                        </div>
                      </div>
                      <div className="text-green-600 shrink-0 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm3-7a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h4.5A.75.75 0 0113 9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Última actualización: {new Date(resultado.ultima_actualizacion).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 