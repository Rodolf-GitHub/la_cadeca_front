import { useState, useEffect } from 'react';
// import html2canvas from 'html2canvas';

const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const formatearNumero = (num: number) =>
  '$' + num.toLocaleString('es-ES', { maximumFractionDigits: 2 });

interface FilaReporte {
  fecha: string; // solo día
  ingresos: number;
  gastos: number;
  ganancia: number;
}

interface MesReporte {
  mes: string; // 'Enero', 'Febrero', etc.
  anio: number;
  filas: FilaReporte[];
}

function generarMes(ingresoBase: number, mes: number, anio: number, porcentajeGanancia: number): MesReporte {
  // mes: 0 = Enero, 11 = Diciembre
  const ingresos_total = ingresoBase;
  // El usuario ingresa el % de ganancia, por lo tanto gastos = ingresos - ganancia
  // ganancia = ingresos * (porcentajeGanancia / 100)
  // gastos = ingresos - ganancia
  const ganancia_total = Math.round(ingresos_total * (porcentajeGanancia / 100));
  const gastos_total = ingresos_total - ganancia_total;
  const ultimoDia = new Date(anio, mes + 1, 0);
  const diasEnMes = ultimoDia.getDate();
  const diasTrabajados = Math.floor(16 + Math.random() * 9);
  const diasSeleccionados = Array.from({ length: diasEnMes }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, diasTrabajados)
    .sort((a, b) => a - b);
  let ingresosRest = ingresos_total;
  let gastosRest = gastos_total;
  let gananciaRest = ganancia_total;
  const ingresosDiarios: number[] = [];
  const gastosDiarios: number[] = [];
  const gananciasDiarias: number[] = [];
  for (let i = 0; i < diasTrabajados; i++) {
    let ingreso, gasto, ganancia;
    if (i === diasTrabajados - 1) {
      ingreso = ingresosRest;
      gasto = gastosRest;
      ganancia = gananciaRest;
    } else {
      ingreso = Math.round(
        Math.min(
          (ingresos_total / diasTrabajados) * (0.7 + Math.random() * 0.6),
          ingresosRest
        )
      );
      ganancia = Math.round(
        Math.min(
          (ganancia_total / diasTrabajados) * (0.7 + Math.random() * 0.6),
          gananciaRest
        )
      );
      gasto = ingreso - ganancia;
      // Aseguramos que no sea negativo
      if (gasto < 0) {
        gasto = 0;
        ganancia = ingreso;
      }
    }
    ingresosDiarios.push(ingreso);
    gastosDiarios.push(gasto);
    gananciasDiarias.push(ganancia);
    ingresosRest -= ingreso;
    gastosRest -= gasto;
    gananciaRest -= ganancia;
  }
  const filas: FilaReporte[] = diasSeleccionados.map((dia, i) => ({
    fecha: `${dia}`,
    ingresos: ingresosDiarios[i],
    gastos: gastosDiarios[i],
    ganancia: gananciasDiarias[i],
  }));
  filas.push({
    fecha: 'TOTAL',
    ingresos: ingresosDiarios.reduce((a, b) => a + b, 0),
    gastos: gastosDiarios.reduce((a, b) => a + b, 0),
    ganancia: gananciasDiarias.reduce((a, b) => a + b, 0),
  });
  return {
    mes: MESES_ES[mes],
    anio,
    filas,
  };
}

function exportarCSV(mes: MesReporte) {
  let csv = '';
  csv += `Mes: ${mes.mes} ${mes.anio}\n`;
  csv += 'Día,Ingresos,Gastos,Ganancia\n';
  mes.filas.forEach((fila) => {
    csv += `${fila.fecha},${fila.ingresos},${fila.gastos},${fila.ganancia}\n`;
  });
  csv += '\n';
  return csv;
}

function exportarTXT(mes: MesReporte) {
  let txt = `Mes: ${mes.mes} ${mes.anio}\n`;
  txt += 'Día\tIngresos\tGastos\tGanancia\n';
  mes.filas.forEach((fila) => {
    txt += `${fila.fecha}\t${fila.ingresos}\t${fila.gastos}\t${fila.ganancia}\n`;
  });
  return txt;
}

function exportarHTML(mes: MesReporte) {
  let html = `<h2>Mes: ${mes.mes} ${mes.anio}</h2><table border='1' cellpadding='4' style='border-collapse:collapse;'>`;
  html += '<tr><th>Día</th><th>Ingresos</th><th>Gastos</th><th>Ganancia</th></tr>';
  mes.filas.forEach((fila) => {
    html += `<tr><td>${fila.fecha}</td><td>${fila.ingresos}</td><td>${fila.gastos}</td><td>${fila.ganancia}</td></tr>`;
  });
  html += '</table>';
  return html;
}

