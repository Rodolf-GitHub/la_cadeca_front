export interface PropietarioLoginRequest {
  telf_1: string;
}

export interface PropietarioVerifyRequest {
  telf_1: string;
  codigo: string;
}

export interface PropietarioLoginResponse {
  access: string;
  refresh: string;
  propietario_id: string;
  nombre: string;
  rol: string;
  telf_1?: string;
  email?: string;
  dni?: string;
  nif?: string;
  direccion?: string;
  comunidades: Record<string, unknown>[];
}

export interface LoginResponse {
  message: string;
  codigo?: string; // Para modo debug
}

export interface MiPerfilResponse {
  id: string;
  nombre: string;
  dni?: string;
  nif?: string;
  datos_contacto: DatosContactoResponse;
  direccion?: string;
  codigo_postal?: string;
  municipio?: string;
  provincia?: string;
  pais?: string;
}

export interface DatosContactoResponse {
  email?: string;
  telf_1?: string;
  telf_2?: string;
}

export interface MiHogarResponse {
  direccion: string;
  codigo_postal?: string;
  municipio?: string;
  provincia?: string;
  residente?: string;
}

export interface MiComunidadResponse {
  nombre: string;
  direccion: string;
  propietarios: PropietarioComunitarioResponse[];
  soy_presidente: boolean;
}

export interface PropietarioComunitarioResponse {
  id: string;
  nombre: string;
  residente?: string;
  cargo?: string;
}

export interface ErrorResponse {
  message: string;
} 