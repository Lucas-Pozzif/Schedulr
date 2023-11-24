import "./professional-form.css";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

import { LoadingScreen, Line, Header, LinkButton, BottomPopup, BottomButton, SubHeader, ItemButton, Carousel, IconInput, HeaderInput, SmallButton } from "../../Components/component-imports";
import { Group, Professional, Service, User } from "../../Classes/classes-imports";
import { bin, block, fullDays, mail, more, timeArray } from "../../_global";
import { formatArray, stateSwitcher } from "../../Function/functions-imports";

import { ServiceForm } from "../service-form/service-form";
import { ErrorPage } from "../../Pages/error-page/error-page";

type professionalFormType = {
  user?: User;
  groupForm: Group;
  setGroupForm: Dispatch<SetStateAction<Group>>;
  professional?: Professional;
  onClickReturn: () => void;
};

export function ProfessionalForm({ user, groupForm, setGroupForm, professional = new Professional(), onClickReturn }: professionalFormType) {
  const [loading, setLoading] = useState(false);
  const [professionalForm, setProfessionalForm] = useState(professional);
  const [tab, setTab] = useState(0);

  const [selectedOcupation, setSelectedOcupation] = useState<null | number>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [warning, setWarning] = useState<null | string>(null);

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
    } else {
      const index = admins.indexOf(profUser.getId());
      if (index !== -1) {
        admins.splice(index, 1);
      }
    }
    professionalForm.updateProfessionalState(setProfessionalForm, "isAdmin", !professionalForm.getIsAdmin());
    groupForm.setAdmins(admins);
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
              onClickIcon={() => alert("ainda não implementado")}
            />
            <div className='sf-data-block'>
              <IconInput placeholder='Digitar email' value={professionalForm.getEmail()} onChange={(e) => professionalForm.updateProfessionalState(setProfessionalForm, "email", e.target.value)} icon={mail} />
              <Line />
              <div className='sf-bottom-columns'>
                <div className='sf-left-column'>
                  <SmallButton title={"Admin"} selected={professionalForm.getIsAdmin()} onClick={async () => updateAdmins()} />
                  <p className={`pf-warning-message ${warning ? "" : "hidden"}`}>{warning}</p>
                </div>
                <div className='sf-right-column'>
                  <LinkButton title={"Alterar Serviços"} onClick={() => setTab(1)} />
                  <LinkButton title={"Alterar Horários"} onClick={() => setTab(2)} />
                  <LinkButton title={"Alterar Ocupações"} onClick={() => setTab(3)} />
                </div>
              </div>
            </div>
            <BottomPopup title={"Editando..."} subtitle={`Os campos ### não foram preenchidos!`} buttonTitle={"Salvar"} onClick={async () => await saveProfessional()} activated={professionalForm.isValid()} />
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
              {professionalForm
                .getOccupations()
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .map((occupation, index) => (
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
