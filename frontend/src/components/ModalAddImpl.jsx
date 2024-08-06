import React, { useState } from "react";
import { toast } from "react-toastify";
import { addImplemento } from "../services/implementos.services";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { es } from "date-fns/locale";

registerLocale("es", es);

const ModalAddImpl = ({ setShowModalAgregar, fetchImplementos }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [estado, setEstado] = useState("disponible");
  const [fechaAdquisicion, setFechaAdquisicion] = useState(new Date());
  const [horarioDisponibilidad, setHorarioDisponibilidad] = useState([{ dia: "", inicio: "", fin: "" }]);

  const handleAddImplemento = async () => {
    const today = new Date();
    if (fechaAdquisicion > today) {
      toast.error("La fecha de adquisición no puede ser futura.");
      return;
    }

    const formattedFechaAdquisicion = moment(fechaAdquisicion).format("DD-MM-YYYY");

    const implemento = {
      nombre,
      descripcion,
      cantidad,
      estado,
      fechaAdquisicion: formattedFechaAdquisicion,
      horarioDisponibilidad,
    };

    try {
      await addImplemento(implemento);
      toast.success("Implemento agregado con éxito");
      fetchImplementos();
      setShowModalAgregar(false);
    } catch (error) {
      toast.error(`Error al agregar implemento: ${error.response.data.message}`);
    }
  };

  const horasCompletas = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-[#EFF396] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Implemento</h2>
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
            locale="es"
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
                {horasCompletas.map((hora) => (
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
                {horasCompletas.map((hora) => (
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
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
            onClick={handleAddImplemento}
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
