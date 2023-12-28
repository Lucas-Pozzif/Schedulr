import "./user-page.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";

import { SmallHeader, IconList, UserPageLoading, Profile, BottomButton, Line } from "../../Components/component-imports";
import { addCalendar, calendar, confirm, defaultUser, edit, google, logOutIcon } from "../../_global";
import { ErrorPage } from "../error-page/error-page";
import { Account } from "../../Classes/account/account";

type userButtonType = {
  icon: string;
  title: string;
  hide?: boolean;
  onClick: () => void;
};

export function UserPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(new Account());
  const [tab, setTab] = useState(0);

  const [editing, setEditing] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client) => {
      if (client?.uid) {
        await user.getAccount(client.uid);
        if (!user.get("number")) setTab(1);
        setHasAccount(true);
      }
      setLoading(false);
    });
  }, []);

  const logIn = async () => {
    setLoading(true);

    await user.googleSignIn();
    setUser(new Account(user));

    setHasAccount(true);
    setLoading(false);
  };

  const logOut = async () => {
    setLoading(true);

    await user.logout();
    setUser(new Account());

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
      onClick: () => navigate(`/user/schedule/${user.get("id")}`),
    },
    {
      title: editing ? "Salvar" : "Editar",
      icon: editing ? confirm : edit,
      hide: !hasAccount,
      onClick: async () => {
        if (editing) {
          setLoading(true);
          const formattedNumber = user.get("number").startsWith("55") || user.get("number") == "" ? user.get("number") : "55" + user.get("number");

          await user.updateDatabase("name");
          await user.updateValue("number", formattedNumber, true);

          setLoading(false);
        }
        setEditing(!editing);
      },
    },
  ];

  const listAnonButtons: userButtonType[] = [
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
            <SmallHeader title={hasAccount ? user.get("name") : "Página do Usuário"} onClickReturn={() => navigate("/")} />
            <Profile
              image={user.get("profile") || defaultUser}
              name={user.get("name")}
              number={user.get("number")}
              mail={user.get("email")}
              iconButtons={profileButtons}
              editMode={editing}
              namePlaceholder='Digite seu Nome'
              numberPlaceholder='Digite seu número'
              onChangeName={(e) => user.updateValue("name", e.target.value, false, setUser)}
              onChangeNumber={(e) => user.updateValue("number", e.target.value, false, setUser)}
            />
            <IconList items={hasAccount ? listButtons : listAnonButtons} />
          </div>
        );
      case 1:
        return (
          <div className='tab'>
            <SmallHeader title={hasAccount ? user.get("name") : "Página do Usuário"} onClickReturn={() => navigate("/")} />
            <input className='up-input' type='tel' maxLength={20} onChange={(e) => user.updateValue("number", e.target.value, false, setUser)} value={user.get("number")} placeholder='Digite seu telefone' />
            <Line />
            <p className='up-input-bottom-text'>Digite o número corretamente, usaremos isso para entrar em contato!</p>
            <BottomButton
              title={"Salvar Perfil"}
              onClick={async () => {
                setLoading(true);
                const formattedNumber = user.get("number").startsWith("55") ? user.get("number") : "55" + user.get("number");
                await user.updateValue("number", formattedNumber, true, setUser);
                setTab(0);
                setLoading(false);
              }}
              hide={!user.checkNumber()}
            />
          </div>
        );
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <UserPageLoading /> : tabHandler();
}
