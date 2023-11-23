import { useEffect, useRef, useState } from "react";

import { Group } from "../../Classes/group";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { Service } from "../../Classes/service";
import { Professional } from "../../Classes/professional";
import { Header } from "../../Components/header/header/header";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { BottomPopup } from "../../Components/buttons/bottom-popup/bottom-popup";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { ServiceForm } from "../service-form/service-form";
import { Carousel } from "../../Components/carousel/carousel";
import { ProfessionalForm } from "../professional-form/professional-form";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate } from "react-router-dom";

import "./group-form.css";
import { GroupBanner } from "../../Components/banner/group-banner/group-banner";
import { DoubleInput } from "../../Components/inputs/double-input/double-input";
import { IconInput } from "../../Components/inputs/icon-input/icon-input";
import ErrorPage from "../../Pages/error-page/error-page";

export function GroupForm() {
  const [user, setUser] = useState(new User());
  const [loading, setLoading] = useState(false);
  const [groupForm, setGroupForm] = useState(new Group());
  const [GTShow, setGTShow] = useState(false); //Group type
  const [tab, setTab] = useState(0);
  const [dayList, setDayList] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedService, setSelectedService] = useState<null | string>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<null | string>(null);

  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const fullDays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

  const addImage = require("../../Assets/add-image.png");
  const locationPin = require("../../Assets/location-pin.png");
  const arrow = require("../../Assets/arrow.png");
  const more = require("../../Assets/more.png");
  const addUser = require("../../Assets/add-user.png");
  const block = require("../../Assets/block.png");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client) => {
      if (!client) return; //There is no user on the firebase authentication
      await user.getUser(client.uid);
      setUser(new User(user));
    });
    groupForm.setOwner(user.getId());
    groupForm.setAdmins([...groupForm.getAdmins(), user.getId()]);
    setLoading(false);
  }, []);
  const bannerRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home tab
        return (
          <div className='group-form'>
            <GroupBanner onClick={() => bannerRef.current!.click()} banner={groupForm.getBanner()} />
            <div className='gf-profile' onClick={() => profileRef.current!.click()}>
              <img className={`gf-profile-${groupForm.getProfile() ? "image" : "placeholder"}`} src={groupForm.getProfile() ? groupForm.getProfile() : addImage} />
            </div>
            <DoubleInput
              input1={{
                placeholder: "Editar nome",
                value: groupForm.getTitle(),
                onChange: (e) => {
                  groupForm.setTitle(e.target.value);
                  const updatedGroup = new Group(groupForm);
                  setGroupForm(updatedGroup);
                },
              }}
              input2={{
                placeholder: "Editar tipo de negócio",
                value: groupForm.getType(),
                onChange: (e) => {
                  groupForm.setType(e.target.value);
                  setGroupForm(new Group(groupForm));
                },
              }}
            />
            <div className='gf-data-block'>
              <IconInput
                icon={locationPin}
                value={groupForm.getLocation()}
                placeholder='Digite o Endereço'
                onChange={(e) => {
                  groupForm.setLocation(e.target.value);
                  const updatedGroup = new Group(groupForm);
                  setGroupForm(updatedGroup);
                }}
              />
              <Line />
              <div className='gf-links'>
                <LinkButton
                  title='Editar Serviços'
                  onClick={() => {
                    setTab(1);
                  }}
                />
                <LinkButton
                  title='Editar Horários'
                  onClick={() => {
                    setTab(2);
                  }}
                />
                <LinkButton
                  title='Editar Profissionais'
                  onClick={() => {
                    setTab(3);
                  }}
                />
              </div>
            </div>
            <BottomPopup
              title='Editando...'
              subtitle='Possui Alterações'
              buttonTitle='Salvar Alterações'
              onClick={async () => {
                setLoading(true);
                if (groupForm.getId()) {
                  await groupForm.setGroup();
                } else {
                  await groupForm.addGroup();
                }
                console.log("Grupos atualizados");

                setLoading(false);
                navigate("/");
              }}
              activated={groupForm.isValid()}
            />
            {/* Hidden inputs that are refferencied */}
            <input
              className='hidden'
              type='file'
              accept='image/*'
              onChange={(event) => {
                const selectedFile = event.target.files?.[0];
                if (selectedFile) {
                  groupForm.setBanner(URL.createObjectURL(selectedFile));
                  setGroupForm(new Group(groupForm));
                }
              }}
              ref={bannerRef}
            />
            <input
              className='hidden'
              type='file'
              accept='image/*'
              onChange={(event) => {
                const selectedFile = event.target.files?.[0];
                if (selectedFile) {
                  groupForm.setProfile(URL.createObjectURL(selectedFile));
                  setGroupForm(new Group(groupForm));
                }
              }}
              ref={profileRef}
            />
          </div>
        );
      case 1: // Service Tab
        return (
          <div className='gf-tab'>
            <Header
              title='Editar Serviços'
              icon={more}
              onClickReturn={() => {
                setTab(0);
                setSelectedService(null);
              }}
              onClickIcon={() => {
                setTab(4);
              }}
            />
            <SubHeader
              title={`${groupForm.getServices().length} serviços criados`}
              buttonTitle='Alterar Horários'
              onClick={() => {
                setTab(2);
                setSelectedService(null);
              }}
            />
            <div className='gf-list'>
              {groupForm
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service: Service) => {
                  return (
                    <ItemButton
                      title={service.getName()}
                      subtitle={service.getDurationValue()}
                      selected={selectedService === service.getId()}
                      onClick={() => {
                        if (selectedService == service.getId()) {
                          setSelectedService(null);
                        } else {
                          setSelectedService(service.getId());
                        }
                      }}
                    />
                  );
                })}
            </div>
            <BottomButton
              hidden={selectedService == null}
              title='Editar Serviço'
              onClick={() => {
                setTab(4);
              }}
            />
          </div>
        );
      case 2: // Time Tab
        const timeArray = [];

        for (let i = 0; i <= 24; i++) {
          timeArray.push(`${i}:00`, `${i}:30`);
        }
        return (
          <div className='gf-tab'>
            <Header
              title='Alterar Horários'
              icon={block}
              onClickIcon={() => {
                const startHours = [...groupForm.getStartHours()];
                const hours = [...groupForm.getHours()];
                startHours[selectedDay] = 0;
                hours[selectedDay] = [];
                groupForm.setStartHours(startHours);
                groupForm.setHours([]);
                const updatedGroupForm = new Group(groupForm);
                setGroupForm(updatedGroupForm);
              }}
              onClickReturn={() => {
                setTab(1);
              }}
            />
            <SubHeader
              title={fullDays[selectedDay]}
              buttonTitle='Preencher horários'
              onClick={() => {
                const hours = [...groupForm.getHours()];
                hours[selectedDay] = hours[selectedDay]?.map(() => true);

                groupForm.setHours(hours);
                setGroupForm(new Group(groupForm));
              }}
            />
            <Carousel
              items={fullDays.map((day, index) => {
                return {
                  title: day,
                  selected: selectedDay == index,
                  onClick: () => {
                    setSelectedDay(index);
                  },
                };
              })}
            />
            <div className='gf-list'>
              {timeArray.map((timeValue, index) => {
                const startHour = [...groupForm.getStartHours()];
                const hours = [...groupForm.getHours()];
                const selected = groupForm.getHours()[selectedDay]?.[index - groupForm.getStartHours()[selectedDay]];
                if (index < 12) {
                  return;
                }
                return (
                  <ItemButton
                    title={timeValue}
                    subtitle={""}
                    selected={selected}
                    onClick={() => {
                      if (!startHour[selectedDay]) {
                        startHour[selectedDay] = 0;
                      }
                      startHour[selectedDay] = parseInt(startHour[selectedDay].toString());

                      if (isNaN(startHour[selectedDay])) {
                        startHour[selectedDay] = 0;
                      }

                      if (startHour[selectedDay] > 0) {
                        const falseValuesToAdd = Array(startHour[selectedDay]).fill(false);
                        hours[selectedDay] = [...falseValuesToAdd, ...hours[selectedDay]];
                        startHour[selectedDay] = 0;
                      }
                      if (!hours[selectedDay]) {
                        hours[selectedDay] = [];
                      }

                      if (index >= hours[selectedDay].length) {
                        const diff = index - hours[selectedDay].length + 1;
                        hours[selectedDay].push(...Array(diff).fill(false));
                      }
                      hours[selectedDay][index] = !hours[selectedDay][index];
                      let lastIndex = hours[selectedDay].length - 1;
                      while (lastIndex >= 0 && !hours[selectedDay][lastIndex]) {
                        hours[selectedDay].pop();
                        lastIndex--;
                      }
                      startHour[selectedDay] = hours[selectedDay].indexOf(true);
                      for (let i = 0; i < startHour[selectedDay]; i++) {
                        hours[selectedDay].shift();
                      }
                      groupForm.setHours(hours);
                      groupForm.setStartHours(startHour);
                      const updatedGroupForm = new Group(groupForm);
                      setGroupForm(updatedGroupForm);
                    }}
                  />
                );
              })}
            </div>
            <BottomButton
              hidden={false}
              title={"Confirmar"}
              onClick={() => {
                setTab(0);
              }}
            />
          </div>
        );
      case 3: // Professional Tab
        return (
          <div className='gf-tab'>
            <Header
              title={"Editar Profissionais"}
              icon={addUser}
              onClickReturn={() => {
                setTab(0);
                setSelectedProfessional(null);
              }}
              onClickIcon={() => {
                setTab(5);
              }}
            />
            <div className='gf-professional-list'>
              {groupForm
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((professional: Professional, index: number) => {
                  return (
                    <ItemButton
                      title={professional.getName()}
                      subtitle={professional.getOccupations().join(", ")}
                      selected={selectedProfessional === professional.getId()}
                      onClick={() => {
                        setSelectedProfessional(professional.getId());
                      }}
                    />
                  );
                })}
            </div>
            <BottomButton
              hidden={selectedProfessional == null}
              title={"Editar Profissional"}
              onClick={() => {
                setTab(5);
              }}
            />
          </div>
        );
      case 4: // ServiceForm Tab
        const services = groupForm.getServices();
        const service = services.find((service) => {
          return service.getId() == selectedService;
        });
        return (
          <ServiceForm
            user={user}
            groupForm={groupForm}
            setGroupForm={setGroupForm}
            service={service}
            onClickReturn={() => {
              setTab(1);
            }}
          />
        );
      case 5: // ProfessionalForm Tab
        const professionals = groupForm.getProfessionals();
        const professional = professionals.find((professional) => {
          return professional.getId() == selectedProfessional;
        });
        return <ProfessionalForm groupForm={groupForm} setGroupForm={setGroupForm} user={user} onClickReturn={() => setTab(3)} professional={professional} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
