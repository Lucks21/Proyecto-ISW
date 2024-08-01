import React, { useState, useEffect } from 'react';
import { getAllImplementos, deleteImplementoById } from '../services/implementos.services';
import ModalAddImpl from "../components/ModalAddImpl";
import ModalEditImpl from "../components/ModalEditImpl";
import { toast } from 'react-toastify';

const Implementos = () => {
  const [implementos, setImplementos] = useState([]);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [implementoSeleccionado, setImplementoSeleccionado] = useState(null);

  const fetchImplementos = async () => {
    const data = await getAllImplementos();
    setImplementos(data);
  };

  useEffect(() => {
    fetchImplementos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este implemento?')) {
      try {
        await deleteImplementoById(id);
        toast.success('Implemento eliminado con éxito');
        fetchImplementos();
      } catch (error) {
        toast.error('Error al eliminar implemento');
      }
    }
  };

  const handleEdit = (implemento) => {
    setImplementoSeleccionado(implemento);
    setShowModalEditar(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lista de Implementos</h2>
      <button
        className="mb-4 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        onClick={() => setShowModalAgregar(true)}
      >
        Agregar Implemento
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Descripción</th>
            <th className="py-2">Cantidad</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {implementos.map((implemento) => (
            <tr key={implemento._id}>
              <td className="py-2">{implemento.nombre}</td>
              <td className="py-2">{implemento.descripcion}</td>
              <td className="py-2">{implemento.cantidad}</td>
              <td className="py-2">{implemento.estado}</td>
              <td className="py-2">
                <button
                  className="text-white bg-yellow-500 hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
                  onClick={() => handleEdit(implemento)}
                >
                  Editar
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                  onClick={() => handleDelete(implemento._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModalAgregar && (
        <ModalAddImpl
          setShowModalAgregar={setShowModalAgregar}
          setImplementos={setImplementos}
        />
      )}
      {showModalEditar && implementoSeleccionado && (
        <ModalEditImpl
          implemento={implementoSeleccionado}
          setShowModalEditar={setShowModalEditar}
          setImplementos={setImplementos}
        />
      )}
    </div>
  );
};

export default Implementos;
