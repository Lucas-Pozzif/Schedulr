import { useEffect, useState } from "react";
import { User } from "../../Classes/user";
import { Line } from "../../Components/line/line";

import "./user-page.css";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { UserHeader } from "../../Components/header/user-header/user-header";
import { IconButton } from "../../Components/buttons/icon-button/icon-button";

export function UserPage() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(new User());
  const [hasAccount, setHasAccount] = useState(false);

  const navigate = useNavigate();

  const arrow = require("../../Assets/arrow.png");
  const edit = require("../../Assets/edit.png");
  const google = require("../../Assets/google.png");
  const exit = require("../../Assets/exit.png");
  const confirm = require("../../Assets/confirm.png");
  const mail = require("../../Assets/mail.png");
  const userProfile = require("../../Assets/user.png");
  const store = require("../../Assets/store.png");

  useEffect(() => {
    onAuthStateChanged(auth, async (client) => {
      if (!client) return; //There is no user on the firebase authentication
      await user.getUser(client.uid);
      if (user.getId() !== "") {
        setHasAccount(true);
      }
    });
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className='user-page'>
      <UserHeader
        image={user.getPhoto() || userProfile}
        title={user.getName()}
        placeholder={"Digitar novo nome"}
        subtitle={user.getEmail()}
        titleIcon={editing ? confirm : edit}
        editing={editing}
        onClickIcon={async () => {
          if (editing) {
            console.log(user.getName());
            await user.updateUser({ name: user.getName() });
          }
          setEditing(!editing);
        }}
        onChange={(e) => {
          user.setName(e.target.value);
          setUser(new User(user));
        }}
        onClickReturn={() => {
          navigate("/");
        }}
      />
      {!hasAccount ? (
        <>
          <div className='up-login-block'>
            <div
              className='up-login-button'
              onClick={async () => {
                setLoading(true);
                await user.loginWithGoogle();
                if (await user.checkUser()) {
                  console.log("tem conta");
                  await user.getUser(user.getId());
                } else {
                  console.log("nao tem conta");
                  await user.setUser();
                }
                setHasAccount(true);
                setLoading(false);
              }}
            >
              <p className='up-login-title'>Entrar com</p>
              <img className='up-login-icon' src={google} />
            </div>
            <Line />
          </div>
        </>
      ) : null}
      <div className='up-item-list'>
        <IconButton
          title={"Criar Agenda"}
          icon={store}
          onClick={() => {
            navigate(`/group/add`);
          }}
        />
        <IconButton
          title={"Ver Minha Agenda"}
          icon={mail}
          onClick={() => {
            navigate(`/user/schedule/${user.getId()}`);
          }}
        />
        <IconButton
          title={"Sair da Conta"}
          icon={exit}
          onClick={async () => {
            setLoading(true);
            await user.logout();
            setUser(new User());
            setHasAccount(false);
            setLoading(false);
          }}
        />
      </div>
    </div>
  );
}
