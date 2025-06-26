import type { MouseEvent } from 'react';

const Header = () => {
  // Dispara un evento personalizado para que el componente principal gestione la descarga
  const handleDescargarClick = (e: MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('descargar-reporte-financiero'));
  };

  return (
    <header className="bg-blue-700 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <span className="text-2xl font-bold tracking-tight">Reporte Financiero</span>
        <button
          onClick={handleDescargarClick}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors text-lg"
        >
          Descargar CSV
        </button>
      </div>
    </header>
  );
};

export default Header; 