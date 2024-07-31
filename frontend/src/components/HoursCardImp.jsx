import { generateHourlyIntervals } from "../utils/hoursIntervals";
import { useEffect, useState } from "react";
import { Toast } from "flowbite-react";
import { reservar, getReservasActivas } from "../services/reservas.service";
import { getUserByEmail } from "../services/user.service";
import { HiFire } from "react-icons/hi";
import { format } from "date-fns";
import { TailSpin } from "react-loader-spinner";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function HoursCard({ imp }) {
  const [hoursIntervalsDays, setHoursIntervalsDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hourInicio, setHourInicio] = useState("");
  const [hourFin, setHourFin] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [feedBack, setFeedBack] = useState("");
  const [isError, setIsError] = useState(false);
  const [reservasActivas, setReservasActivas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const user = JSON.parse(localStorage.getItem("user")) || "";
      const res = await getUserByEmail(user.email);
      setUserInfo(res);
    })();
  }, []);

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const handleHourClick = (hour) => {
    setHourInicio(hour);
    const hourEnd = `${parseInt(hour.split(":")[0]) + 1}:00`;
    setHourFin(hourEnd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reserva = {
      [imp.cantidad ? "implementoId" : "instalacionId"]: imp._id,
      fechaInicio: {
        fecha: format(selectedDate, "dd-MM-yyyy"),
        hora: hourInicio,
      },
      fechaFin: {
        fecha: format(selectedDate, "dd-MM-yyyy"),
        hora: hourFin,
      },
      userId: userInfo._id,
    };

    console.log({ reserva });

    setLoading(true);
    const { data, message, error } = await reservar(reserva, imp);
    setLoading(false);

    setShowToast(true);
    const newFeedback = data ? data : message;
    const newIsError = !data ? true : false;

    setFeedBack(newFeedback);
    setIsError(newIsError);

    setTimeout(() => {
      setShowToast(false);
    }, 5000);

    // Actualiza las reservas activas después de realizar una reserva
    if (data) {
      const { data: newReservasActivas } = await getReservasActivas();
      setReservasActivas(newReservasActivas);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await getReservasActivas();
      setReservasActivas(data);
    })();

    const hoursIntervals = imp.horarioDisponibilidad.map((horario) => {
      const { inicio, fin, dia } = horario;
      const hours = generateHourlyIntervals(
        inicio,
        fin,
        dia,
        selectedDate,
        reservasActivas,
        imp
      );
      return { dia, hours };
    });

    setHoursIntervalsDays(hoursIntervals);
  }, [imp, selectedDate, reservasActivas]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
          <TailSpin
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="loading"
          />
        </div>
      )}
      <div className="m-4 w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none text-gray-900">
            Horarios Disponibles
          </h5>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-gray-900 truncate capitalize">
            {imp.nombre}
          </h5>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              dateFormat="dd-MM-yyyy"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            <HiFire className="w-6 h-6 text-gray-500" onClick={() => setShowDatePicker(true)} />
          </div>
          <div className="flex gap-4">
            <div>
              <label
                htmlFor="horaInicio"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Hora inicio
              </label>
              <input
                type="text"
                id="horaInicio"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="10:00"
                required
                value={hourInicio}
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="horaFin"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Hora fin
              </label>
              <input
                type="text"
                id="horaFin"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="12:00"
                required
                value={hourFin}
                readOnly
              />
            </div>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {hoursIntervalsDays.map((horario, index) => (
                <li className="py-3 sm:py-4" key={index}>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 truncate capitalize">
                      {horario.dia}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {horario.hours.map((hour, index) => (
                        <label
                          className={`flex items-center gap-3 border rounded-lg px-1.5 py-0.5 cursor-pointer ${
                            !hour.disponible ? "bg-red-600 text-white" : "bg-green-200"
                          }`}
                          key={index}
                          onClick={() => handleHourClick(hour.hour)}
                        >
                          {hour.hour}
                        </label>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Realizar reserva
          </button>
        </form>
      </div>
      <div className="space-y-4 fixed top-20 right-4">
        {showToast && (
          <Toast className={`${isError ? "bg-red-100/90" : "bg-cyan-100/80"}`}>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                isError
                  ? "bg-red-100 text-red-500"
                  : "bg-cyan-100 text-cyan-500"
              }`}
            >
              <HiFire className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{feedBack}</div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        )}
      </div>
    </>
  );
}
