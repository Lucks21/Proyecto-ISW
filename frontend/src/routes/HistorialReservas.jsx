import { useEffect, useState } from "react";
import { getReservasMadeByUser } from "../services/reservas.service";
import { formatDate, formatTime } from "../utils/formatDate";

export default function HistorialReservas() {
  const [impReservados, setImpReservados] = useState([]);
  const [instReservados, setInstReservados] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: dataImp, message: messageImp } = await getReservasMadeByUser("implemento");
        console.log({ dataImp });
        if (dataImp) {
          setImpReservados(dataImp);
        } else {
          setError(messageImp);
        }

        const { data: dataInst, message: messageInst } = await getReservasMadeByUser("instalaciones");
        console.log({ dataInst });
        if (dataInst) {
          setInstReservados(dataInst);
        } else {
          setError(messageInst);
        }
      } catch (err) {
        setError("Error fetching data");
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="flex justify-around">
      <div className="m-4 w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none me-2 px-2.5 py-1 rounded bg-gray-100 text-gray-800">
            Implementos reservados ⚡
          </h5>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {impReservados.length === 0 ? (
              <h5 className="mb-4 text-lg font-bold leading-none tracking-tight text-gray-900 md:text-xl  flex flex-col">
                Aun no reservas ningun Implemento ...{" "}
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
              impReservados.map((imp, index) => (
                <li className={`py-3 sm:px-4`} key={index}>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 min-w-0 ms-4 space-y-2">
                      <p className="text-base font-medium text-gray-900 truncate capitalize">
                        {imp.implemento} 📆
                      </p>
                      <p>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                          Desde:
                        </span>
                        {formatDate(imp.fechaInicio)} ,{" "}
                        {formatTime(imp.fechaInicio)}
                      </p>
                      <p>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                          Hasta:
                        </span>
                        {formatDate(imp.fechaFin)} ,{" "}
                        {`${parseInt(formatTime(imp.fechaInicio).split(":")[0]) + 1}:00`}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <div className="m-4 w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[42rem] custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none me-2 px-2.5 py-1 rounded bg-gray-100 text-gray-800">
            Instalaciones reservadas 🏬
          </h5>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {instReservados.length === 0 ? (
              <h5 className="mb-4 text-lg font-bold leading-none tracking-tight text-gray-900 md:text-xl  flex flex-col">
                Aun no reservas ninguna Instalacion ...{" "}
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
              instReservados.map((inst, index) => (
                <li className={`py-3 sm:px-4`} key={index}>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 min-w-0 ms-4 space-y-2">
                      <p className="text-base font-medium text-gray-900 truncate capitalize">
                        {inst.instalacion} 📆
                      </p>
                      <p>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                          Desde:
                        </span>
                        {formatDate(inst.fechaInicio)} ,{" "}
                        {formatTime(inst.fechaInicio)}
                      </p>
                      <p>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                          Hasta:
                        </span>
                        {formatDate(inst.fechaFin)} ,{" "}
                        {`${parseInt(formatTime(inst.fechaInicio).split(":")[0]) + 1}:00`}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
