const Footer = () => (
  <footer className="bg-blue-800 text-white py-4 mt-8 w-full text-center text-sm flex flex-col items-center gap-1">
    <span>&copy; {new Date().getFullYear()} Reporte Financiero. Todos los derechos reservados.</span>
    <span>
      Hecho por{' '}
      <a
        href="https://curriculumwebrogrl.onrender.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-blue-200 transition-colors"
      >
        Rodolfo Groero Leiva
      </a>
    </span>
  </footer>
);

export default Footer; 