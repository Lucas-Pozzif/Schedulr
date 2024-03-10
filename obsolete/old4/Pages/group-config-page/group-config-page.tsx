import { useNavigate } from "react-router-dom";
import { Group, Professional, User } from "../../Classes/classes-imports";
import { BottomButton, IconList, ItemList, SmallHeader } from "../../Components/component-imports";
import { Profile } from "../../Components/profile/profile";
import {  useState } from "react";
import { bin, calendar, editSquare } from "../../_global";
import { idSwitcher } from "../../Function/functions-imports";
import { ErrorPage } from "../error-page/error-page";

type GroupConfigPageType = {
  user: User;
  group: Group;
};

export function GroupConfigPage({ user, group }: GroupConfigPageType) {
  const [tab, setTab] = useState(0);

  const [selectedProfessional, setSelectedProfessional] = useState<null | Professional>(null); // Selected Professional

  const navigate = useNavigate();

  const listButtons = [
    {
      title: "Ver Agendas",
      icon: calendar,
      onClick: () => setTab(1),
    },
    {
      title: "Excluir Estabelecimento",
      icon: bin,
      onClick: async () => {},
    },
  ];

  const tabHandler = () => {
    switch (tab) {
      case -1: // Invalid User tab
        return (
          <div className='tab'>
            <p onClick={() => navigate("/")}>Go home</p>
          </div>
        );
      case 0: // Group config tab
        return (
          <div className='tab'>
            <SmallHeader title={group.getTitle()} onClickReturn={() => navigate(-1)} />
            <Profile
              image={group.getProfile()}
              name={group.getTitle()}
              number={group.getType()}
              mail={`Dono: ${group.getOwner()}`}
              iconButtons={[
                {
                  title: "Editar",
                  icon: editSquare,
                  onClick: () => navigate(`/group/edit/${group.getId()}`),
                },
              ]}
            />
            <IconList items={listButtons} />
          </div>
        );
      case 1: // Professional list tab
        return (
          <div className='tab'>
            <SmallHeader title={group.getTitle()} onClickReturn={() => setTab(0)} />
            <ItemList
              items={group
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName())) // Alphabetical order
                .map((professional: Professional) => {
                  return {
                    title: professional.getName(),
                    subtitle: professional.getOccupations().join(", "),
                    select: selectedProfessional?.getId() === professional.getId(),
                    onClick: () => idSwitcher(selectedProfessional, professional, setSelectedProfessional),
                  };
                })}
            />
            <BottomButton title={`Ver ${selectedProfessional?.getName()}`} hide={selectedProfessional === null} onClick={() => navigate(`/professional/schedule/${selectedProfessional?.getId()}`)} />
          </div>
        );
      default:
        return <ErrorPage />;
    }
  };
  return tabHandler();
}
