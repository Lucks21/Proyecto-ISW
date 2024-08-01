import { useEffect, useState } from "react";
import Grafico from "../components/Grafico";
import { getHistorico } from "../services/reservas.service";
import { useAuth } from "../context/AuthContext";

export default function GraficoReserva() {
  const [historico, setHistorico] = useState();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await getHistorico(user.id);
      console.log(data, user);
      setHistorico(data);
    })();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full p-4 text-center sm:p-8">
        <h5 className="mb-16 text-3xl font-bold text-gray-900">
          Historico de Reservas
        </h5>
        {historico && <Grafico historico={historico} />}
      </div>
    </div>
  );
}
