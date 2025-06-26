import { useState, useEffect } from 'react';

const MESES_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const formatearNumero = (num: number) =>
  num.toLocaleString('es-ES', { maximumFractionDigits: 2 });

interface FilaReporte {
  fecha: string; // formato: 'DD-MMM'
  ingresos: number;
  gastos: number;
  ganancia: number;
}

interface MesReporte {
  mes: string; // 'Ene', 'Feb', etc.
  filas: FilaReporte[];
}

function generarMeses(ingresoBase: number, meses: number): MesReporte[] {
  const resultados: MesReporte[] = [];
  const now = new Date();
  let fecha = new Date(now.getFullYear(), now.getMonth(), 1);

  for (let m = 0; m < meses; m++) {
    const variacion = 1 + (Math.random() * 0.1 - 0.05);
    const ingresos_total = Math.round(ingresoBase * variacion);
    const porcentaje_gastos = 0.77 + Math.random() * 0.05;
    const gastos_total = Math.round(ingresos_total * porcentaje_gastos);
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diasTrabajados = Math.floor(16 + Math.random() * 9);
    const diasSeleccionados = Array.from({ length: diasEnMes }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .slice(0, diasTrabajados)
      .sort((a, b) => a - b);
    let ingresosRest = ingresos_total;
    let gastosRest = gastos_total;
    const ingresosDiarios: number[] = [];
    const gastosDiarios: number[] = [];
    for (let i = 0; i < diasTrabajados; i++) {
      let ingreso, gasto;
      if (i === diasTrabajados - 1) {
        ingreso = ingresosRest;
        gasto = gastosRest;
      } else {
        ingreso = Math.round(
          Math.min(
            (ingresos_total / diasTrabajados) * (0.7 + Math.random() * 0.6),
            ingresosRest
          )
        );
        gasto = Math.round(
          Math.min(
            (gastos_total / diasTrabajados) * (0.7 + Math.random() * 0.6),
            gastosRest
          )
        );
      }
      ingresosDiarios.push(ingreso);
      gastosDiarios.push(gasto);
      ingresosRest -= ingreso;
      gastosRest -= gasto;
    }
    const filas: FilaReporte[] = diasSeleccionados.map((dia, i) => ({
      fecha: `${dia.toString().padStart(2, '0')}-${MESES_ES[fecha.getMonth()]}`,
      ingresos: ingresosDiarios[i],
      gastos: gastosDiarios[i],
      ganancia: ingresosDiarios[i] - gastosDiarios[i],
    }));
    filas.push({
      fecha: 'TOTAL',
      ingresos: ingresosDiarios.reduce((a, b) => a + b, 0),
      gastos: gastosDiarios.reduce((a, b) => a + b, 0),
      ganancia:
        ingresosDiarios.reduce((a, b) => a + b, 0) -
        gastosDiarios.reduce((a, b) => a + b, 0),
    });
    resultados.push({
      mes: MESES_ES[fecha.getMonth()],
      filas,
    });
    fecha = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1);
  }
  return resultados;
}

function exportarCSV(meses: MesReporte[]) {
  let csv = '';
  meses.forEach((mes) => {
    csv += `Mes: ${mes.mes}\n`;
    csv += 'Fecha,Ingresos,Gastos,Ganancia\n';
    mes.filas.forEach((fila) => {
      csv += `${fila.fecha},${fila.ingresos},${fila.gastos},${fila.ganancia}\n`;
    });
    csv += '\n';
  });
  return csv;
}

export const ReporteFinanciero = () => {
  const [ingreso, setIngreso] = useState('');
  const [meses, setMeses] = useState('12');
  const [reporte, setReporte] = useState<MesReporte[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = () => {
      if (reporte.length > 0) handleDescargar();
    };
    window.addEventListener('descargar-reporte-financiero', handler);
    return () => window.removeEventListener('descargar-reporte-financiero', handler);
  }, [reporte]);

  const handleGenerar = () => {
    setError('');
    const ingresoNum = parseInt(ingreso);
    const mesesNum = parseInt(meses);
    if (isNaN(ingresoNum) || ingresoNum <= 0) {
      setError('El ingreso debe ser un número positivo.');
      return;
    }
    if (isNaN(mesesNum) || mesesNum <= 0 || mesesNum > 36) {
      setError('La cantidad de meses debe ser entre 1 y 36.');
      return;
    }
    setReporte(generarMeses(ingresoNum, mesesNum));
  };

  const handleDescargar = () => {
    const csv = exportarCSV(reporte);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_financiero.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Reporte Financiero Mensual</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="font-semibold text-blue-800 mb-1">Ingresos del mes base (€)</label>
            <input
              type="number"
              className="p-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 text-2xl text-center"
              value={ingreso}
              onChange={e => setIngreso(e.target.value)}
              placeholder="Ej: 2500"
              min={0}
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="font-semibold text-blue-800 mb-1">Meses a simular</label>
            <input
              type="number"
              className="p-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 text-2xl text-center"
              value={meses}
              onChange={e => setMeses(e.target.value)}
              placeholder="Ej: 12"
              min={1}
              max={36}
            />
          </div>
        </div>
        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white text-2xl font-bold py-4 rounded-xl transition-colors mb-4"
          onClick={handleGenerar}
        >
          Generar Reporte
        </button>
        {error && <div className="text-red-600 text-center font-bold mb-4">{error}</div>}
      </div>
      <div className="w-full max-w-6xl">
        {reporte.map((mes) => (
          <div key={mes.mes} className="mb-12 bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4 text-center">Mes: {mes.mes}</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[400px] text-base md:text-lg text-center border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-2 md:p-3 border-b-2 border-blue-200">Fecha</th>
                    <th className="p-2 md:p-3 border-b-2 border-blue-200">Ingresos</th>
                    <th className="p-2 md:p-3 border-b-2 border-blue-200">Gastos</th>
                    <th className="p-2 md:p-3 border-b-2 border-blue-200">Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {mes.filas.map((fila, i) => (
                    <tr key={i} className={fila.fecha === 'TOTAL' ? 'bg-blue-200 font-bold text-blue-900' : ''}>
                      <td className="p-2 md:p-3 border-b border-blue-100">{fila.fecha}</td>
                      <td className="p-2 md:p-3 border-b border-blue-100">{formatearNumero(fila.ingresos)}</td>
                      <td className="p-2 md:p-3 border-b border-blue-100">{formatearNumero(fila.gastos)}</td>
                      <td className="p-2 md:p-3 border-b border-blue-100">{formatearNumero(fila.ganancia)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">Los montos han sido distribuidos de manera semi-aleatoria entre los días trabajados.</div>
          </div>
        ))}
      </div>
    </div>
  );
}; 