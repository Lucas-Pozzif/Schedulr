import "./service-form.css";

import { Dispatch, SetStateAction, useState } from "react";

import { Group, Professional, Service, User } from "../../Classes/classes-imports";
import { add, bin, clock, dollar, longTimeArray, money, more, userIcon } from "../../_global";
import { formatDuration } from "../../Function/functions-imports";

import { ProfessionalForm } from "../professional-form/professional-form";
import { ErrorPage } from "../../Pages/error-page/error-page";
import { BottomPopup, GenericHeader, HeaderInput, IconCarousel, ItemList, Line, LinkList, Popup, ServiceFormLoading, SmallIconButton, SubHeader } from "../../Components/component-imports";

type ServiceFormType = {
  user?: User;
  groupForm: Group;
  setGroupForm: Dispatch<SetStateAction<Group>>;
  service?: Service;
  onClickReturn: () => void;
};

export function ServiceForm({ user, groupForm, setGroupForm, service = new Service(), onClickReturn }: ServiceFormType) {
  const [loading, setLoading] = useState(false);
  const [serviceForm, setServiceForm] = useState(service);
  const [tab, setTab] = useState(0);

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

  const saveService = async () => {
    setLoading(true);
    if (serviceForm.getId()) {
      await serviceForm.setService();
      const idIndex = groupForm.getServicesIds().indexOf(serviceForm.getId());
      const services = groupForm.getServices();
      services[idIndex] = serviceForm;
    } else {
      await serviceForm.addService();
      groupForm.setServicesIds([...groupForm.getServicesIds(), serviceForm.getId()]);
      groupForm.setServices([...groupForm.getServices(), serviceForm]);
    }
    setGroupForm(new Group(groupForm));
    setLoading(false);
    onClickReturn();
  };

  const handleProfessionals = (profServices: string[], professional: Professional) => {
    if (profServices.includes(serviceForm.getId())) {
      profServices = profServices.filter((id) => id !== serviceForm.getId());
    } else {
      profServices.push(serviceForm.getId());
    }
    const professionals = groupForm.getProfessionals();
    const foundProfessional = professionals.find((prof) => prof.getId() === professional.getId());

    if (foundProfessional) {
      foundProfessional.setServices(profServices);
      groupForm.updateGroupState(setGroupForm, "professionals", professionals);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (serviceForm.getId() !== "") {
      await serviceForm.deleteService();
      const updatedIds = groupForm.getServicesIds().filter((id) => id !== serviceForm.getId());
      const updatedServices = groupForm.getServices().filter((serv) => serv.getId() !== serviceForm.getId());
      groupForm.setServicesIds(updatedIds);
      groupForm.setServices(updatedServices);
    }
    onClickReturn();
    setLoading(false);
  };

  const buttonList = [
    {
      title: "Alterar Tempo de Duração",
      subtitle: `${formatDuration(serviceForm.getDuration())}`,
      onClick: () => setTab(1),
    },
    {
      title: "Alterar Profissionais",
      subtitle: `${groupForm.getProfessionalsIds().length} Profissionais disponíveis`,
      onClick: () => setTab(2),
    },
  ];

  const tabCarousel = [
    {
      title: "Duração",
      select: tab === 1,
      icon: clock,
      onClick: () => setTab(1),
    },
    {
      title: "Profissional",
      select: tab === 2,
      icon: userIcon,
      onClick: () => setTab(2),
    },
  ];

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home tab
        return (
          <div className='tab'>
            <HeaderInput
              placeholder='Nome do serviço'
              value={serviceForm.getName()}
              icon={bin}
              onChange={(e) => serviceForm.updateServiceState(setServiceForm, "name", e.target.value)}
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
              onClickIcon={() =>
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
                }))
              }
            />
            <div className='sf-input-block'>
              <input className='sf-input' value={serviceForm.getValue()} placeholder='Digitar Valor' onChange={(e) => serviceForm.updateServiceState(setServiceForm, "value", e.target.value)} />
              <SmallIconButton title={"A partir de"} icon={dollar} select={serviceForm.getInicial()} onClick={() => serviceForm.updateServiceState(setServiceForm, "inicial", !serviceForm.getInicial())} />
            </div>
            <Line />
            <LinkList items={buttonList} />
            <BottomPopup stage={serviceForm.isValid() ? 1 : 0} title={"Editando..."} subtitle={"Possui alterações"} buttonTitle={"Salvar alterações"} onClick={async () => await saveService()} />
            <Popup title={popupData.title} text={popupData.text} display={popupData.display} onClickExit={popupData.onClickExit} buttons={popupData.buttons} />
          </div>
        );
      case 1: // Duration tab
        return (
          <div className='tab'>
            <GenericHeader title={"Alterar Horários"} icon={bin} onClickReturn={() => setTab(0)} onClickIcon={() => serviceForm.updateServiceState(setServiceForm, "duration", [])} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={formatDuration(serviceForm.getDuration())} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <ItemList
              items={longTimeArray.map((timeValue, index) => {
                return {
                  title: timeValue,
                  select: serviceForm.getDuration()?.[index],
                  onClick: () => serviceForm.updateHourList(index, setServiceForm),
                };
              })}
            />
            <BottomPopup stage={1} title={formatDuration(serviceForm.getDuration())} buttonTitle={"Preencher Horários"} onClick={() => serviceForm.fillHours(setServiceForm)} />
          </div>
        );
      case 2: // Professional tab
        return (
          <div className='tab'>
            <GenericHeader title={"Alterar Profissionais"} icon={add} onClickReturn={() => setTab(1)} onClickIcon={() => setTab(3)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={`${groupForm.getProfessionalsIds().length} Profissionais disponíveis`} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <ItemList
              items={groupForm
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((professional: Professional) => {
                  var profServices = professional.getServices();
                  return {
                    title: professional.getName(),
                    subtitle: professional.getOccupations().join(", "),
                    selected: profServices.includes(serviceForm.getId()),
                    onClick: () => handleProfessionals(profServices, professional),
                  };
                })}
            />
            <BottomPopup stage={0} />
          </div>
        );
      case 3: // Professional Form
        return <ProfessionalForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} onClickReturn={() => setTab(0)} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <ServiceFormLoading /> : tabHandler();
}
/*
export function ServiceFordm({ user, groupForm, setGroupForm, service = new Service(), onClickReturn }: ServiceFormType) {
  const [loading, setLoading] = useState(false);
  const [serviceForm, setServiceForm] = useState(service);
  const [tab, setTab] = useState(0);

  const [selectedSService, setSelectedSService] = useState<null | SubService>(null);
  const [hiddenAlert, setHiddenAlert] = useState(true);

  var SServDropList: [string, () => void][] = serviceForm.getSubServices().map((SubService) => {
    return [SubService.getName(), () => setSelectedSService(SubService)];
  });

  SServDropList.push(["Editar Subserviços", () => setTab(3)]);

  const saveService = async () => {
    setLoading(true);
    if (serviceForm.getId()) {
      await serviceForm.setService();
      const idIndex = groupForm.getServicesIds().indexOf(serviceForm.getId());
      const services = groupForm.getServices();
      services[idIndex] = serviceForm;
    } else {
      await serviceForm.addService();
      groupForm.setServicesIds([...groupForm.getServicesIds(), serviceForm.getId()]);
      groupForm.setServices([...groupForm.getServices(), serviceForm]);
    }
    setGroupForm(new Group(groupForm));
    setLoading(false);
    onClickReturn();
  };

  const handleProfessionals = (profServices: string[], index: number) => {
    if (profServices.includes(serviceForm.getId())) {
      profServices = profServices.filter((id) => id !== serviceForm.getId());
    } else {
      profServices.push(serviceForm.getId());
    }
    const professionals = groupForm.getProfessionals();
    professionals[index].setServices(profServices);

    groupForm.updateGroupState(setGroupForm, "professionals", professionals);
  };
  const handleDelete = async () => {
    setLoading(true);
    if (serviceForm.getId() !== "") {
      await serviceForm.deleteService();
      const updatedIds = groupForm.getServicesIds().filter((id) => id !== serviceForm.getId());
      const updatedServices = groupForm.getServices().filter((serv) => serv.getId() !== serviceForm.getId());
      groupForm.setServicesIds(updatedIds);
      groupForm.setServices(updatedServices);
    }
    onClickReturn();
    setLoading(false);
  };

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home Tab
        return (
          <div className='service-form'>
            <HeaderInput
              placeholder={"Digite o nome do Serviço"}
              value={serviceForm.getName()}
              icon={bin}
              onChange={(e) => serviceForm.updateServiceState(setServiceForm, "name", e.target.value)}
              onClickReturn={onClickReturn}
              onClickIcon={() => setHiddenAlert(false)}
            />
            <div className='sf-data-block'>
              <IconInput placeholder={"Digite o valor"} value={serviceForm.getValue()} onChange={(e) => serviceForm.updateServiceState(setServiceForm, "value", e.target.value)} icon={money} />
              <Line />
              <div className='sf-bottom-columns'>
                <div className='sf-left-column'>
                  <SmallButton title={"A partir de"} selected={serviceForm.getInicial()} onClick={() => serviceForm.updateServiceState(setServiceForm, "inicial", !serviceForm.getInicial())} />
                  <DropdownButton title={selectedSService?.getName() || "Detalhes"} dropDownItems={SServDropList} />
                </div>
                <div className='sf-right-column'>
                  <LinkButton title={"Alterar tempo de duração"} onClick={() => setTab(1)} />
                  <LinkButton title={"Alterar Profissionais"} onClick={() => setTab(2)} />
                </div>
              </div>
            </div>
            <BottomPopup title={"Editando..."} subtitle={`Os campos ### não foram preenchidos!`} buttonTitle={"Salvar"} onClick={async () => await saveService()} activated={serviceForm.isValid()} />
            <AlertBlock
              title={"Você realmente deseja excluir"}
              itemButtons={[
                {
                  title: serviceForm.getName(),
                  subtitle: formatDuration(serviceForm.getDuration()),
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
      case 1: // Time Tab
        const duration = [...(selectedSService?.getDuration() || serviceForm.getDuration())];
        return (
          <div className='service-form'>
            <Header title={"Alterar Duração"} onClickReturn={() => setTab(0)} />
            <SubHeader title={formatDuration(duration)} buttonTitle={"Remover espaços"} onClick={() => serviceForm.fillHours(setServiceForm, selectedSService?.getId())} />
            <Carousel
              items={serviceForm.getSubServices().map((sserv) => {
                return {
                  title: sserv.getName(),
                  selected: sserv.getId() == selectedSService?.getId(),
                  onClick: () => setSelectedSService(sserv),
                };
              })}
            />
            <div className='sf-item-list'>
              {longTimeArray.map((timeValue, index) => {
                return <ItemButton title={timeValue} selected={duration?.[index]} onClick={() => serviceForm.updateHourList(index, setServiceForm, selectedSService?.getId())} />;
              })}
            </div>
            <BottomButton hidden={false} title={"Confirmar"} onClick={() => setTab(0)} />
          </div>
        );
      case 2: // Professional Tab
        return (
          <div className='service-form'>
            <Header title={"Editar Profissionais"} icon={addUser} onClickReturn={() => setTab(0)} onClickIcon={() => setTab(4)} />
            <div className='gf-professional-list'>
              {groupForm
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((professional: Professional, index: number) => {
                  var profServices = professional.getServices();
                  return <ItemButton title={professional.getName()} subtitle={professional.getOccupations().join(", ")} selected={profServices.includes(serviceForm.getId())} onClick={() => handleProfessionals(profServices, index)} />;
                })}
            </div>
            <BottomButton hidden={false} title={"Confirmar"} onClick={() => setTab(0)} />
          </div>
        );
      case 3: // Subservice Tab
        return (
          <div className='service-form'>
            <Header
              title={"Editar Subserviços"}
              icon={more}
              onClickReturn={() => setTab(0)}
              onClickIcon={() => {
                setSelectedSService(null);
                setTab(5);
              }}
            />
            <div className='sf-item-list'>
              {serviceForm.getSubServices().map((sserivce: SubService) => {
                return <ItemButton title={sserivce.getName()} subtitle={"Detalhes"} selected={selectedSService?.getId() === sserivce.getId()} onClick={() => idSwitcher(selectedSService, sserivce, setSelectedSService)} />;
              })}
            </div>
            <BottomButton hidden={selectedSService === null} title={"Editar Subserviço"} onClick={() => setTab(5)} />
          </div>
        );
      case 4: // Professional Form Tab
        return <ProfessionalForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} professional={new Professional()} onClickReturn={() => setTab(2)} />;
      case 5: // SubService Form Tab
        var sService = serviceForm.getSubServices().find((sserv) => sserv.getId() === selectedSService?.getId());
        if (!sService) {
          sService = new SubService(serviceForm.getSubServiceId().toString());
          serviceForm.setSubServiceId(serviceForm.getSubServiceId() + 1);
        }
        return <SubServiceForm onClickReturn={() => setTab(3)} user={user} serviceForm={serviceForm} setServiceForm={setServiceForm} subService={sService} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <LoadingScreen /> : <LoadingScreen />;
}
*/
