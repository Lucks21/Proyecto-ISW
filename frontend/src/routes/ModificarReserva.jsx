import { Tabs } from "flowbite-react";
import { HiOutlineSwitchHorizontal, HiOutlineX } from "react-icons/hi";
import {
  getReservasActivasByuserId,
  cancelarReservaById,
  extenderReserva
} from "../services/reservas.service";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "../utils/formatDate";
import { toast } from 'react-toastify';
import ConfirmationModal from "../components/ModalConfirm";

export default function ModificarReserva() {
  const [reservasActivas, setReservasActivas] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});

  const { user } = useAuth();

  const sortReservationsByDate = (reservations) => {
    return reservations.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
  };

  useEffect(() => {
    (async () => {
      const { data: incomingReservasActivas } = await getReservasActivasByuserId(user.id);
      const sortedReservations = sortReservationsByDate(incomingReservasActivas);
      setReservasActivas(sortedReservations);
    })();
  }, [user.id]);

  const handleClickCancelar = async (reservaId) => {
    const { status, data } = await cancelarReservaById(reservaId);

    if (status === 200) {
      const { data: incomingReservasActivas } = await getReservasActivasByuserId(user.id);
      const sortedReservations = sortReservationsByDate(incomingReservasActivas);
      setReservasActivas(sortedReservations);
    }
  };

  const handleClickExtender = async (reservaId, fechaFin) => {
    const date = new Date(fechaFin);

    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    localDate.setHours(localDate.getHours() + 1, 0, 0, 0);  // Set to the next full hour

    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    const hours = String(localDate.getHours()).padStart(2, "0");

    const nuevaFechaFin = {
      fecha: `${day}-${month}-${year}`,
      hora: `${hours}:00`,
    };

    const { status } = await extenderReserva(reservaId, nuevaFechaFin);

    if (status === 200) {
      const { data: incomingReservasActivas } = await getReservasActivasByuserId(user.id);
      const sortedReservations = sortReservationsByDate(incomingReservasActivas);
      setReservasActivas(sortedReservations);
      toast.success("Reserva extendida con éxito");
    } else {
      toast.error("Hubo un error extendiendo la reserva");
    }
  };

  const showConfirmationModal = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 ">
              Reservas activas
            </h5>
          </div>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200 ">
              {reservasActivas.length === 0 ? (
                <h5 className="mb-4 text-lg font-bold leading-none tracking-tight text-gray-900 md:text-xl  flex flex-col">
                  Aun no realizas ninguna reserva ...{" "}
                  <a
                    href="/reservar"
                    className="inline-flex items-center text-lg text-blue-600"
                  >
                    Reservar
                    <svg
                      className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                </h5>
              ) : (
                reservasActivas.map((reserva) => {
                  const item = reserva.implemento ? reserva.implemento : reserva.instalacion;

                  return (
                    <li className="py-3 sm:py-4" key={reserva._id}>
                      <div className="flex items-center">
                        <div className="flex-1 min-w-0 ms-4  space-y-2">
                          <p className="text-sm font-medium text-gray-900 truncate ">
                            {item?.nombre || "Nombre no disponible"} ⚡
                          </p>
                          <p>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                              Desde:
                            </span>
                            {formatDate(reserva.fechaInicio)} ,{" "}
                            {formatTime(reserva.fechaInicio)}
                          </p>
                          <p>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                              Hasta:
                            </span>
                            {formatDate(reserva.fechaFin)} ,{" "}
                            {`${
                              parseInt(formatTime(reserva.fechaInicio).split(":")[0]) + 1
                            }:00`}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 gap-2">
                          <button
                            type="button"
                            className="px-3 py-2 text-xs font-medium text-center text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300"
                            onClick={() =>
                              showConfirmationModal(
                                "¿Estás seguro de querer extender el horario de reserva?",
                                () => handleClickExtender(reserva._id, reserva.fechaFin)
                              )
                            }
                          >
                            Extender
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                            onClick={() =>
                              showConfirmationModal(
                                "¿Estás seguro que deseas cancelar la reserva?",
                                () => handleClickCancelar(reserva._id)
                              )
                            }
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmationModal
          title={confirmMessage.includes("extender") ? "Extender Reserva" : "Cancelar Reserva"}
          message={confirmMessage}
          onConfirm={() => {
            confirmAction();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
