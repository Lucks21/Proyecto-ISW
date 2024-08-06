import React, { useState } from "react";
import { toast } from "react-toastify";
import { addInstalacion } from "../services/instalaciones.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const ModalAddInstalacion = ({ setShowModalAgregar, fetchInstalaciones }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [estado, setEstado] = useState("disponible");
  const [fechaAdquisicion, setFechaAdquisicion] = useState(new Date());
  const [horarioDisponibilidad, setHorarioDisponibilidad] = useState([{ dia: "", inicio: "", fin: "" }]);

  const validateFields = () => {
    const errors = {};
    const nombreRegex = /^[a-zA-Z0-9\s-_]+$/;

    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    } else if (!nombreRegex.test(nombre) || !/[a-zA-Z]/.test(nombre)) {
      errors.nombre = "El nombre solo puede contener letras, números, guiones, guiones bajos y espacios, y debe incluir letras";
    }
    if (!descripcion.trim()) errors.descripcion = "La descripción es requerida";
    if (!capacidad || isNaN(capacidad) || capacidad <= 0) errors.capacidad = "La capacidad debe ser un número positivo";

    horarioDisponibilidad.forEach((horario, index) => {
      if (!horario.dia) {
        errors[`dia-${index}`] = "Debe seleccionar un día";
      }
      if (!horario.inicio) {
        errors[`inicio-${index}`] = "Debe proporcionar una hora de inicio";
      }
      if (!horario.fin) {
        errors[`fin-${index}`] = "Debe proporcionar una hora de fin";
      }
      if (horario.fin <= horario.inicio) {
        errors[`fin-${index}`] = `La hora de inicio (${horario.inicio}) no puede ser mayor o igual que la hora de fin (${horario.fin}) para el día ${horario.dia}.`;
      }
    });

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };

  const handleAddInstalacion = async () => {
    if (!validateFields()) return;

    const today = new Date();
    if (fechaAdquisicion > today) {
      toast.error("La fecha de adquisición no puede ser futura.");
      return;
    }
    const formattedFechaAdquisicion = moment(fechaAdquisicion).format("DD-MM-YYYY");
    const instalacion = {
      nombre,
      descripcion,
      capacidad,
      estado,
      fechaAdquisicion: formattedFechaAdquisicion,
      horarioDisponibilidad,
    };

    try {
      await addInstalacion(instalacion);
      toast.success("Instalación agregada con éxito");
      fetchInstalaciones();
      setShowModalAgregar(false);
    } catch (error) {
      toast.error(`Error al agregar instalación: ${error.message || 'Error desconocido'}`);
    }
  };

  const horasCompletas = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-[#EFF396] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Instalación</h2>
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
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
              </select>
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
              <button
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
            onClick={() =>
              setHorarioDisponibilidad([
                ...horarioDisponibilidad,
                { dia: "", inicio: "", fin: "" },
              ])
            }
          >
            Añadir Horario
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
            onClick={handleAddInstalacion}
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

export default ModalAddInstalacion;
