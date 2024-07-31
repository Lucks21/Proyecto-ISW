import React, { useState, useEffect } from 'react';
import ModalDisableDays from '../components/ModalDisableDays';
import { getDisabledDays, createDisabledDay, deleteDisabledDay } from '../services/disabledDays.service';
import { toast } from 'react-toastify';

const Configuracion = () => {
  const [showModalDisableDays, setShowModalDisableDays] = useState(false);
  const [disabledDays, setDisabledDays] = useState([]);

  const fetchDisabledDays = async () => {
    const data = await getDisabledDays();
    setDisabledDays(data.data);
  };

  const handleSaveDisabledDay = async (fecha) => {
    try {
      const response = await createDisabledDay(fecha);
      fetchDisabledDays();
      toast.success(`Día ${fecha} deshabilitado agregado. ${response.message}`);
    } catch (error) {
      toast.error(`Error al deshabilitar el día: ${error.message}`);
    }
  };

  const handleDelete = async (fecha) => {
    try {
      const response = await deleteDisabledDay(fecha);
      fetchDisabledDays();
      toast.success(response.message);
    } catch (error) {
      toast.error(`Error al eliminar el día: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchDisabledDays();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Deshabilitar Días de Reserva</h1>
      <div className="flex justify-center mb-6">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          onClick={() => setShowModalDisableDays(true)}
        >
          Deshabilitar Días
        </button>
      </div>
      <div className="bg-[#EFF396] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Días Deshabilitados</h2>
        <ul className="space-y-4">
          {disabledDays.map((day) => (
            <li key={day} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <span className="text-lg font-medium">{day}</span>
              <button
                onClick={() => handleDelete(day)}
                className="ml-4 px-3 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showModalDisableDays && (
        <ModalDisableDays
          setShowModalDisableDays={setShowModalDisableDays}
          fetchDisabledDays={fetchDisabledDays}
          handleSaveDisabledDay={handleSaveDisabledDay}
        />
      )}
    </div>
  );
};

export default Configuracion;
