import React, { useState, useEffect } from 'react';
import { partialUpdateInstalacion } from '../services/instalaciones.service';
import { toast } from 'react-toastify';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const ModalEditInstalacion = ({ instalacion, setShowModalEditar, fetchInstalaciones }) => {
  const [nombre, setNombre] = useState(instalacion.nombre || '');
  const [descripcion, setDescripcion] = useState(instalacion.descripcion || '');
  const [capacidad, setCapacidad] = useState(instalacion.capacidad || '');
  const [estado, setEstado] = useState(instalacion.estado || '');
  const [diasDisponibilidad, setDiasDisponibilidad] = useState(instalacion.horarioDisponibilidad.map(h => h.dia.toLowerCase()));
  const [horario, setHorario] = useState(instalacion.horarioDisponibilidad);

  const [errors, setErrors] = useState({});

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

  const validateFields = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!capacidad || isNaN(capacidad) || capacidad <= 0) newErrors.capacidad = 'La capacidad debe ser un número positivo';
    if (!estado.trim()) newErrors.estado = 'El estado es requerido';

    diasDisponibilidad.forEach(dia => {
      const diaHorario = horario.find(h => h.dia.toLowerCase() === dia.toLowerCase());
      if (!diaHorario || !diaHorario.inicio || !diaHorario.fin) {
        newErrors[dia] = 'Debe proporcionar horas de inicio y fin válidas';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }

    const updatedFields = {
      nombre,
      descripcion,
      capacidad,
      estado,
    };

    let updatedHorario = diasDisponibilidad.map(dia => {
      const diaHorario = horario.find(h => h.dia.toLowerCase() === dia.toLowerCase()) || {};
      return {
        dia,
        inicio: diaHorario.inicio || '',
        fin: diaHorario.fin || ''
      };
    });

    if (JSON.stringify(updatedHorario) !== JSON.stringify(instalacion.horarioDisponibilidad)) {
      updatedFields.horarioDisponibilidad = updatedHorario;
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
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
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
          {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
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
          {errors.capacidad && <p className="text-red-500 text-xs mt-1">{errors.capacidad}</p>}
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
          {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Días de Disponibilidad:</label>
          <FormGroup row>
            {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => (
              <FormControlLabel
                key={dia}
                control={
                  <Checkbox
                    value={dia}
                    checked={diasDisponibilidad.includes(dia)}
                    onChange={handleDiaChange}
                  />
                }
                label={dia.charAt(0).toUpperCase() + dia.slice(1)}
              />
            ))}
          </FormGroup>
          {diasDisponibilidad.map(dia => (
            <div className="flex items-center space-x-2 mb-2" key={dia}>
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.find(h => h.dia.toLowerCase() === dia.toLowerCase())?.inicio || ''}
                onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
              >
                <option value="">Inicio</option>
                {horasCompletas.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              <select
                className="mt-1 block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={horario.find(h => h.dia.toLowerCase() === dia.toLowerCase())?.fin || ''}
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
                  setDiasDisponibilidad(diasDisponibilidad.filter(d => d !== dia));
                  setHorario(horario.filter(h => h.dia.toLowerCase() !== dia.toLowerCase()));
                }}
              >
                Eliminar
              </button>
              {errors[dia] && <p className="text-red-500 text-xs mt-1">{errors[dia]}</p>}
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
            onClick={handleSubmit}
          >
            Guardar
          </button>
          <button
            className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
            onClick={() => setShowModalEditar(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditInstalacion;
