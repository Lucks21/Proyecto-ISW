import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { transformData } from "../utils/tranformDataToChart";

const data1 = {
  "pelotas de mamutt2": 1,
  "raquetas de futbol": 1,
  "pelotas dfdfdffd": 2,
  pelotas: 2,
  "pelotas sddsssssssla": 4,
  "implemento de prueba": 1,
};

const data2 = {
  prueba6: 1,
  "sala de pesas": 2,
  "cancha de tenis 2": 2,
  "sala de futbol 3": 2,
};

const totalReservas1 = 18; // Agrega tu total de reservas aquí
const totalReservas2 = 18; // Agrega tu total de reservas aquí

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function Grafico({ historico }) {
  const { reservasPorImplemento, reservasPorInstalacion, totalReservas } =
    historico;

  const newReservasPorImplemento = transformData(
    reservasPorImplemento,
    totalReservas
  );
  const newReservasPorInstalacion = transformData(
    reservasPorInstalacion,
    totalReservas
  );
  return (
    <div className="flex items-center justify-around">
      <div className="grafico-container">
        <h3 className="text-base text-gray-500 sm:text-lg">
          Reservas por Implemento
        </h3>
        <PieChart width={400} height={400}>
          <Pie
            data={newReservasPorImplemento}
            cx={200}
            cy={200}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {newReservasPorImplemento.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      <div className="grafico-container">
        <h3 className="text-base text-gray-500 sm:text-lg">
          Reservas por Instalación
        </h3>
        <PieChart width={400} height={400}>
          <Pie
            data={newReservasPorInstalacion}
            cx={200}
            cy={200}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {newReservasPorInstalacion.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
