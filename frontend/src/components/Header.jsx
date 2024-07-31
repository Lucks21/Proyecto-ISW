import { useLocation } from "react-router-dom";
import UserDropdown from "./UserDropDown";

export default function header({
  user,
  handleLogout,
  setIsOpenModalUserInfo,
  setIsOpenModalUserUpdate,
  isEncargado,
  email,
}) {
  const { pathname } = useLocation();
  const headerAlumnoLinks = (
    <ul className="font-medium flex p-0  space-x-8 rtl:space-x-reverse">
      <li>
        <a
          href="/"
          className={`block ${
            pathname === "/"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
          aria-current="page"
        >
          Inicio
        </a>
      </li>
      <li>
        <a
          href="/reservar"
          className={`block ${
            pathname === "/reservar"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
          aria-current="page"
        >
          Reservar
        </a>
      </li>
      <li>
        <a
          href="/historial-reserva"
          className={`block ${
            pathname === "/historial-reserva"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
        >
          Historial Reserva
        </a>
      </li>
      <li>
        <a
          href="/modificar-reserva"
          className={`block ${
            pathname === "/modificar-reserva"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
        >
          Modificar Reserva
        </a>
      </li>
      <li>
        <a
          href="/grafico-reserva"
          className={`block ${
            pathname === "/grafico-reserva"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
        >
          Grafico
        </a>
      </li>
    </ul>
  );

  const headerEncargadoLisnks = (
    <ul className="font-medium flex p-0  space-x-8 rtl:space-x-reverse">
      <li>
        <a
          href="/"
          className={`block ${
            pathname === "/"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
          aria-current="page"
        >
          Inicio
        </a>
      </li>
      <li>
        <a
          href="/alumnos"
          className={`block ${
            pathname === "/alumnos"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
          aria-current="page"
        >
          Alumnos
        </a>
      </li>
      <li>
        <a
          href="/configuracion"
          className={`block ${
            pathname === "/configuracion"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
        >
          Configuracion
        </a>
      </li>
      <li>
        <a
          href="/implementos"
          className={`block ${
            pathname === "/implementos"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
        >
          Implementos
        </a>
      </li>
      <li>
        <a
          href="/instalaciones"
          className={`block ${
            pathname === "/instalaciones"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
        >
          Instalaciones
        </a>
      </li>
      <li>
        <a
          href="/reservas"
          className={`block ${
            pathname === "/reservas"
              ? "text-isw-blue"
              : "text-white hover:text-isw-blue"
          }`}
        >
          Reservas
        </a>
      </li>
    </ul>
  );
  return (
    <nav className="bg-isw-purple">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div id="navbar-default">
          {isEncargado ? headerEncargadoLisnks : headerAlumnoLinks}
        </div>
        <div>
          {isEncargado ? (
            <div className="flex gap-4 items-center justify-center text-sm p-2 font-medium text-gray-100">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              {email}
              <button onClick={handleLogout}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-7 rotate-180 text-gray-100/80 hover:text-gray-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <UserDropdown
              handleLogout={handleLogout}
              email={email}
              setIsOpenModalUserInfo={setIsOpenModalUserInfo}
              setIsOpenModalUserUpdate={setIsOpenModalUserUpdate}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
