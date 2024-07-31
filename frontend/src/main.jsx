import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import Login from "./routes/Login.jsx";
import Instalaciones from "./routes/Instalaciones.jsx";
import SignUp from "./routes/SignUp.jsx";
import Reservar from "./routes/Reservar.jsx";
import HistorialReservas from "./routes/HistorialReservas.jsx";
import GraficoReserva from "./routes/GraficoReserva.jsx";
import ModificarReserva from "./routes/ModificarReserva.jsx";
import AlumnoRoute from "./guards/AlumnoRoute.jsx";
import EncargadoRoute from "./guards/EncargadoRoute.jsx";
import AdminAlumnos from "./routes/AdminAlumnos.jsx";
import Implementos from "./routes/Implementos.jsx";
import Reservas from "./routes/Reservas.jsx";
import Configuracion from "./routes/Configuracion.jsx"; // Importar el nuevo componente de configuración

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/reservar",
        element: (
          <AlumnoRoute>
            <Reservar />
          </AlumnoRoute>
        ),
      },
      {
        path: "/historial-reserva",
        element: (
          <AlumnoRoute>
            <HistorialReservas />
          </AlumnoRoute>
        ),
      },
      {
        path: "/grafico-reserva",
        element: (
          <AlumnoRoute>
            <GraficoReserva />
          </AlumnoRoute>
        ),
      },
      {
        path: "/modificar-reserva",
        element: (
          <AlumnoRoute>
            <ModificarReserva />
          </AlumnoRoute>
        ),
      },
      {
        path: "/alumnos",
        element: (
          <EncargadoRoute>
            <AdminAlumnos />
          </EncargadoRoute>
        ),
      },
      {
        path: "/implementos",
        element: (
          <EncargadoRoute>
            <Implementos />
          </EncargadoRoute>
        ),
      },
      {
        path: "/instalaciones",
        element: (
          <EncargadoRoute>
            <Instalaciones />
          </EncargadoRoute>
        ),
      },
      {
        path: "/reservas",
        element: (
          <EncargadoRoute>
            <Reservas />
          </EncargadoRoute>
        ),
      },
      {
        path: "/configuracion", // Añadir la nueva ruta para Configuración
        element: (
          <EncargadoRoute>
            <Configuracion />
          </EncargadoRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  </>
);
