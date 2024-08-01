import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const ModalAddImpl = ({ setShowModalAgregar }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [estado, setEstado] = useState('disponible');
  const [fechaAdquisicion, setFechaAdquisicion] = useState(null);
  const [horarioDisponibilidad, setHorarioDisponibilidad] = useState([]);
  const [error, setError] = useState('');

  const validateFields = () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!cantidad || cantidad <= 0) {
      setError('La cantidad debe ser mayor que 0');
      return false;
    }
    if (!fechaAdquisicion) {
      setError('La fecha de adquisición es obligatoria');
      return false;
    }
    if (horarioDisponibilidad.some(horario => !horario.inicio || !horario.fin)) {
      setError('Todos los horarios deben tener horas de inicio y fin válidas');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await fetch('/api/implementos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          cantidad,
          estado,
          fechaAdquisicion,
          horarioDisponibilidad,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || 'Error al añadir implemento');
        toast.error(result.message || 'Error al añadir implemento');
      } else {
        setError('');
        setShowModalAgregar(false);
        toast.success('Implemento añadido con éxito');
        // Maneja el éxito (e.g., cerrar modal, actualizar datos)
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-medium text-gray-900">Añadir Implemento</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="disponible">Disponible</option>
            <option value="no disponible">No disponible</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <DatePicker
            selected={fechaAdquisicion}
            onChange={(date) => setFechaAdquisicion(date)}
            maxDate={new Date()}
            placeholderText="Fecha de Adquisición"
            dateFormat="dd-MM-yyyy"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Días de Disponibilidad:</label>
          {horarioDisponibilidad.map((horario, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.dia}
                onChange={(e) =>
                  setHorarioDisponibilidad((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, dia: e.target.value } : item))
                  )
                }
              >
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miércoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
              </select>
              <input
                type="time"
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.inicio}
                onChange={(e) =>
                  setHorarioDisponibilidad((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, inicio: e.target.value } : item))
                  )
                }
              />
              <input
                type="time"
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.fin}
                onChange={(e) =>
                  setHorarioDisponibilidad((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, fin: e.target.value } : item))
                  )
                }
              />
              <button
                className="text-red-500"
                onClick={() =>
                  setHorarioDisponibilidad((prev) => prev.filter((_, i) => i !== index))
                }
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            className="text-blue-500"
            onClick={() =>
              setHorarioDisponibilidad((prev) => [
                ...prev,
                { dia: 'lunes', inicio: '', fin: '' },
              ])
            }
          >
            Añadir horario
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
            onClick={() => handleSubmit()}
          >
            Guardar
          </button>
          <button
            className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
            onClick={() => setShowModalAgregar(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddImpl;
