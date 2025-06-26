import { useState, useEffect } from 'react';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [mostrarDescarga, setMostrarDescarga] = useState(false);

  useEffect(() => {
    // Escucha cambios en window.reporteFinancieroGenerado
    const check = () => setMostrarDescarga((window as any).reporteFinancieroGenerado === true);
    check();
    window.addEventListener('focus', check);
    const interval = setInterval(check, 500);
    return () => {
      window.removeEventListener('focus', check);
      clearInterval(interval);
    };
  }, []);

  const handleDescargar = (tipo: string) => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('descargar-reporte-financiero', { detail: { tipo } }));
  };

  return (
    <header className="bg-blue-800 text-white py-2 sm:py-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 mr-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
          </span>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight">Reporte Financiero</span>
        </div>
        {mostrarDescarga && (
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow transition-colors text-base flex items-center gap-2"
              aria-label="Descargar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" /></svg>
              <span className="hidden sm:inline">Descargar</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-blue-900 rounded-lg shadow-lg border border-blue-100 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => handleDescargar('csv')}>Descargar CSV</button>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => handleDescargar('txt')}>Descargar TXT</button>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => handleDescargar('html')}>Descargar HTML</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 