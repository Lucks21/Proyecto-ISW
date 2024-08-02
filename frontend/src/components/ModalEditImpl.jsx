import React, { useState, useEffect } from 'react';
import { partialUpdateImplemento } from '../services/implementos.services';
import { toast } from 'react-toastify';

const ModalEditImpl = ({ implemento, setShowModalEditar, fetchImplementos }) => {
  const [nombre, setNombre] = useState(implemento.nombre || '');
  const [descripcion, setDescripcion] = useState(implemento.descripcion || '');
  const [cantidad, setCantidad] = useState(implemento.cantidad || '');
  const [estado, setEstado] = useState(implemento.estado || '');
  const [diasDisponibilidad, setDiasDisponibilidad] = useState(implemento.horarioDisponibilidad.map(h => h.dia.toLowerCase()));
  const [horario, setHorario] = useState(implemento.horarioDisponibilidad);

  useEffect(() => {
    setHorario(implemento.horarioDisponibilidad);
  }, [implemento]);

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
    const updatedFields = {};

    updatedFields.nombre = nombre || implemento.nombre;
    updatedFields.descripcion = descripcion || implemento.descripcion;
    updatedFields.cantidad = cantidad || implemento.cantidad;
    updatedFields.estado = estado || implemento.estado;

    const updatedHorario = diasDisponibilidad.map(dia => {
      const diaHorario = horario.find(h => h.dia.toLowerCase() === dia.toLowerCase()) || {};
      return {
        dia,
        inicio: diaHorario.inicio || '',
        fin: diaHorario.fin || ''
      };
    });

    if (JSON.stringify(updatedHorario) !== JSON.stringify(implemento.horarioDisponibilidad)) {
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
      const response = await partialUpdateImplemento(implemento._id, updatedFields);
      console.log('Respuesta del servidor:', response.data);
      fetchImplementos();
      setShowModalEditar(false);
      toast.success('Implemento actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar implemento:', error.response.data.message);
      toast.error(`Error al actualizar implemento: ${error.response.data.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 relative z-10 w-96">
        <h2 className="text-xl font-bold mb-4">Editar Implemento</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="disponible">Disponible</option>
              <option value="no disponible">No Disponible</option>
            </select>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Días de Disponibilidad:</h3>
            <div className="flex flex-wrap -mx-2">
              {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => (
                <div key={dia} className="flex items-center mx-2">
                  <input
                    type="checkbox"
                    value={dia}
                    checked={diasDisponibilidad.includes(dia)}
                    onChange={handleDiaChange}
                    className="mr-2"
                  />
                  <label className="capitalize">{dia}</label>
                </div>
              ))}
            </div>
          </div>
          {diasDisponibilidad.map(dia => (
            <div key={dia} className="space-y-2">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">{`${dia.charAt(0).toUpperCase() + dia.slice(1)} - Inicio`}</label>
                  <input
                    type="time"
                    value={horario.find(h => h.dia.toLowerCase() === dia.toLowerCase())?.inicio || ''}
                    onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700">{`${dia.charAt(0).toUpperCase() + dia.slice(1)} - Fin`}</label>
                  <input
                    type="time"
                    value={horario.find(h => h.dia.toLowerCase() === dia.toLowerCase())?.fin || ''}
                    onChange={(e) => handleHorarioChange(dia, 'fin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Guardar
            </button>
            <button
              onClick={() => setShowModalEditar(false)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditImpl;
