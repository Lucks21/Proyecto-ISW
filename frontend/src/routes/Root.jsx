import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import { AuthProvider, useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import ModalUserInfo from "../components/ModalUserInfo";
import ModalUserUpdate from "../components/ModalUserUpdate";

import { useState, useEffect } from "react";

import { getUserByEmail } from "../services/user.service";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [isOpenModalUserInfo, setIsOpenModalUserInfo] = useState(false);
  const [isOpenModalUserUpdate, setIsOpenModalUserUpdate] = useState(false);

  const isEncargado = user.roles?.includes("encargado") ? true : false;

  useEffect(() => {
    if (isEncargado) return;

    (async () => {
      const res = await getUserByEmail(user.email);
      setUserInfo(res);
    })();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div>
      <ModalUserInfo
        isOpenModal={isOpenModalUserInfo}
        setIsOpenModal={setIsOpenModalUserInfo}
        user={userInfo}
      />
      <ModalUserUpdate
        isOpenModal={isOpenModalUserUpdate}
        setIsOpenModal={setIsOpenModalUserUpdate}
        user={userInfo}
        setUserInfo={setUserInfo}
      />
      <div>
        {user && (
          <Header
            user={userInfo}
            handleLogout={handleLogout}
            setIsOpenModalUserInfo={setIsOpenModalUserInfo}
            setIsOpenModalUserUpdate={setIsOpenModalUserUpdate}
            isEncargado={isEncargado}
            email={user.email}
          />
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default Root;
