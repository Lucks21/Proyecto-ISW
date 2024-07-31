import React, { useState, useEffect } from 'react';
import { Tabs, Popover } from 'flowbite-react';
import { HiOutlinePuzzle, HiOutlineOfficeBuilding, HiOutlineCalendar, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { getAllImplementos } from '../services/implementos.services';
import { getAllInstalaciones } from '../services/instalaciones.service';
import { reservar } from '../services/reservas.service';
import { solicitarNotificacion } from '../services/notificacion.services';
import HoursCardImp from '../components/HoursCardImp';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Reservar() {
  const [implementos, setImplementos] = useState([]);
  const [instalaciones, setInstalaciones] = useState([]);
  const [currentImp, setCurrentImpl] = useState();
  const [currentInst, setCurrentInst] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const implementosRes = await getAllImplementos();
      setImplementos(implementosRes);
      setCurrentImpl(implementosRes[0]);

      const instalaciones = await getAllInstalaciones();
      setInstalaciones(instalaciones);
      setCurrentInst(instalaciones[0]);
    })();
  }, []);

  const handleReserva = async (reservaData, item) => {
    setIsLoading(true);
    try {
      await reservar(reservaData, item);
      toast.success("Reserva realizada con éxito");
    } catch (error) {
      toast.error("Hubo un error realizando la reserva");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolicitud = async (item, tipo) => {
    setIsLoading(true);
    try {
      const solicitudData = {
        recursoId: item._id,
        recursoTipo: tipo,
        userId: user.id
      };
      await solicitarNotificacion(solicitudData);
      toast.success(`Solicitud enviada para ${item.nombre}`);
    } catch (error) {
      toast.error("Hubo un error realizando la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const popOverContent = (
    <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Reservar un implemento o instalación
        </h3>
      </div>
      <div className="px-3 py-2">
        <p>
          <span className="text-gray-900">
            <HiOutlineCalendar className="bg-blue-300 rounded-full p-1" size={25} />
            Ubica el implemento o instalación que desees reservar y haz clic
            sobre este icono y podrás empezar a reservar en el panel de la
            derecha.
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <div>
      {isLoading && <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50">Cargando...</div>}
      <Tabs aria-label="Tabs with underline" variant="underline" className="max-w-screen-xl mx-auto">
        <Tabs.Item active title="Implemento" icon={HiOutlinePuzzle}>
          <div className="flex justify-around">
            <div className="m-4 w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900">Implementos</h5>
                <Popover content={popOverContent} trigger="click">
                  <button>
                    <HiOutlineQuestionMarkCircle size={25} className="text-gray-900" />
                  </button>
                </Popover>
              </div>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {implementos.map((imp) => (
                    <li className={`py-3 sm:px-4 rounded-md ${imp._id === currentImp?._id ? 'bg-emerald-100' : ''}`} key={imp._id}>
                      <div className="flex items-center gap-6">
                        <div className="flex-1 min-w-0 ms-4">
                          <p className="text-sm font-medium text-gray-900 truncate capitalize">{imp.nombre}</p>
                          <p className="text-sm text-gray-500 truncate">{imp.descripcion}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-center text-base font-semibold text-gray-900 ">
                          <span className="text-sm font-medium text-gray-900 truncate capitalize">Cantidad: {imp.cantidad}</span>
                          <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${imp.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{imp.estado}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {imp.estado === 'disponible' ? (
                            <button className="bg-blue-200 rounded-full p-2 hover:bg-blue-400" title="reservar" onClick={() => setCurrentImpl(imp)}>
                              <HiOutlineCalendar />
                            </button>
                          ) : (
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" title="solicitud" onClick={() => handleSolicitud(imp, 'implemento')}>
                              Solicitud
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {currentImp && <HoursCardImp imp={currentImp} onReserva={(reservaData) => handleReserva(reservaData, currentImp)} />}
          </div>
        </Tabs.Item>
        <Tabs.Item title="Instalación" icon={HiOutlineOfficeBuilding}>
          <div className="flex justify-around">
            <div className="m-4 w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900">Instalaciones</h5>
                <Popover content={popOverContent} trigger="click">
                  <button>
                    <HiOutlineQuestionMarkCircle size={25} className="text-gray-900" />
                  </button>
                </Popover>
              </div>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {instalaciones.map((ins) => (
                    <li className={`py-3 sm:px-4 rounded-md ${ins._id === currentInst?._id ? 'bg-emerald-100' : ''}`} key={ins._id}>
                      <div className="flex items-center gap-6">
                        <div className="flex-1 min-w-0 ms-4">
                          <p className="text-sm font-medium text-gray-900 truncate capitalize">{ins.nombre}</p>
                          <p className="text-sm text-gray-500 truncate">{ins.descripcion}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-center text-base font-semibold text-gray-900 ">
                          <span className="text-sm font-medium text-gray-900 truncate capitalize">Capacidad: {ins.capacidad}</span>
                          <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${ins.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{ins.estado}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ins.estado === 'disponible' ? (
                            <button className="bg-blue-200 rounded-full p-2 hover:bg-blue-400" title="reservar" onClick={() => setCurrentInst(ins)}>
                              <HiOutlineCalendar />
                            </button>
                          ) : (
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" title="solicitud" onClick={() => handleSolicitud(ins, 'instalacion')}>
                              Solicitud
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {currentInst && <HoursCardImp imp={currentInst} onReserva={(reservaData) => handleReserva(reservaData, currentInst)} />}
          </div>
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
