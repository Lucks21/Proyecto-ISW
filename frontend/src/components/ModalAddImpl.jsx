import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addImplemento, getAllImplementos } from '../services/implementos.services';
import { toast } from 'react-toastify';
import { addImplemento, getAllImplementos } from '../services/implementos.services';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import moment from 'moment';

const ModalAddImpl = ({ setShowModalAgregar, setImplementos }) => {
const ModalAddImpl = ({ setShowModalAgregar, setImplementos }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estado, setEstado] = useState('disponible');
  const [fechaAdquisicion, setFechaAdquisicion] = useState(new Date());
  const [horarioDisponibilidad, setHorarioDisponibilidad] = useState([{ dia: '', inicio: '', fin: '' }]);
  const [errors, setErrors] = useState({});

  const handleAddImplemento = async () => {
    const today = new Date();
    if (fechaAdquisicion > today) {
      toast.error('La fecha de adquisición no puede ser futura.');
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
      } else {
        setError('');
        setShowModalAgregar(false);
        // Maneja el éxito (e.g., cerrar modal, actualizar datos)
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  const horasCompletas = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const horasCompletas = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-[#EFF396] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Implemento</h2>
        {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {errors.nombre && <div className="text-red-500">{errors.nombre}</div>}
          {errors.nombre && <div className="text-red-500">{errors.nombre}</div>}
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
          {errors.descripcion && <div className="text-red-500">{errors.descripcion}</div>}
          {errors.descripcion && <div className="text-red-500">{errors.descripcion}</div>}
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
          {errors.cantidad && <div className="text-red-500">{errors.cantidad}</div>}
          {errors.cantidad && <div className="text-red-500">{errors.cantidad}</div>}
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
          {errors.estado && <div className="text-red-500">{errors.estado}</div>}
          {errors.estado && <div className="text-red-500">{errors.estado}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <label className="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <DatePicker
            selected={fechaAdquisicion}
            onChange={(date) => setFechaAdquisicion(date)}
            maxDate={new Date()}
            placeholderText="Fecha de Adquisición"
            dateFormat="dd-MM-yyyy"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {errors.fechaAdquisicion && <div className="text-red-500">{errors.fechaAdquisicion}</div>}
          {errors.fechaAdquisicion && <div className="text-red-500">{errors.fechaAdquisicion}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Días de Disponibilidad:</label>
          {horarioDisponibilidad.map((horario, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.dia}
                onChange={(e) => {
                  const newHorarioDisponibilidad = [...horarioDisponibilidad];
                  newHorarioDisponibilidad[index].dia = e.target.value;
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
              >
                <option value="">Seleccione un día</option>
                onChange={(e) => {
                  const newHorarioDisponibilidad = [...horarioDisponibilidad];
                  newHorarioDisponibilidad[index].dia = e.target.value;
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
              >
                <option value="">Seleccione un día</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
              </select>
              {errors[`horarioDisponibilidad.${index}.dia`] && <div className="text-red-500">{errors[`horarioDisponibilidad.${index}.dia`]}</div>}
              <select
              {errors[`horarioDisponibilidad.${index}.dia`] && <div className="text-red-500">{errors[`horarioDisponibilidad.${index}.dia`]}</div>}
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.inicio}
                onChange={(e) => {
                  const newHorarioDisponibilidad = [...horarioDisponibilidad];
                  newHorarioDisponibilidad[index].inicio = e.target.value;
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
              >
                <option value="">Inicio</option>
                {horasCompletas.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              {errors[`horarioDisponibilidad.${index}.inicio`] && <div className="text-red-500">{errors[`horarioDisponibilidad.${index}.inicio`]}</div>}
              <select
                onChange={(e) => {
                  const newHorarioDisponibilidad = [...horarioDisponibilidad];
                  newHorarioDisponibilidad[index].inicio = e.target.value;
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
              >
                <option value="">Inicio</option>
                {horasCompletas.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              {errors[`horarioDisponibilidad.${index}.inicio`] && <div className="text-red-500">{errors[`horarioDisponibilidad.${index}.inicio`]}</div>}
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.fin}
                onChange={(e) => {
                  const newHorarioDisponibilidad = [...horarioDisponibilidad];
                  newHorarioDisponibilidad[index].fin = e.target.value;
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
              >
                <option value="">Fin</option>
                {horasCompletas.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              {errors[`horarioDisponibilidad.${index}.fin`] && <div className="text-red-500">{errors[`horarioDisponibilidad.${index}.fin`]}</div>}
                onChange={(e) => {
                  const newHorarioDisponibilidad = [...horarioDisponibilidad];
                  newHorarioDisponibilidad[index].fin = e.target.value;
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
              >
                <option value="">Fin</option>
                {horasCompletas.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              {errors[`horarioDisponibilidad.${index}.fin`] && <div className="text-red-500">{errors[`horarioDisponibilidad.${index}.fin`]}</div>}
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1.5"
                onClick={() => {
                  const newHorarioDisponibilidad = horarioDisponibilidad.filter((_, i) => i !== index);
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
                type="button"
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1.5"
                onClick={() => {
                  const newHorarioDisponibilidad = horarioDisponibilidad.filter((_, i) => i !== index);
                  setHorarioDisponibilidad(newHorarioDisponibilidad);
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2"
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2"
            onClick={() =>
              setHorarioDisponibilidad([
                ...horarioDisponibilidad,
                { dia: '', inicio: '', fin: '' },
              setHorarioDisponibilidad([
                ...horarioDisponibilidad,
                { dia: '', inicio: '', fin: '' },
              ])
            }
          >
            Añadir Horario
            Añadir Horario
          </button>
        </div>
        <div className="flex justify-end mt-4">
        <div className="flex justify-end mt-4">
          <button
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
            onClick={handleAddImplemento}
          >
            Guardar
          </button>
          <button
            className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
            onClick={() => setShowConfirmCancel(true)}
            onClick={() => setShowConfirmCancel(true)}
          >
            Cancelar
          </button>
        </div>
      </div>

      {showConfirmSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-700 ease-out">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">¿Está seguro que desea guardar los cambios?</p>
            <div className="flex justify-end">
              <button
                className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                onClick={() => {
                  handleAddImplemento();
                  setShowConfirmSave(false);
                }}
              >
                Sí
              </button>
              <button
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                onClick={() => setShowConfirmSave(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmCancel && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-700 ease-out">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">¿Está seguro que desea cancelar los cambios?</p>
            <div className="flex justify-end">
              <button
                className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                onClick={() => setShowModalAgregar(false)}
              >
                Sí
              </button>
              <button
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                onClick={() => setShowConfirmCancel(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-700 ease-out">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">¿Está seguro que desea guardar los cambios?</p>
            <div className="flex justify-end">
              <button
                className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                onClick={() => {
                  handleAddImplemento();
                  setShowConfirmSave(false);
                }}
              >
                Sí
              </button>
              <button
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                onClick={() => setShowConfirmSave(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmCancel && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-700 ease-out">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">¿Está seguro que desea cancelar los cambios?</p>
            <div className="flex justify-end">
              <button
                className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                onClick={() => setShowModalAgregar(false)}
              >
                Sí
              </button>
              <button
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                onClick={() => setShowConfirmCancel(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalAddImpl;