export const ReporteFinanciero = () => {
  const [ingreso, setIngreso] = useState('15000');
  const [mes, setMes] = useState(new Date().getMonth().toString());
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [porcentajeGanancia, setPorcentajeGanancia] = useState('20');
  const [reporte, setReporte] = useState<MesReporte | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Expone si hay reporte generado para el header
    (window as any).reporteFinancieroGenerado = !!reporte;
  }, [reporte]);

  useEffect(() => {
    const handler = (e: CustomEvent<{ tipo: string }>) => {
      if (!reporte) return;
      const tipo = e.detail?.tipo || 'csv';
      if (tipo === 'csv') {
        const csv = exportarCSV(reporte);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_financiero_${reporte.mes}_${reporte.anio}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (tipo === 'txt') {
        const txt = exportarTXT(reporte);
        const blob = new Blob([txt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_financiero_${reporte.mes}_${reporte.anio}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (tipo === 'html') {
        const html = exportarHTML(reporte);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_financiero_${reporte.mes}_${reporte.anio}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    };
    window.addEventListener('descargar-reporte-financiero', handler as EventListener);
    return () => window.removeEventListener('descargar-reporte-financiero', handler as EventListener);
  }, [reporte]);

  const handleGenerar = () => {
    setError('');
    const ingresoNum = parseInt(ingreso);
    const mesNum = parseInt(mes);
    const anioNum = parseInt(anio);
    const porcentajeNum = parseFloat(porcentajeGanancia);
    if (isNaN(ingresoNum) || ingresoNum <= 0) {
      setError('El ingreso debe ser un número positivo.');
      return;
    }
    if (isNaN(mesNum) || mesNum < 0 || mesNum > 11) {
      setError('Selecciona un mes válido.');
      return;
    }
    if (isNaN(anioNum) || anioNum < 2000 || anioNum > 2100) {
      setError('Selecciona un año válido.');
      return;
    }
    if (isNaN(porcentajeNum) || porcentajeNum < 0 || porcentajeNum > 100) {
      setError('El porcentaje de ganancia debe estar entre 0 y 100.');
      return;
    }
    setReporte(generarMes(ingresoNum, mesNum, anioNum, porcentajeNum));
  };

  // Años disponibles para seleccionar
  const aniosDisponibles = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl p-4 sm:p-8 mb-8 border border-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-10" style={{background: 'radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 70%)'}}></div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-900 mb-6 tracking-tight drop-shadow">Reporte Financiero Mensual</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 items-end z-10 relative">
          <div className="flex flex-col">
            <label className="font-semibold text-blue-800 mb-1 text-xs sm:text-sm">Mes</label>
            <select
              className="p-2 rounded-lg border border-blue-200 focus:border-blue-500 text-base text-center bg-blue-50"
              value={mes}
              onChange={e => setMes(e.target.value)}
            >
              {MESES_ES.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-blue-800 mb-1 text-xs sm:text-sm">Año</label>
            <select
              className="p-2 rounded-lg border border-blue-200 focus:border-blue-500 text-base text-center bg-blue-50"
              value={anio}
              onChange={e => setAnio(e.target.value)}
            >
              {aniosDisponibles.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-blue-800 mb-1 text-xs sm:text-sm">Ingresos ($)</label>
            <input
              type="number"
              className="p-2 rounded-lg border border-blue-200 focus:border-blue-500 text-base text-center bg-blue-50 placeholder-blue-300"
              value={ingreso}
              onChange={e => setIngreso(e.target.value)}
              placeholder="Ej: 15000"
              min={0}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-blue-800 mb-1 text-xs sm:text-sm">% Ganancia</label>
            <input
              type="number"
              className="p-2 rounded-lg border border-blue-200 focus:border-blue-500 text-base text-center bg-blue-50 placeholder-blue-300"
              value={porcentajeGanancia}
              onChange={e => setPorcentajeGanancia(e.target.value)}
              placeholder="Ej: 20"
              min={0}
              max={100}
            />
          </div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 hover:from-blue-800 hover:to-blue-500 text-white text-xl font-extrabold py-3 rounded-2xl transition-colors mb-2 shadow-xl tracking-wide z-10 relative"
          onClick={handleGenerar}
        >
          Generar Reporte
        </button>
        {error && <div className="text-red-600 text-center font-bold mb-2 text-sm z-10 relative">{error}</div>}
      </div>
      <div className="w-full max-w-4xl">
        {reporte && (
          <div className="mb-10 bg-white rounded-2xl shadow-lg p-3 sm:p-6 border border-blue-100">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4 text-center tracking-tight">{reporte.mes} {reporte.anio}</h2>
            <div className="w-full">
              <table className="w-full text-sm sm:text-base md:text-lg text-center border-separate border-spacing-y-1">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                    <th className="py-2 px-1 sm:px-2 rounded-l-xl">Día</th>
                    <th className="py-2 px-1 sm:px-2">Ingresos</th>
                    <th className="py-2 px-1 sm:px-2">Gastos</th>
                    <th className="py-2 px-1 sm:px-2 rounded-r-xl">Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.filas.map((fila, i) => (
                    <tr
                      key={i}
                      className={
                        fila.fecha === 'TOTAL'
                          ? 'bg-gradient-to-r from-blue-200 to-blue-300 font-bold text-blue-900'
                          : 'hover:bg-blue-50 transition-colors'
                      }
                    >
                      <td className="py-2 px-1 sm:px-2 font-mono text-blue-900">{fila.fecha}</td>
                      <td className="py-2 px-1 sm:px-2 text-green-700 font-semibold">{formatearNumero(fila.ingresos)}</td>
                      <td className="py-2 px-1 sm:px-2 text-red-600 font-semibold">{formatearNumero(fila.gastos)}</td>
                      <td className="py-2 px-1 sm:px-2 text-blue-800 font-bold">{formatearNumero(fila.ganancia)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">Los montos han sido distribuidos de manera semi-aleatoria entre los días trabajados.</div>
          </div>
        )}
      </div>
    </div>
  );
}; 