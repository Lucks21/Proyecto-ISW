import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateUserById } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ModalUserUpdate({
  isOpenModal,
  setIsOpenModal,
  user,
  setUserInfo,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ user });

  const navigate = useNavigate();

  useEffect(() => {
    reset(user);
  }, [reset, user]);

  const onSubmit = async (data) => {
    const newDataUser = {
      nombre: data.nombre,
      rut: data.rut,
      email: data.email,
    };

    try {
      const res = await updateUserById(user._id, newDataUser);
      if (res.error) {
        throw new Error(res.message);
      }
      setUserInfo(res);
      toast.success('Usuario actualizado correctamente', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsOpenModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsOpenModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
        isOpenModal ? "" : "hidden"
      }`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <form
          className="relative bg-white rounded-lg shadow border"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-2xl font-bold text-gray-900">
              Editar perfil de usuario
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() =>
                setIsOpenModal((prevIsOpenModal) => !prevIsOpenModal)
              }
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-4 md:p-5 space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...register("nombre", { required: true })}
              />
            </div>
            <div>
              <label
                htmlFor="rut"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                RUT
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...register("rut", { required: true })}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...register("email", { required: true })}
              />
            </div>
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b gap-4">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Actualizar
            </button>
            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={() =>
                setIsOpenModal((prevIsOpenModal) => !prevIsOpenModal)
              }
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
