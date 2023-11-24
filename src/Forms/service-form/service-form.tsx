import "./service-form.css";

import { Dispatch, SetStateAction, useState } from "react";

import { Group, Professional, Service, SubService, User } from "../../Classes/classes-imports";
import { addUser, bin, longTimeArray, money, more } from "../../_global";
import { formatDuration } from "../../Function/functions-imports";

import { SubServiceForm } from "../sub-service-form/sub-service-form";
import { ProfessionalForm } from "../professional-form/professional-form";
import { ErrorPage } from "../../Pages/error-page/error-page";
import { BottomButton, BottomPopup, Carousel, DropdownButton, Header, HeaderInput, IconInput, ItemButton, Line, LinkButton, LoadingScreen, SmallButton, SubHeader } from "../../Components/component-imports";

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

  const [selectedSService, setSelectedSService] = useState<null | SubService>(null);

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
              onClickIcon={() => alert("ainda não implementado")}
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
                return (
                  <ItemButton
                    title={sserivce.getName()}
                    subtitle={"Detalhes"}
                    selected={selectedSService?.getId() === sserivce.getId()}
                    onClick={() => {
                      console.log(sserivce, selectedSService);
                      if (selectedSService?.getId() === sserivce.getId()) {
                        setSelectedSService(null);
                      } else {
                        setSelectedSService(sserivce);
                      }
                    }}
                  />
                );
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
  return loading ? <LoadingScreen /> : tabHandler();
}
