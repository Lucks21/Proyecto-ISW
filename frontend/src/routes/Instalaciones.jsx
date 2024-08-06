import React, { useState, useEffect } from 'react';
import ModalEditInstalacion from '../components/ModalEditInstalacion';
import ModalAddInstalacion from '../components/ModalAddInstalacion';
import { getAllInstalaciones, deleteInstalacionById } from '../services/instalaciones.service';
import { toast } from 'react-toastify';

const Instalaciones = () => {
  const [instalaciones, setInstalaciones] = useState([]);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState(null);

  const fetchInstalaciones = async () => {
    try {
      const data = await getAllInstalaciones();
      if (data) {
        setInstalaciones(data);
      } else {
        toast.error('No se pudieron cargar las instalaciones.');
      }
    } catch (err) {
      console.error("Error fetching instalaciones:", err);
      toast.error('Error al obtener instalaciones.');
    }
  };

  useEffect(() => {
    fetchInstalaciones();
  }, []);

  const handleDeleteClick = async (instalacionId) => {
    try {
      await deleteInstalacionById(instalacionId);
      fetchInstalaciones();
      toast.success('Instalación eliminada con éxito');
    } catch (err) {
      console.error("Error deleting instalacion:", err);
      toast.error('Error al eliminar instalación.');
    }
  };

  const handleEditClick = (instalacion) => {
    setInstalacionSeleccionada(instalacion);
    setShowModalEditar(true);
  };

  const handleAddClick = () => {
    setShowModalAgregar(true);
  };

  return (
    <div className="mt-4 mx-2">
      <button
        type="button"
        className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 flex gap-2 items-center"
        onClick={handleAddClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Agregar Instalación
      </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border max-w-screen-xl">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 w-1/5">Nombre</th>
              <th scope="col" className="px-6 py-3 w-1/5">Capacidad</th>
              <th scope="col" className="px-6 py-3 w-1/5">Descripción</th>
              <th scope="col" className="px-6 py-3 w-1/5">Estado</th>
              <th scope="col" className="px-6 py-3 w-1/5">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(instalaciones) && instalaciones.length > 0 ? (
              instalaciones.map((inst) => (
                <tr key={inst._id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                    {inst.nombre}
                  </th>
                  <td className="px-6 py-4">{inst.capacidad}</td>
                  <td className="px-6 py-4">{inst.descripcion}</td>
                  <td className={`px-6 py-4 font-medium ${inst.estado === 'disponible' ? 'text-green-600' : 'text-red-600'}`}>
                    {inst.estado}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-2">
                    <button
                      className="px-3 py-2 text-xs font-medium text-center text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300 focus:outline-none rounded-lg"
                      onClick={() => handleEditClick(inst)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-2 text-xs font-medium text-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none rounded-lg"
                      onClick={() => handleDeleteClick(inst._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No hay instalaciones disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModalEditar && (
        <ModalEditInstalacion
          instalacion={instalacionSeleccionada}
          setShowModalEditar={setShowModalEditar}
          fetchInstalaciones={fetchInstalaciones}
        />
      )}
      {showModalAgregar && (
        <ModalAddInstalacion
          setShowModalAgregar={setShowModalAgregar}
          fetchInstalaciones={fetchInstalaciones}
        />
      )}
    </div>
  );
};

export default Instalaciones;
