import { Tabs } from "flowbite-react";
import Grafico from "../components/Grafico";
import {
  getReservasGraficoEncargado,
  getReservasActivas,
  getReservasNoActivas,
  getHisorialTodasReservas,
} from "../services/reservas.service";

import { formatDate, formatTime } from "../utils/formatDate";
import { HiOutlinePresentationChartLine, HiClipboardList, HiBookOpen } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Reservas() {
  const [historicoGrafico, setHistoricoGrafico] = useState();
  const [reservasActivas, setReservasActivas] = useState([]);
  const [reservasNoActivas, setReservasNoActivas] = useState([]);
  const [hisorialTodasReservas, setHistoricoTodasReservas] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getReservasGraficoEncargado();
        setHistoricoGrafico(data || []);
      } catch (error) {
        console.error("Error al obtener los datos del gráfico:", error);
      }

      try {
        const { data: activasData } = await getReservasActivas();
        setReservasActivas(activasData || []);
      } catch (error) {
        console.error("Error al obtener las reservas activas:", error);
      }

      try {
        const { data: noActivasData } = await getReservasNoActivas();
        setReservasNoActivas(noActivasData || []);
      } catch (error) {
        console.error("Error al obtener las reservas no activas:", error);
      }

      try {
        const { data: hisorialTodasReservas } = await getHisorialTodasReservas();
        setHistoricoTodasReservas(hisorialTodasReservas || []);
      } catch (error) {
        console.error("Error al obtener el historial de reservas:", error);
      }
    })();
  }, []);

  return (
    <Tabs aria-label="Tabs with underline" variant="underline" className="max-w-screen-xl mx-auto">
      <Tabs.Item active title="Reservas Activas" icon={HiBookOpen}>
        <div className="m-4 w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900">Reservas Activas</h5>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {reservasActivas.length > 0 ? (
                reservasActivas.map((reserva) => (
                  <li className="py-3 sm:px-4 rounded-md" key={reserva._id}>
                    <div className="flex items-center gap-6">
                      <div className="flex-1 min-w-0 ms-4 space-y-2">
                        <p className="text-sm font-medium text-gray-900 capitalize flex items-center">
                          <FaUser className="text-blue-800 me-2" /> {}
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Alumno:</span> {reserva.usuario || 'No especificado'}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">ReservaId:</span> {reserva._id}
                        </p>
                        {reserva.implemento ? (
                          <p className="text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Implemento:</span> {reserva.implemento}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Instalación:</span> {reserva.instalacion || 'N/A'}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Fecha Inicio:</span> {formatDate(reserva.fechaInicio)} , {formatTime(reserva.fechaInicio)}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Fecha Fin:</span> {formatDate(reserva.fechaFin)} , {formatTime(reserva.fechaFin)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-center text-base font-semibold text-gray-900 ">
                        <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${reserva.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{reserva.estado}</span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No hay reservas activas disponibles.</p>
              )}
            </ul>
          </div>
        </div>
      </Tabs.Item>

      <Tabs.Item
        title="Grafico Historial"
        icon={HiOutlinePresentationChartLine}
      >
        <div className="w-full">
          <div className="w-full p-4 text-center sm:p-8">
            <h5 className="mb-16 text-3xl font-bold text-gray-900">
              Historico de Reservas
            </h5>
            {historicoGrafico && <Grafico historico={historicoGrafico} />}
          </div>
        </div>
      </Tabs.Item>
      
      <Tabs.Item title="Historial no activas" icon={HiClipboardList}>
        <div className="m-4 w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900">Historial Reservas no Activas</h5>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {reservasNoActivas.length > 0 ? (
                reservasNoActivas.map((reserva) => (
                  <li className="py-3 sm:px-4 rounded-md" key={reserva._id}>
                    <div className="flex items-center gap-6">

                      <div className="flex-1 min-w-0 ms-4 space-y-2">
                        <p className="text-sm font-medium text-gray-900 capitalize flex items-center">
                          <FaUser className="text-blue-800 me-2" /> {}
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Alumno:</span> {reserva.usuario || 'No especificado'}
                        </p>
                        <p className="text-sm text-gray-500 ">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">ReservaId: </span> {reserva._id}
                        </p>
                        <p className="text-sm text-gray-500 ">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Implemento/Instalación: </span> {reserva.implemento || reserva.instalacion || 'N/A'}
                        </p>
                        <p>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Fecha Inicio:</span> {formatDate(reserva.fechaInicio)} , {formatTime(reserva.fechaInicio)}
                        </p>
                        <p>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Fecha Fin:</span> {formatDate(reserva.fechaFin)} , {formatTime(reserva.fechaFin)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-center text-base font-semibold text-gray-900 ">
                        <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${reserva.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{reserva.estado}</span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No hay reservas no activas disponibles.</p>
              )}
            </ul>
          </div>
        </div>
      </Tabs.Item>
      
      <Tabs.Item title="Historial reservas" icon={HiClipboardList}>
        <div className="m-4 w-full max-w-3xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900">Historial reservas {"(Historico)"}</h5>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {hisorialTodasReservas.length > 0 ? (
                hisorialTodasReservas.map((reserva) => (
                  <li className="py-3 sm:px-4 rounded-md" key={reserva._id}>
                    <div className="flex items-center gap-6">
                      <div className="flex-1 min-w-0 ms-4 space-y-2">
                        <p className="text-sm font-medium text-gray-900 capitalize flex items-center">
                          <FaUser className="text-blue-800 me-2" /> {}
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Alumno:</span> {reserva.usuario || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 ">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">ReservaId: </span> {reserva._id}
                        </p>
                        <p className="text-sm text-gray-500 ">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Implemento/Instalación: </span> {reserva.implemento || reserva.instalacion || 'N/A'}
                        </p>
                        <p>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Fecha Inicio:</span> {formatDate(reserva.fechaInicio)} , {formatTime(reserva.fechaInicio)}
                        </p>
                        <p>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Fecha Fin:</span> {formatDate(reserva.fechaFin)} , {formatTime(reserva.fechaFin)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-center text-base font-semibold text-gray-900 ">
                        <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${reserva.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{reserva.estado}</span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No hay reservas históricas disponibles.</p>
              )}
            </ul>
          </div>
        </div>
      </Tabs.Item>
    </Tabs>
  );
}
