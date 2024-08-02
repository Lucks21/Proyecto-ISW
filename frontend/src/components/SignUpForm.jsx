import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signup } from "../services/auth.service"; //MUST HAVE SIGNUP
import { Button } from "flowbite-react";

function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    signup(data).then((res) => {
      alert(res.message);
      if (!res.error) {
        navigate("/");
      }
    });
  };

  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h5 className="text-xl font-medium text-gray-900">Registra tu información</h5>
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
            Tu nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Juanito Perez"
            required
            {...register("nombre", { required: true })}
          />
        </div>
        <div>
          <label htmlFor="rut" className="block mb-2 text-sm font-medium text-gray-900">
            Tu RUT
          </label>
          <input
            type="text"
            name="rut"
            id="rut"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="12345678-9"
            required
            {...register("rut", { required: true })}
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
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
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            Tu contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="••••••••"
            required
            {...register("password", { required: true })}
          />
        </div>
        {errors.exampleRequired && <span>This field is required</span>}
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Registrarme
        </button>
        <div className="text-sm font-medium text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/auth" className="text-blue-700 hover:underline">
            Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
