import type { ConversionRequest, ConversionResponse, MonedaResponse } from '../types/moneda';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const monedaService = {
  listarMonedas: async (): Promise<MonedaResponse[]> => {
    const response = await fetch(`${API_URL}/api/calculadora/monedas`);
    if (!response.ok) {
      throw new Error('Error al obtener las monedas');
    }
    return response.json();
  },

  obtenerMoneda: async (codigoMoneda: string): Promise<MonedaResponse> => {
    const response = await fetch(`${API_URL}/api/calculadora/monedas/${codigoMoneda}`);
    if (!response.ok) {
      throw new Error('Error al obtener la moneda');
    }
    return response.json();
  },

  convertir: async (datos: ConversionRequest): Promise<ConversionResponse> => {
    const response = await fetch(`${API_URL}/api/calculadora/convertir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      throw new Error('Error al realizar la conversión');
    }
    return response.json();
  },
}; 