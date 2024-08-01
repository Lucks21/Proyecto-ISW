import React, { useState } from 'react';
import { format, addDays, isAfter, isToday } from 'date-fns';
import { toast } from 'react-toastify';

const ModalDisableDays = ({ setShowModalDisableDays, handleSaveDisabledDay }) => {
  const [date, setDate] = useState('');
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleSave = async () => {
    setShowConfirmSave(true);
  };

  const confirmSave = async () => {
    if (date) {
      const adjustedDate = addDays(new Date(date), 1); // Sumar un día
      const formattedDate = format(adjustedDate, 'dd-MM-yyyy');
      await handleSaveDisabledDay(formattedDate);
      setShowModalDisableDays(false);
    }
    setShowConfirmSave(false);
  };

  const handleCancel = () => {
    setShowConfirmCancel(true);
  };

  const confirmCancel = () => {
    setShowModalDisableDays(false);
    setShowConfirmCancel(false);
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    if (isAfter(selectedDate, today) || isToday(selectedDate)) {
      setDate(e.target.value);
    } else {
      toast.error('No puedes seleccionar una fecha pasada.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-[#EFF396] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Deshabilitar Día</h2>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="border p-2 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            className="mr-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Guardar
          </button>
        </div>
        {showConfirmSave && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <p className="mb-4">¿Está seguro que desea guardar los cambios?</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowConfirmSave(false)}
                  className="mr-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                >
                  No
                </button>
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}
        {showConfirmCancel && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <p className="mb-4">¿Está seguro que desea cancelar?</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowConfirmCancel(false)}
                  className="mr-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                >
                  No
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDisableDays;
