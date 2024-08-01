import React, { useState, useEffect } from 'react';
import { partialUpdateInstalacion } from '../services/instalaciones.service';
import { toast } from 'react-toastify';

const ModalEditInstalacion = ({ instalacion, setShowModalEditar, fetchInstalaciones }) => {
  const [nombre, setNombre] = useState(instalacion.nombre || '');
  const [descripcion, setDescripcion] = useState(instalacion.descripcion || '');
  const [capacidad, setCapacidad] = useState(instalacion.capacidad || '');
  const [estado, setEstado] = useState(instalacion.estado || '');
  const [diasDisponibilidad, setDiasDisponibilidad] = useState(instalacion.horarioDisponibilidad.map(h => h.dia.toLowerCase()));
  const [horario, setHorario] = useState(instalacion.horarioDisponibilidad);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  useEffect(() => {
    setHorario(instalacion.horarioDisponibilidad);
  }, [instalacion]);

  const handleDiaChange = (e) => {
    const { value, checked } = e.target;
    setDiasDisponibilidad(prevState =>
      checked ? [...prevState, value.toLowerCase()] : prevState.filter(dia => dia !== value.toLowerCase())
    );
  };

  const handleHorarioChange = (dia, field, value) => {
    setHorario(prevHorario => {
      const newHorario = prevHorario.map(h => 
        h.dia.toLowerCase() === dia.toLowerCase() ? { ...h, [field]: value } : h
      );
      if (!newHorario.find(h => h.dia.toLowerCase() === dia.toLowerCase())) {
        newHorario.push({ dia: dia.toLowerCase(), [field]: value });
      }
      return newHorario;
    });
  };

  const handleSubmit = async () => {
    const updatedFields = {
      nombre: nombre || instalacion.nombre,
      descripcion: descripcion || instalacion.descripcion,
      capacidad: capacidad || instalacion.capacidad,
      estado: estado || instalacion.estado,
    };

    let updatedHorario = [];
    if (diasDisponibilidad.length > 0) {
      updatedHorario = diasDisponibilidad.map(dia => {
        const diaHorario = horario.find(h => h.dia.toLowerCase() === dia.toLowerCase()) || {};
        return {
          dia,
          inicio: diaHorario.inicio || '',
          fin: diaHorario.fin || ''
        };
      });
    } else {
      updatedHorario = instalacion.horarioDisponibilidad;
    }

    if (JSON.stringify(updatedHorario) !== JSON.stringify(instalacion.horarioDisponibilidad)) {
      updatedFields.horarioDisponibilidad = updatedHorario;
    }

    const horariosValidos = updatedFields.horarioDisponibilidad
      ? updatedFields.horarioDisponibilidad.every(h => h.inicio && h.fin)
      : true;

    if (!horariosValidos) {
      toast.error('Por favor, asegúrese de que todos los días tengan horas de inicio y fin válidas');
      return;
    }

    try {
      console.log('Actualizando instalación con los siguientes campos:', updatedFields);
      const response = await partialUpdateInstalacion(instalacion._id, updatedFields);
      console.log('Respuesta del servidor:', response.data);
      fetchInstalaciones();
      setShowModalEditar(false);
      toast.success('Instalación actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar instalación:', error.response?.data?.message || error.message);
      toast.error(`Error al actualizar instalación: ${error.response?.data?.message || error.message}`);
    }
  };

  const horasCompletas = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-[#EFF396] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Editar Instalación</h2>
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
          <label className="block text-sm font-medium text-gray-700">Capacidad</label>
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Capacidad"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700">Días de Disponibilidad:</label>
          {diasDisponibilidad.map((dia, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={dia}
                onChange={(e) => handleDiaChange({ target: { value: e.target.value, checked: true } })}
              >
                <option value="">Seleccione un día</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
              </select>
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario[index]?.inicio || ''}
                onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
              >
                <option value="">Inicio</option>
                {horasCompletas.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario[index]?.fin || ''}
                onChange={(e) => handleHorarioChange(dia, 'fin', e.target.value)}
              >
                <option value="">Fin</option>
                {horasCompletas.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1.5"
                onClick={() => {
                  setDiasDisponibilidad(diasDisponibilidad.filter((_, i) => i !== index));
                  setHorario(horario.filter((_, i) => i !== index));
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-2"
            onClick={() => {
              setDiasDisponibilidad([...diasDisponibilidad, '']);
              setHorario([...horario, { dia: '', inicio: '', fin: '' }]);
            }}
          >
            Añadir Horario
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
            onClick={() => setShowConfirmSave(true)}
          >
            Guardar
          </button>
          <button
            className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
            onClick={() => setShowConfirmCancel(true)}
          >
            Cancelar
          </button>
        </div>
      </div>

      {showConfirmSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">¿Está seguro que desea guardar los cambios?</p>
            <div className="flex justify-end">
              <button
                className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                onClick={() => {
                  handleSubmit();
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">¿Está seguro que desea cancelar los cambios?</p>
            <div className="flex justify-end">
              <button
                className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                onClick={() => setShowModalEditar(false)}
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

export default ModalEditInstalacion;
