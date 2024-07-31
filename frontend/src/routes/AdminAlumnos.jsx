import { useEffect, useState } from "react";
import { getAllAlumnos, deleteAlumnoById } from "../services/alumno.service";
export default function AdminAlumnos() {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getAllAlumnos();
      setAlumnos(data);
    })();
  }, []);

  const handleDeleteAlumno = async (alumnoId) => {
    const res = await deleteAlumnoById(alumnoId);
    console.log("Click borrar!" + alumnoId);
    console.log(res);
    const { data } = await getAllAlumnos();
    setAlumnos(data);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg border max-w-screen-xl mx-auto mt-4">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              RUT
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr
              className="bg-white border-b  hover:bg-gray-50"
              key={alumno._id}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                {alumno.nombre}
              </th>
              <td className="px-6 py-4">{alumno.email}</td>
              <td className="px-6 py-4">{alumno.rut}</td>
              <td className="px-6 py-4 text-right">
                <button
                  className="px-3 py-2 text-xs font-medium text-center  text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none rounded-lg"
                  onClick={() => handleDeleteAlumno(alumno._id)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
