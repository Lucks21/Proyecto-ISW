import { useEffect, useState } from "react";
import { getAllImplementos, deleteImplementoById } from "../services/implementos.services";
import ModalHistorial from "../components/ModalHistorial";
import ModalAddImpl from "../components/ModalAddImpl";
import ModalEditImpl from "../components/ModalEditImpl";
import { toast } from 'react-toastify';

export default function Implementos() {
  const [implementos, setImplementos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [showModalHistorial, setShowModalHistorial] = useState(false);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [implementoSeleccionado, setImplementoSeleccionado] = useState(null);
  const [error, setError] = useState(null);

  const fetchImplementos = async () => {
    try {
      const data = await getAllImplementos();
      if (data) {
        setImplementos(data);
      } else {
        setError('No se pudieron cargar los implementos.');
      }
    } catch (err) {
      console.error("Error fetching implementos:", err);
      setError('Error al obtener implementos.');
    }
  };

  useEffect(() => {
    fetchImplementos();
  }, []);

  const handleDeleteClick = async (impId) => {
    try {
      await deleteImplementoById(impId);
      fetchImplementos();
      toast.success('Implemento eliminado con éxito');
    } catch (err) {
      console.error("Error deleting implemento:", err);
      setError('Error al eliminar implemento.');
      toast.error('Error al eliminar implemento.');
    }
  };

  const handleClickHistorial = (currentHistorial) => {
    setShowModalHistorial(true);
    setHistorial(currentHistorial);
  };

  const handleEditClick = (implemento) => {
    setImplementoSeleccionado(implemento);
    setShowModalEditar(true);
  };

  return (
    <>
      <div className="mt-4 mx-2">
        <button
          type="button"
          className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex gap-2 items-center"
          onClick={() => setShowModalAgregar(true)}
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
          Agregar implemento
        </button>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg border max-w-screen-xl">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Cantidad</th>
                <th scope="col" className="px-6 py-3">Descripción</th>
                <th scope="col" className="px-6 py-3">Estado</th>
                <th scope="col" className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(implementos) && implementos.length > 0 ? (
                implementos.map((imp) => (
                  <tr key={imp._id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                      {imp.nombre}
                    </th>
                    <td className="px-6 py-4">{imp.cantidad}</td>
                    <td className="px-6 py-4">{imp.descripcion}</td>
                    <td className={`px-6 py-4 ${imp.estado === 'disponible' ? 'text-green-600' : 'text-red-600'}`}>
                      {imp.estado}
                    </td>
                    <td className="px-6 py-4 text-right flex gap-2">
                      <button
                        className="px-3 py-2 text-xs font-medium text-center text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 focus:outline-none rounded-lg"
                        onClick={() => handleClickHistorial(imp.historialModificaciones)}
                      >
                        Historial
                      </button>
                      <button
                        className="px-3 py-2 text-xs font-medium text-center text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300 focus:outline-none rounded-lg"
                        onClick={() => handleEditClick(imp)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-3 py-2 text-xs font-medium text-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none rounded-lg"
                        onClick={() => handleDeleteClick(imp._id)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No hay implementos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModalHistorial && (
        <ModalHistorial setShowModalHistorial={setShowModalHistorial} historial={historial} />
      )}
      {showModalAgregar && (
        <ModalAddImpl setShowModalAgregar={setShowModalAgregar} fetchImplementos={fetchImplementos} />
      )}
      {showModalEditar && (
        <ModalEditImpl
          implemento={implementoSeleccionado}
          setShowModalEditar={setShowModalEditar}
          fetchImplementos={fetchImplementos}
        />
      )}
    </>
  );
}
