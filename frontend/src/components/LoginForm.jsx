import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../services/auth.service";
import { useState } from "react";

function LoginForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error al iniciar sesión");
      });
  };

  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 relative">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              onClick={() => setError("")}
            >
              <title>Close</title>
              <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.586 7.066 4.652A1 1 0 105.652 6.066L8.586 9l-2.934 2.934a1 1 0 101.414 1.414L10 10.414l2.934 2.934a1 1 0 001.414-1.414L11.414 9l2.934-2.934z" />
            </svg>
          </span>
        </div>
      )}
      <form className="space-y-6 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <h5 className="text-xl font-medium text-gray-900">Inicia sesión</h5>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Tu email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@alumnos.ubiobio.cl"
            required
            {...register("email", { required: true })}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Tu contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            {...register("password", { required: true })}
          />
        </div>
        {errors.exampleRequired && <span>This field is required</span>}
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Ingresar a su cuenta
        </button>
        <div className="text-sm font-medium text-gray-500">
          ¿No tienes cuenta?{" "}
          <a href="/signup" className="text-blue-700 hover:underline">
            Regístrate
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
