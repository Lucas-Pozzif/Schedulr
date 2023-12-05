import "./user-page.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";

import { SmallHeader, IconList, UserPageLoading, Profile } from "../../Components/component-imports";
import { addCalendar, calendar, confirm, defaultUser, edit, google, logOutIcon } from "../../_global";
import { User } from "../../Classes/classes-imports";

type userButtonType = {
  icon: string;
  title: string;
  hide?: boolean;
  onClick: () => void;
};

export function UserPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(new User());

  const [editing, setEditing] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client) => {
      if (client?.uid) {
        await user.getUser(client.uid);
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

          await user.updateUser({ name: user.getName() });
          await user.updateUser({ number: user.getNumber() });
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
    {
      title: "Entrar com Telefone",
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

  return loading ? (
    <UserPageLoading />
  ) : (
    <div className='tab'>
      <SmallHeader title={hasAccount ? user.getName() : "Página do Usuário"} onClickReturn={() => navigate(-1)} />
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
}
