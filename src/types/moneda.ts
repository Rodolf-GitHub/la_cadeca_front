export interface MonedaResponse {
  codigo_moneda: string;
  nombre: string;
  equivalencia_usd: number | string;
  ultima_actualizacion: string;
}

export interface ConversionMonedaResponse {
  codigo_moneda: string;
  nombre: string;
  cantidad: number | string;
}

export interface ConversionResponse {
  moneda_origen: ConversionMonedaResponse;
  conversiones: ConversionMonedaResponse[];
  ultima_actualizacion: string;
}

export interface ConversionRequest {
  codigo_moneda: string;
  cantidad: number | string;
} 