export default function ModalUser({ isOpenModal, setIsOpenModal, user }) {
  return (
    <div
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
        isOpenModal ? "" : "hidden"
      }`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow border">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-2xl font-bold text-gray-900">
              Perfil de usuario
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
              <label>
                <span className="text-xl font-bold">Nombre: </span>
                <span className="bg-blue-100 text-blue-800  font-medium mx-2 px-2.5 py-0.5 rounded">
                  {user.nombre}
                </span>
              </label>
            </div>
            <div>
              <label>
                <span className="text-xl font-bold">RUT: </span>
                <span className="bg-blue-100 text-blue-800  font-medium mx-2 px-2.5 py-0.5 rounded">
                  {user.rut}
                </span>
              </label>
            </div>
            <div>
              <label>
                <span className="text-xl font-bold">Email: </span>
                <span className="bg-blue-100 text-blue-800  font-medium mx-2 px-2.5 py-0.5 rounded">
                  {user.email}
                </span>
              </label>
            </div>
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={() =>
                setIsOpenModal((prevIsOpenModal) => !prevIsOpenModal)
              }
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
