import "./professional-form.css";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

import { Group, Professional, Service, User } from "../../Classes/classes-imports";
import { add, bin, calendar, clock, closeIcon, fullDays, key, occupation, timeArray } from "../../_global";
import { formatArray, formatDuration, stateSwitcher } from "../../Function/functions-imports";

import { ServiceForm } from "../service-form/service-form";
import { ErrorPage } from "../../Pages/error-page/error-page";
import { BottomPopup, Carousel, GenericHeader, HeaderInput, IconCarousel, ItemList, Line, LinkList, Popup, ProfessionalFormLoading, SubHeader } from "../../Components/component-imports";

type professionalFormType = {
  user?: User;
  groupForm: Group;
  setGroupForm: Dispatch<SetStateAction<Group>>;
  professional?: Professional;
  onClickReturn: () => void;
};

export function ProfessionalForm({ user, groupForm, setGroupForm, professional = new Professional(), onClickReturn }: professionalFormType) {
  const [loading, setLoading] = useState(false);
  const [professionalForm, setProfessionalForm] = useState<Professional>(professional);
  const [tab, setTab] = useState(0);

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedOcupation, setSelectedOcupation] = useState<null | number>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [popupData, setPopup] = useState({
    title: "",
    text: "",
    display: false,
    onClickExit: () => {},
    buttons: [
      {
        title: "",
        onClick: () => {},
      },
    ],
  });

  const updateAdmins = async () => {
    const profUser = await professionalForm.searchForUser();

    if (profUser.getId() == "") {
      professionalForm.updateProfessionalState(setProfessionalForm, "isAdmin", false);
      setMessage("email não encontrado");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      return;
    }
    const admins = groupForm.getAdmins();

    if (!professionalForm.getIsAdmin()) {
      admins.push(profUser.getId());
      setMessage(`${profUser.getName()} é um administrador`);
    } else {
      const index = admins.indexOf(profUser.getId());
      if (index !== -1) {
        admins.splice(index, 1);
      }
      setMessage(`${profUser.getName()} não é mais um administrador`);
    }
    professionalForm.updateProfessionalState(setProfessionalForm, "isAdmin", !professionalForm.getIsAdmin());
    groupForm.setAdmins(admins);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const saveProfessional = async () => {
    setLoading(true);
    if (professionalForm.getId()) {
      await professionalForm.setProfessional();
      const idIndex = groupForm.getProfessionalsIds().indexOf(professionalForm.getId());
      const professional = groupForm.getProfessionals();
      professional[idIndex] = professionalForm;
    } else {
      await professionalForm.addProfessional();
      groupForm.setProfessionalsIds([...groupForm.getProfessionalsIds(), professionalForm.getId()]);
      groupForm.setProfessionals([...groupForm.getProfessionals(), professionalForm]);
    }
    setGroupForm(new Group(groupForm));
    setLoading(false);
    onClickReturn();
  };

  const handleDeleteOccupation = () => {
    professionalForm.updateProfessionalState(
      setProfessionalForm,
      "occupations",
      professionalForm.getOccupations().filter((_, index) => index !== selectedOcupation)
    );
    setSelectedOcupation(null);
  };

  const handleOccupationInput = (occupations: string[], input: string) => {
    if (selectedOcupation === null) {
      setSelectedOcupation(occupations.length);
      occupations.push(input);
    } else occupations[selectedOcupation] = input;
    professionalForm.updateProfessionalState(setProfessionalForm, "occupations", occupations);
  };

  const handleDelete = async () => {
    setLoading(true);
    if (professionalForm.getId() !== "") {
      await professionalForm.deleteProfessional();
      const updatedIds = groupForm.getProfessionalsIds().filter((id) => id !== professionalForm.getId());
      const updatedProfessionals = groupForm.getProfessionals().filter((prof) => prof.getId() !== professionalForm.getId());
      groupForm.setProfessionalsIds(updatedIds);
      groupForm.setProfessionals(updatedProfessionals);
      await groupForm.setGroup();
    }
    onClickReturn();
    setLoading(false);
  };

  const buttonList = [
    {
      title: "Alterar Serviços",
      subtitle: `${professionalForm.getServices().length} Serviços selecionados`,
      onClick: () => setTab(2),
    },
    {
      title: "Alterar Profissionais",
      subtitle: `${professionalForm.getOccupations().length} Ocupações criadas`,
      onClick: () => setTab(3),
    },
  ];
  const professionalButtons = [
    {
      title: "Horários",
      icon: calendar,
      onClick: () => setTab(1),
    },
    {
      title: "Admin",
      select: professionalForm.getIsAdmin(),
      icon: key,
      onClick: () => updateAdmins(),
    },
  ];

  const tabCarousel = [
    {
      title: "Horário",
      select: tab === 1,
      icon: clock,
      onClick: () => setTab(1),
    },
    {
      title: "Serviço",
      select: tab === 2,
      icon: calendar,
      onClick: () => setTab(2),
    },
    {
      title: "Ocupações",
      select: tab === 3,
      icon: occupation,
      onClick: () => setTab(3),
    },
  ];

  const tabHandler = () => {
    switch (tab) {
      case 0: // Professional tab
        return (
          <div className='tab'>
            <HeaderInput
              placeholder={"Nome do Profissional"}
              value={professionalForm.getName()}
              subtitle={formatArray(professionalForm.getOccupations())}
              icon={bin}
              onChange={(e) => professionalForm.updateProfessionalState(setProfessionalForm, "name", e.target.value)}
              onClickReturn={() =>
                setPopup({
                  title: "Você tem Certeza?",
                  text: "Existem alterações não salvas",
                  display: true,
                  onClickExit: () => setPopup({ ...popupData, display: false }),
                  buttons: [
                    {
                      title: "Cancelar",
                      onClick: () => setPopup({ ...popupData, display: false }),
                    },
                    {
                      title: "Confirmar",
                      onClick: onClickReturn,
                    },
                  ],
                })
              }
              onClickIcon={() => {
                setPopup((prevPopupData) => ({
                  title: "Você realmente deseja excluir?",
                  text: "Essa ação não pode ser desfeita",
                  display: true,
                  onClickExit: () => setPopup({ ...prevPopupData, display: false }),
                  buttons: [
                    {
                      title: "Cancelar",
                      onClick: () => setPopup({ ...prevPopupData, display: false }),
                    },
                    {
                      title: "Confirmar",
                      onClick: async () => await handleDelete(),
                    },
                  ],
                }));
              }}
            />
            <input className='pf-input' value={professionalForm.getEmail()} placeholder='Digitar Email' onChange={(e) => professionalForm.updateProfessionalState(setProfessionalForm, "email", e.target.value)} />
            <Line />
            <IconCarousel items={professionalButtons} />
            <p className={`pf-message ${message ? "" : "hidden"}`}>{message}</p>
            <LinkList items={buttonList} />

            <BottomPopup stage={professionalForm.isValid() ? 1 : 0} title={"Editando..."} subtitle={"Possui alterações"} buttonTitle={"Salvar alterações"} onClick={async () => await saveProfessional()} />
            <Popup title={popupData.title} text={popupData.text} display={popupData.display} onClickExit={popupData.onClickExit} buttons={popupData.buttons} />
          </div>
        );
      case 1: // Time tab
        return (
          <div className='tab'>
            <GenericHeader title={"Editar Horários"} icon={closeIcon} onClickReturn={() => setTab(0)} onClickIcon={() => professionalForm.cleanDay(selectedDay, setProfessionalForm)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={"Aberto x dias na semana"} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <Carousel
              items={fullDays.map((day, index) => ({
                title: day,
                subtitle: "Fechado",
                select: selectedDay === index,
                onClick: () => setSelectedDay(index),
              }))}
            />
            <ItemList
              items={timeArray
                .filter((_, index) => index >= 12)
                .map((timeValue, index) => {
                  const selected = professionalForm.getShift()[selectedDay]?.[index + 12 - professionalForm.getStartHours()[selectedDay]];
                  return {
                    title: timeValue,
                    select: selected,
                    onClick: () => professionalForm.updateHourList(selectedDay, index + 12, setProfessionalForm),
                  };
                })}
            />
            <BottomPopup stage={1} title={fullDays[selectedDay]} subtitle={"Fechado"} buttonTitle={"Preencher Horários"} onClick={() => professionalForm.fillHours(selectedDay, setProfessionalForm)} />
          </div>
        );
      case 2: // Service tab
        return (
          <div className='tab'>
            <GenericHeader title={"Editar Serviços"} icon={add} onClickReturn={() => setTab(1)} onClickIcon={() => setTab(4)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={`${groupForm.getServicesIds().length} Serviços criados`} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <ItemList
              items={groupForm
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service: Service) => {
                  return {
                    title: service.getName(),
                    subtitle: formatDuration(service.getDuration()),
                    select: professionalForm.getServices().includes(service.getId()),
                    onClick: () => professionalForm.handleService(service, setProfessionalForm),
                  };
                })}
            />
          </div>
        );
      case 3: // Occupation Tab
        return (
          <div className='tab'>
            <HeaderInput
              placeholder='Digite a Ocupação'
              value={selectedOcupation !== null ? professionalForm.getOccupations()[selectedOcupation] : ""}
              subtitle='Ocupações do profissional'
              icon={bin}
              maxLength={30}
              onChange={(e) => handleOccupationInput(professionalForm.getOccupations(), e.target.value)}
              onClickReturn={() => setTab(0)}
              onClickIcon={() => handleDeleteOccupation()}
            />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={`${professionalForm.getOccupations().length} Ocupações criadas`} buttonTitle={"Salvar"} onClick={() => setTab(2)} />
            <ItemList
              items={professionalForm.getOccupations().map((occupation: string, index: number) => {
                return {
                  title: occupation,
                  select: index == selectedOcupation,
                  onClick: () => stateSwitcher(selectedOcupation, index, setSelectedOcupation),
                };
              })}
            />
            <BottomPopup stage={selectedOcupation === null ? 0 : 1} title='' buttonTitle='Adicionar Ocupação' onClick={() => setSelectedOcupation(null)} />
          </div>
        );
      case 4: // Service form
        return <ServiceForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} onClickReturn={() => setTab(2)} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <ProfessionalFormLoading /> : tabHandler();
}

/*
export function ProfessionalFormd({ user, groupForm, setGroupForm, professional = new Professional(), onClickReturn }: professionalFormType) {
  const [loading, setLoading] = useState(false);
  const [professionalForm, setProfessionalForm] = useState<Professional>(professional);
  const [tab, setTab] = useState(0);

  const [selectedOcupation, setSelectedOcupation] = useState<null | number>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  const [warning, setWarning] = useState<null | string>(null);
  const [message, setMessage] = useState<null | string>(null);
  const [hiddenAlert, setHiddenAlert] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (professional.getId() === "") {
      professional.setStartHours(groupForm.getStartHours());
      professional.setShift(groupForm.getHours());
    }
    setLoading(false);
  }, []);

  const updateAdmins = async () => {
    const profUser = await professionalForm.searchForUser();

    if (profUser.getId() == "") {
      professionalForm.updateProfessionalState(setProfessionalForm, "isAdmin", false);
      setWarning("email não encontrado");
      setTimeout(() => {
        setWarning(null);
      }, 3000);
      return;
    }
    const admins = groupForm.getAdmins();

    if (!professionalForm.getIsAdmin()) {
      admins.push(profUser.getId());
      setMessage(`${profUser.getName()} é um administrador`);
    } else {
      const index = admins.indexOf(profUser.getId());
      if (index !== -1) {
        admins.splice(index, 1);
      }
      setMessage(`${profUser.getName()} não é mais um administrador`);
    }
    professionalForm.updateProfessionalState(setProfessionalForm, "isAdmin", !professionalForm.getIsAdmin());
    groupForm.setAdmins(admins);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const saveProfessional = async () => {
    setLoading(true);
    if (professionalForm.getId()) {
      await professionalForm.setProfessional();
      const idIndex = groupForm.getProfessionalsIds().indexOf(professionalForm.getId());
      const professional = groupForm.getProfessionals();
      professional[idIndex] = professionalForm;
    } else {
      await professionalForm.addProfessional();
      groupForm.setProfessionalsIds([...groupForm.getProfessionalsIds(), professionalForm.getId()]);
      groupForm.setProfessionals([...groupForm.getProfessionals(), professionalForm]);
    }
    setGroupForm(new Group(groupForm));
    setLoading(false);
    onClickReturn();
  };

  const handleDeleteOccupation = () => {
    professionalForm.updateProfessionalState(
      setProfessionalForm,
      "occupations",
      professionalForm.getOccupations().filter((_, index) => index !== selectedOcupation)
    );
    setSelectedOcupation(null);
  };

  const handleOccupationInput = (occupations: string[], input: string) => {
    if (selectedOcupation === null) {
      setSelectedOcupation(occupations.length);
      occupations.push(input);
    } else occupations[selectedOcupation] = input;
    professionalForm.updateProfessionalState(setProfessionalForm, "occupations", occupations);
  };

  const handleDelete = async () => {
    setLoading(true);
    if (professionalForm.getId() !== "") {
      await professionalForm.deleteProfessional();
      const updatedIds = groupForm.getProfessionalsIds().filter((id) => id !== professionalForm.getId());
      const updatedProfessionals = groupForm.getProfessionals().filter((prof) => prof.getId() !== professionalForm.getId());
      groupForm.setProfessionalsIds(updatedIds);
      groupForm.setProfessionals(updatedProfessionals);
    }
    onClickReturn();
    setLoading(false);
  };

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home tab
        return (
          <div className='service-form'>
            <HeaderInput
              placeholder='Digite o nome do Profissional'
              value={professionalForm.getName()}
              subtitle={formatArray(professionalForm.getOccupations())}
              icon={bin}
              onChange={(e) => professionalForm.updateProfessionalState(setProfessionalForm, "name", e.target.value)}
              onClickReturn={onClickReturn}
              onClickIcon={() => setHiddenAlert(false)}
            />
            <div className='sf-data-block'>
              <IconInput placeholder='Digitar email' value={professionalForm.getEmail()} onChange={(e) => professionalForm.updateProfessionalState(setProfessionalForm, "email", e.target.value)} icon={mail} />
              <Line />
              <div className='sf-bottom-columns'>
                <div className='sf-left-column'>
                  <SmallButton title={"Admin"} selected={professionalForm.getIsAdmin()} onClick={async () => updateAdmins()} />
                  <p className={`pf-warning ${warning ? "" : "hidden"}`}>{warning}</p>
                  <p className={`pf-message ${message ? "" : "hidden"}`}>{message}</p>
                </div>
                <div className='sf-right-column'>
                  <LinkButton title={"Alterar Serviços"} onClick={() => setTab(1)} />
                  <LinkButton title={"Alterar Horários"} onClick={() => setTab(2)} />
                  <LinkButton title={"Alterar Ocupações"} onClick={() => setTab(3)} />
                </div>
              </div>
            </div>
            <BottomPopup title={"Editando..."} subtitle={`Os campos ### não foram preenchidos!`} buttonTitle={"Salvar"} onClick={async () => await saveProfessional()} activated={professionalForm.isValid()} />
            <AlertBlock
              title={"Você realmente deseja excluir"}
              itemButtons={[
                {
                  title: professionalForm.getName(),
                  subtitle: professionalForm.getOccupations().join(", "),
                  selected: true,
                },
              ]}
              bottomText='Essa ação não pode ser desfeita'
              button1={{
                hidden: false,
                title: "Excluir Profissional",
                onClick: async () => await handleDelete(),
              }}
              hidden={hiddenAlert}
              onClickOut={() => setHiddenAlert(true)}
            />
          </div>
        );
      case 1: // Service Tab
        return (
          <div className='gf-tab'>
            <Header title='Editar Serviços' icon={more} onClickReturn={() => setTab(0)} onClickIcon={() => setTab(4)} />
            <div className='gf-list'>
              {groupForm
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service: Service) => {
                  return <ItemButton title={service.getName()} subtitle={service.getDurationValue()} selected={professionalForm.getServices().includes(service.getId())} onClick={() => professionalForm.handleService(service, setProfessionalForm)} />;
                })}
            </div>
            <BottomButton title={"Confirmar"} onClick={() => setTab(0)} hidden={false} />
          </div>
        );
      case 2: // Time Tab
        return (
          <div className='gf-tab'>
            <Header title='Alterar Horários' icon={block} onClickIcon={() => professionalForm.cleanDay(selectedDay, setProfessionalForm)} onClickReturn={() => setTab(0)} />
            <SubHeader title={fullDays[selectedDay]} buttonTitle='Preencher horários' onClick={() => professionalForm.fillHours(selectedDay, setProfessionalForm)} />
            <Carousel
              items={fullDays.map((day, index) => {
                return {
                  title: day,
                  selected: selectedDay == index,
                  onClick: () => setSelectedDay(index),
                };
              })}
            />
            <div className='gf-list'>
              {timeArray.map((timeValue, index) => {
                const selected = professionalForm.getShift()[selectedDay]?.[index - professionalForm.getStartHours()[selectedDay]];
                return index >= 12 ? <ItemButton title={timeValue} subtitle={""} selected={selected} onClick={() => professionalForm.updateHourList(selectedDay, index, setProfessionalForm)} /> : null;
              })}
            </div>
            <BottomButton hidden={false} title={"Confirmar"} onClick={() => setTab(0)} />
          </div>
        );
      case 3: // Occupation Tab
        return (
          <div className='service-form'>
            <HeaderInput
              placeholder={"Digite a Ocupação"}
              value={selectedOcupation !== null ? professionalForm.getOccupations()[selectedOcupation] : ""}
              icon={bin}
              maxLength={25}
              onChange={(e) => handleOccupationInput(professionalForm.getOccupations(), e.target.value)}
              onClickReturn={() => setTab(0)}
              onClickIcon={() => handleDeleteOccupation()}
            />
            <SubHeader title={selectedOcupation !== null ? professionalForm.getOccupations()[selectedOcupation] : `${professionalForm.getOccupations().length} ocupações`} buttonTitle={"Nova Ocupação"} onClick={() => setSelectedOcupation(null)} />
            <div className='sf-item-list'>
              {professionalForm.getOccupations().map((occupation, index) => (
                <ItemButton title={occupation} subtitle={""} selected={index == selectedOcupation} onClick={() => stateSwitcher(selectedOcupation, index, setSelectedOcupation)} />
              ))}
            </div>
            <BottomButton
              hidden={
                !professionalForm
                  .getOccupations()
                  .map((occupation) => occupation.length > 0)
                  .includes(true)
              }
              title={"Salvar Ocupações"}
              onClick={() => setTab(0)}
            />
          </div>
        );
      case 4: // ServiceForm tab
        return <ServiceForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} onClickReturn={() => setTab(1)} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
*/
