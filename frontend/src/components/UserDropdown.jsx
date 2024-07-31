import React from "react";
import { Dropdown, Modal, Button } from "flowbite-react";
import { useState } from "react";

const UserDropdown = ({
  email,
  handleLogout,
  setIsOpenModalUserInfo,
  setIsOpenModalUserUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  /*const handleClic = () => {
    setOpenModal((prev) => !prev);
  };*/
  const [name] = email.split("@");

  return (
    <div className="relative">
      <button
        className="flex items-center text-sm p-2 font-medium text-gray-100/80 rounded-full hover:text-white md:me-0 focus:ring-2 focus:ring-purple-500/50 gap-2"
        type="button"
        onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
      >
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
        {name}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdownAvatarName"
        className={`z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute  top-11 ${
          isExpanded ? "" : "hidden"
        }`}
      >
        <div className="px-4 py-3 text-sm text-gray-900">
          <div className="truncate">{email}</div>
        </div>
        <ul className="py-2 text-sm text-gray-700">
          <li>
            <button
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setIsOpenModalUserInfo((prevIsOpenModal) => !prevIsOpenModal);
                setIsExpanded((prevIsExpanded) => !prevIsExpanded);
              }}
            >
              Ver perfil
            </button>
          </li>
          <li>
            <button
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setIsOpenModalUserUpdate((prevIsOpenModal) => !prevIsOpenModal);
                setIsExpanded((prevIsExpanded) => !prevIsExpanded);
              }}
            >
              Actualizar perfil
            </button>
          </li>
        </ul>
        <div className="py-2">
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
