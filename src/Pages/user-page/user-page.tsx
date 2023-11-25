import "./user-page.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Services/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { confirm, edit, exit, google, mail, store, userProfile } from "../../_global";
import { User } from "../../Classes/classes-imports";
import { IconButton, Line, LoadingScreen, UserHeader } from "../../Components/component-imports";

export function UserPage() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(new User());
  const [hasAccount, setHasAccount] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (client) => {
      if (!client) return; //There is no user on the firebase authentication
      await user.getUser(client.uid);
      if (user.getId() !== "") {
        setHasAccount(true);
      }
    });
  }, []);

  const logIn = async () => {
    setLoading(true);
    await user.loginWithGoogle();
    if (await user.checkUser()) {
      await user.getUser(user.getId());
    } else {
      await user.setUser();
    }
    setHasAccount(true);
    setLoading(false);
  };
  const logOut = async () => {
    setLoading(true);
    await user.logout();
    setUser(new User());
    setHasAccount(false);
    setLoading(false);
  };

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
            await user.updateUser({ name: user.getName() });
          }
          setEditing(!editing);
        }}
        onChange={(e) => {
          user.setName(e.target.value);
          setUser(new User(user));
        }}
        onClickReturn={() => navigate("/")}
      />
      {!hasAccount ? (
        <>
          <div className='up-login-block'>
            <div className='up-login-button' onClick={async () => await logIn()}>
              <p className='up-login-title'>Entrar com</p>
              <img className='up-login-icon' src={google} />
            </div>
            <Line />
          </div>
        </>
      ) : null}
      <div className='up-item-list'>
        <IconButton title={"Criar Agenda"} hidden={!hasAccount} icon={store} onClick={() => navigate(`/group/add`)} />
        <IconButton title={"Ver Minha Agenda"} hidden={!hasAccount} icon={mail} onClick={() => navigate(`/user/schedule/${user.getId()}`)} />
        <IconButton title={"Sair da Conta"} icon={exit} hidden={!hasAccount} onClick={async () => await logOut()} />
      </div>
    </div>
  );
}
