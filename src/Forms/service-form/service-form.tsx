import { Dispatch, SetStateAction, useState } from "react";
import { Service, SubService } from "../../Classes/service";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { SmallButton } from "../../Components/buttons/small-button/small-button";
import { DropdownButton } from "../../Components/buttons/dropdown-button/dropdown-button";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { Header } from "../../Components/header/header/header";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { Group } from "../../Classes/group";
import { Professional } from "../../Classes/professional";
import { Carousel } from "../../Components/carousel/carousel";
import { SubServiceForm } from "../sub-service-form/sub-service-form";
import { BottomPopup } from "../../Components/buttons/bottom-popup/bottom-popup";
import { ProfessionalForm } from "../professional-form/professional-form";

import "./service-form.css";
import { HeaderInput } from "../../Components/inputs/header-input/header-input";
import { IconInput } from "../../Components/inputs/icon-input/icon-input";
import ErrorPage from "../../Pages/error-page/error-page";

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
  const [selectedSService, setSelectedSService] = useState<null | number>(null);

  const arrow = require("../../Assets/arrow.png");
  const more = require("../../Assets/more.png");
  const bin = require("../../Assets/delete.png");
  const money = require("../../Assets/money.png");
  const addImage = require("../../Assets/add-image.png");
  const addUser = require("../../Assets/add-user.png");

  var SServDropList: [string, () => void][] = serviceForm.getSubServices().map((SubService, index) => {
    return [SubService.getName(), () => setSelectedSService(index)];
  });
  SServDropList.push([
    "Editar Subserviços",
    () => {
      setTab(3);
    },
  ]);

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home Tab
        return (
          <div className='service-form'>
            <HeaderInput
              placeholder={"Digite o nome do Serviço"}
              value={serviceForm.getName()}
              icon={bin}
              onChange={(e) => {
                serviceForm.setName(e.target.value);
                const updatedService = new Service(serviceForm);
                setServiceForm(updatedService);
              }}
              onClickReturn={onClickReturn}
              onClickIcon={() => {
                alert("ainda não implementado");
              }}
            />
            <div className='sf-data-block'>
              <IconInput
                placeholder={"Digite o valor"}
                value={serviceForm.getValue()}
                onChange={(e) => {
                  serviceForm.setValue(e.target.value);
                  const updatedService = new Service(serviceForm);
                  setServiceForm(updatedService);
                }}
                icon={money}
              />
              <Line />
              <div className='sf-bottom-columns'>
                <div className='sf-left-column'>
                  <SmallButton
                    title={"A partir de"}
                    selected={serviceForm.getInicial()}
                    onClick={() => {
                      serviceForm.setInicial(!serviceForm.getInicial());
                      const updatedService = new Service(serviceForm);
                      setServiceForm(updatedService);
                    }}
                  />
                  <DropdownButton title={selectedSService !== null ? serviceForm.getSubServices()[selectedSService].getName() : "Detalhes"} dropDownItems={SServDropList} />
                </div>
                <div className='sf-right-column'>
                  <LinkButton
                    title={"Alterar tempo de duração"}
                    onClick={() => {
                      setTab(1);
                    }}
                  />
                  <LinkButton
                    title={"Alterar Profissionais"}
                    onClick={() => {
                      setTab(2);
                    }}
                  />
                </div>
              </div>
            </div>
            <BottomPopup
              title={"Editando..."}
              subtitle={`Os campos ### não foram preenchidos!`}
              buttonTitle={"Salvar"}
              onClick={async () => {
                setLoading(true);
                console.log(serviceForm.getId());
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
                console.log("done");
                setGroupForm(new Group(groupForm));
                setLoading(false);
                onClickReturn();
              }}
              activated={serviceForm.isValid()}
            />
          </div>
        );
      case 1: // Time Tab
        const timeArray = [];

        timeArray.push(`0:10`, `0:20`, `0:30`, `0:40`, `0:50`);
        for (let i = 1; i <= 11; i++) {
          timeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
        }
        timeArray.push(`12:00`);
        const duration = [...(selectedSService !== null ? serviceForm.getSubServices()[selectedSService].getDuration() : serviceForm.getDuration())];
        return (
          <div className='service-form'>
            <Header
              title={"Alterar Duração"}
              icon={""}
              onClickReturn={() => {
                setTab(0);
              }}
              onClickIcon={() => {}}
            />
            <SubHeader
              title={`${Math.floor(duration.length / 6)}h ${(duration.length % 6) * 10}m`}
              buttonTitle={"Remover espaços"}
              onClick={() => {
                duration.map((value, index) => {
                  duration[index] = true;
                });
                if (selectedSService !== null) {
                  serviceForm.getSubServices()[selectedSService].setDuration(duration);
                } else {
                  serviceForm.setDuration(duration);
                }
                setServiceForm(new Service(serviceForm));
              }}
            />
            <Carousel
              items={serviceForm.getSubServices().map((sserv, index) => {
                return {
                  title: sserv.getName(),
                  selected: index == selectedSService,
                  onClick: () => setSelectedSService(index),
                };
              })}
            />
            <div className='sf-item-list'>
              {timeArray.map((timeValue, index) => {
                return (
                  <ItemButton
                    title={timeValue}
                    subtitle={""}
                    selected={duration?.[index]}
                    onClick={() => {
                      if (index >= duration.length) {
                        const diff = index - duration.length + 1;
                        duration.push(...Array(diff).fill(false));
                      }
                      duration[index] = !duration[index];
                      let lastIndex = duration.length - 1;
                      while (lastIndex >= 0 && !duration[lastIndex]) {
                        duration.pop();
                        lastIndex--;
                      }
                      if (selectedSService !== null) {
                        serviceForm.getSubServices()[selectedSService].setDuration(duration);
                      } else {
                        serviceForm.setDuration(duration);
                      }
                      setServiceForm(new Service(serviceForm));
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      case 2: // Professional Tab
        return (
          <div className='service-form'>
            <Header
              title={"Editar Profissionais"}
              icon={addUser}
              onClickReturn={() => {
                setTab(0);
              }}
              onClickIcon={() => {
                setTab(4);
              }}
            />
            <div className='gf-professional-list'>
              {groupForm
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((professional: Professional, index: number) => {
                  var profServices = professional.getServices();

                  return (
                    <ItemButton
                      title={professional.getName()}
                      subtitle={professional.getOccupations().join(", ")}
                      selected={profServices.includes(serviceForm.getId())}
                      onClick={() => {
                        if (profServices.includes(serviceForm.getId())) {
                          profServices = profServices.filter((id) => id !== serviceForm.getId());
                        } else {
                          profServices.push(serviceForm.getId());
                        }
                        const professionals = groupForm.getProfessionals();
                        professionals[index].setServices(profServices);
                        groupForm.setProfessionals(professionals);
                        const updatedGroup = new Group(groupForm);
                        setGroupForm(updatedGroup);
                      }}
                    />
                  );
                })}
            </div>
          </div>
        );
      case 3: // Subservice Tab
        return (
          <div className='service-form'>
            <Header
              title={"Editar Subserviços"}
              icon={more}
              onClickReturn={() => {
                setTab(0);
              }}
              onClickIcon={() => {
                setTab(5);
              }}
            />
            <div className='sf-item-list'>
              {serviceForm.getSubServices().map((sserivce: SubService, index: number) => {
                return (
                  <ItemButton
                    title={sserivce.getName()}
                    subtitle={"Detalhes"}
                    selected={selectedSService === index}
                    onClick={() => {
                      if (selectedSService == index) {
                        setSelectedSService(null);
                      } else {
                        setSelectedSService(index);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      case 4: // Professional Form Tab
        return <ProfessionalForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} professional={new Professional()} onClickReturn={() => setTab(2)} />;
      case 5: // SubService Form Tab
        return (
          <SubServiceForm
            onClickReturn={() => {
              setTab(3);
            }}
            user={user}
            serviceForm={serviceForm}
            setServiceForm={setServiceForm}
            subService={serviceForm.getSubServices()[selectedSService || serviceForm.getSubServices().length]}
          />
        );
      default:
        return <ErrorPage />;
    }
  };
  return loading ? <LoadingScreen /> : tabHandler();
}
