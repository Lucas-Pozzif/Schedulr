import React from "react";
import { GroupFormHeader } from "../../../../Components/headers/group-form-header/group-form-header";
import { SimpleHeader } from "../../../../Components/headers/simple-header/simple-header";
import { IconButtonList } from "../../../../Components/lists/icon-button-list/icon-button-list";
import { Group } from "../../group-class";
import { icon } from "../../../../_global";

type GroupFormType = {
  group: Group;
  setter: React.Dispatch<React.SetStateAction<Group>>;
  setTab: React.Dispatch<React.SetStateAction<number>>;
};

export function GroupFormMenu({ group, setter, setTab }: GroupFormType) {
  const iconButtonList = [
    { title: "Alterar Nome ou Tipo", icon: icon.edit, onClick: () => setTab(1) },
    { title: "Editar Imagens", icon: icon.addImage, onClick: () => setTab(2) },
    { title: "Editar Serviços", icon: icon.calendar, onClick: () => setTab(3) },
    { title: "Editar Profissionais", icon: icon.user, onClick: () => setTab(4) },
    { title: "Editar Horários", icon: icon.clock, onClick: () => setTab(5) },
  ];

  return (
    <div className='tab'>
      <SimpleHeader onClickReturn={() => {}} title='Configurações' />
      <GroupFormHeader
        title={group.get("name")}
        subtitle={group.get("type")._name}
        id={group.get("id")}
        image={group.get("images").profile}
        smallButtonList={[
          { title: "Agenda", icon: icon.calendar, onClick: () => {} },
          { title: "Config", icon: icon.edit, onClick: () => {} },
        ]}
      />
      <IconButtonList iconButton={iconButtonList} />
    </div>
  );
}
