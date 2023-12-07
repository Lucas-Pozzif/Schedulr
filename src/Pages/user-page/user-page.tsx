import "./user-page.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";

import { SmallHeader, IconList, UserPageLoading, Profile, BottomButton, Line } from "../../Components/component-imports";
import { addCalendar, calendar, confirm, defaultUser, edit, google, logOutIcon } from "../../_global";
import { User } from "../../Classes/classes-imports";
import { ErrorPage } from "../error-page/error-page";

type userButtonType = {
  icon: string;
  title: string;
  hide?: boolean;
  onClick: () => void;
};

export function UserPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(new User());
  const [tab, setTab] = useState(0);

  const [editing, setEditing] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client) => {
      if (client?.uid) {
        await user.getUser(client.uid);
        if (!user.getNumber()) setTab(1);
        setHasAccount(true);
      }
      setLoading(false);
    });
  }, []);

  const logIn = async () => {
    setLoading(true);
    await user.loginWithGoogle();
    if (await user.checkUser()) {
      await user.getUser(user.getId());
      if (!user.getNumber()) setTab(1);
    } else {
      await user.setUser();
    }
    setUser(new User(user));
    setHasAccount(true);
    setLoading(false);
  };

  const logOut = async () => {
    setLoading(true);
    await user.logout();
    setUser(new User());
    setHasAccount(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const profileButtons: userButtonType[] = [
    {
      title: "Agenda",
      icon: calendar,
      hide: !hasAccount,
      onClick: () => navigate(`/user/schedule/${user.getId()}`),
    },
    {
      title: editing ? "Salvar" : "Editar",
      icon: editing ? confirm : edit,
      hide: !hasAccount,
      onClick: async () => {
        if (editing) {
          setLoading(true);
          setEditing(false);
          const formattedNumber = user.getNumber().startsWith("55") || user.getNumber() == "" ? user.getNumber() : "55" + user.getNumber();

          await user.updateUser({ name: user.getName() });
          await user.updateUser({ number: formattedNumber });
          setLoading(false);
        } else setEditing(true);
      },
    },
  ];

  const listButtonsUnlogged: userButtonType[] = [
    {
      title: "Entrar com Google",
      icon: google,
      onClick: async () => await logIn(),
    },
  ];

  const listButtons: userButtonType[] = [
    {
      title: "Criar um Estabelecimento",
      icon: addCalendar,
      onClick: () => navigate(`/group/add`),
    },
    {
      title: "Sair da Minha Conta",
      icon: logOutIcon,
      onClick: async () => await logOut(),
    },
  ];

  const tabHandler = () => {
    switch (tab) {
      case 0:
        return (
          <div className='tab'>
            <SmallHeader title={hasAccount ? user.getName() : "Página do Usuário"} onClickReturn={() => navigate("/")} />
            <Profile
              image={user.getPhoto() || defaultUser}
              name={user.getName()}
              number={user.getNumber()}
              mail={user.getEmail()}
              iconButtons={profileButtons}
              editMode={editing}
              namePlaceholder='Digite seu Nome'
              numberPlaceholder='Digite seu número'
              onChangeName={(e) => user.updateState(setUser, "name", e.target.value)}
              onChangeNumber={(e) => user.updateState(setUser, "number", e.target.value)}
            />
            <IconList items={hasAccount ? listButtons : listButtonsUnlogged} />
          </div>
        );
      case 1:
        return (
          <div className='tab'>
            <SmallHeader title={hasAccount ? user.getName() : "Página do Usuário"} onClickReturn={() => navigate("/")} />
            <input className='up-input' type='tel' maxLength={20} onChange={(e) => user.updateState(setUser, "number", e.target.value)} value={user.getNumber()} placeholder='Digite seu telefone' />
            <Line />
            <p className='up-input-bottom-text'>Digite o número corretamente, usaremos isso para entrar em contato!</p>
            <BottomButton
              title={"Salvar Perfil"}
              onClick={async () => {
                setLoading(true);
                const formattedNumber = user.getNumber().startsWith("55") ? user.getNumber() : "55" + user.getNumber();
                await user.updateUser({ number: formattedNumber });
                setTab(0);
                setLoading(false);
              }}
              hide={!user.isNumberValid()}
            />
          </div>
        );
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <UserPageLoading /> : tabHandler();
}
