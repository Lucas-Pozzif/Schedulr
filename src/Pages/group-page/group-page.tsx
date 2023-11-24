import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Group } from "../../Classes/group/group";
import { User } from "../../Classes/user/user";
import { Service } from "../../Classes/service/service";
import { Professional } from "../../Classes/professional/professional";
import { DropdownButton } from "../../Components/buttons/dropdown-button/dropdown-button";
import { Line } from "../../Components/line/line";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Header } from "../../Components/header/header/header";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { Carousel } from "../../Components/carousel/carousel";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";
import { DoubleButton } from "../../Components/buttons/double-button/double-button";
import { capitalize } from "../../Function/formatting/capitalize/capitalize";

import "./group-page.css";
import { RatingPage } from "../rating-page/rating-page";
import { GroupBanner } from "../../Components/banner/group-banner/group-banner";
import { DoubleTextBlock } from "../../Components/blocks/double-text-block/double-text-block";
import { BottomPopup } from "../../Components/buttons/bottom-popup/bottom-popup";
import {ErrorPage} from "../error-page/error-page";
import { DoubleItemButton } from "../../Components/buttons/double-item-button/double-item-button";

export function GroupPage() {
  const [user, setUser] = useState(new User());
  const [group, setGroup] = useState(new Group());
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(-1);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedWeekDay, setSelectedWeekDay] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [availableProfessionals, setAvailableProfessionals] = useState<Professional[]>([]);
  const [tab, setTab] = useState(0);

  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client) => {
      if (!client) return;

      await user.getUser(client.uid);
      setUser(new User(user));
    });

    group.getGroup(groupId || "").then(async () => {
      await group.updateServices();
      await group.updateProfessionals();
      setGroup(new Group(group));
      setLoading(false);
    });
  }, []);

  const star = require("../../Assets/star.png");
  const arrow = require("../../Assets/arrow.png");

  const days: any[][] = [];

  for (let i = 0; i < 9; i++) {
    const day = new Date();
    day.setDate(day.getDate() + i);
    days.push([]);
    switch (i) {
      case 0:
        days[i].push("Hoje");
        break;
      case 1:
        days[i].push("Amanhã");
        break;
      default:
        days[i].push(capitalize(day.toLocaleString("pt-BR", { weekday: "long" })));
        break;
    }
    days[i].push(day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }));
    days[i].push(day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }));
    days[i].push(day.getDay());
  }

  const timeArray: any[] = [];
  const startHour = Math.floor(group.getStartHours()[selectedWeekDay] / 2);
  const endHour = Math.floor(group.getHours()[selectedWeekDay]?.length / 2);

  const tempTime: string[] = [];

  for (let i = 0; i < 24; i++) {
    tempTime.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
  }

  for (let i = startHour; i - startHour < endHour; i++) {
    if (i >= 0) {
      timeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
    }
  }

  var ratingSum = 5;
  group.getRatings().map((rating) => {
    ratingSum += rating.rate;
  });
  const averageRating = (ratingSum / (group.getRatings.length + 1)).toFixed(2);

  const profSchedValue = {
    client: user.getId(),
    service: selectedService?.getId() || "error",
  };
  const clientSchedValue = {
    client: selectedProfessional?.getId() || "error",
    service: selectedService?.getId() || "error",
  };

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home Tab
        return (
          <div className='group-page'>
            <GroupBanner
              banner={group.getBanner()}
              returnButton
              onClickReturn={() => {
                navigate(-1);
              }}
            />
            <DoubleTextBlock title={group.getTitle()} subtitle={`${group.getType()} - ${"$".repeat(group.getPricing())}`} />
            <div className='gp-header'>
              <p className='gp-distance'>{group.getLocation()}</p>
              <Line />
            </div>
            <div className='gp-bottom-columns'>
              <LinkButton
                title='Horário e Serviço'
                onClick={() => {
                  if (selectedService === null) {
                    setTab(3);
                  } else {
                    setTab(1);
                  }
                }}
              />
              <LinkButton
                title='Profissional'
                onClick={() => {
                  setTab(2);
                }}
              />
            </div>
            <BottomPopup
              title={`${selectedDay > 0 ? days[selectedDay][1] : ""} - ${tempTime[selectedTime || 0]}`}
              title2={selectedService?.getName()}
              subtitle={selectedProfessional?.getName()}
              buttonTitle={"Confirmar Agendamento"}
              onClick={async () => {
                if (selectedService && selectedProfessional && selectedTime) {
                  setLoading(true);
                  for (let i = 0; i < selectedService.getDuration().length; i++) {
                    if (selectedService.getDuration()[i] === true) {
                      await selectedProfessional?.updateSchedule(days[selectedDay][2], (selectedTime + i).toString(), profSchedValue);
                      await user?.updateSchedule(days[selectedDay][2], (selectedTime + i).toString(), clientSchedValue);
                    }
                  }
                  setSelectedDay(-1);
                  setSelectedService(null);
                  setSelectedTime(null);
                  setSelectedProfessional(null);
                  setLoading(false);
                }
              }}
              hidden={selectedService === null || selectedProfessional === null || selectedTime === null}
            />
            <BottomButton
              hidden={selectedService !== null && selectedProfessional !== null && selectedTime !== null}
              onClick={() => {
                navigate(`/user/schedule/${user.getId()}`);
              }}
              title={"Ver Minha Agenda"}
            />
            <img className='gp-profile' src={group.getProfile()} />
          </div>
        );
      case 1: // Time Tab
        return (
          <div className='gp-service-tab'>
            <Header
              title={"Escolha o horário"}
              icon={""}
              onClickReturn={() => {
                setTab(0);
              }}
              onClickIcon={() => {}}
            />
            <SubHeader
              title={selectedService?.getName() || ""}
              buttonTitle={"Alterar Serviço"}
              onClick={() => {
                setTab(3);
              }}
            />
            <Carousel
              items={days.map((day, index) => {
                return {
                  title: day[0],
                  title2: day[1],
                  selected: index === selectedDay,
                  onClick: async () => {
                    setLoading(true);
                    setSelectedDay(index);
                    setSelectedWeekDay(day[3]);
                    setSelectedTime(null);
                    await Promise.all(
                      group
                        .getProfessionals()
                        .sort((a, b) => a.getName().localeCompare(b.getName()))
                        .map(async (prof: Professional) => {
                          if (prof.getServices().includes(selectedService!.getId())) {
                            await prof?.getScheduleDay(days[index][2]);
                          }
                        })
                    );
                    console.log(group.getProfessionals());

                    setLoading(false);
                  },
                };
              })}
            />
            <div className='gp-list'>
              {timeArray.map((time, index) => {
                var isAvailable = false;
                const professionals: Professional[] = [];
                group
                  .getProfessionals()
                  .sort((a, b) => a.getName().localeCompare(b.getName()))
                  .map((prof) => {
                    var isProfAvailable = true;
                    selectedService?.getDuration().map((time, i) => {
                      if (prof.getSchedule()?.[days[selectedDay]?.[2]]?.[index + i + startHour * 6] !== undefined && time) {
                        isProfAvailable = false;
                      }
                    });
                    if (isProfAvailable) {
                      professionals.push(prof);
                      isAvailable = true;
                    }
                  });

                return isAvailable && selectedDay > 0 ? (
                  <DoubleItemButton
                    leftButtonTitle={{
                      title1: days[selectedDay]?.[0],
                      title2: time,
                    }}
                    title={selectedService?.getName() || "Serviço não selecionado"}
                    subtitle={professionals
                      .map((prof) => {
                        return prof.getName();
                      })
                      .join(", ")}
                    selected={selectedTime !== null && index + startHour * 6 >= selectedTime && index + startHour * 6 < selectedTime + (selectedService?.getDuration().length || 0)}
                    onClick={() => {
                      console.log(selectedService?.getDuration().length);
                      if (selectedTime === null) {
                        setSelectedTime(index + startHour * 6);
                        setAvailableProfessionals(professionals);
                      } else {
                        if (selectedTime == index + startHour * 6) {
                          setSelectedTime(null);
                        } else {
                          setSelectedTime(index + startHour * 6);
                          setAvailableProfessionals(professionals);
                        }
                      }
                    }}
                  />
                ) : null;
              })}
            </div>
            <BottomButton
              hidden={selectedTime === null}
              title={"Escolher Profissional"}
              onClick={() => {
                setSelectedProfessional(null);
                setTab(2);
              }}
            />
          </div>
        );
      case 2: // Professional Tab
        return (
          <div className='gp-professional-tab'>
            <Header
              title={"Escolha o Profissional"}
              icon={""}
              onClickReturn={() => {
                if (selectedService !== null) {
                  setTab(1);
                } else {
                  setTab(0);
                }
              }}
              onClickIcon={() => {}}
            />
            <SubHeader
              title={`${selectedDay > 0 ? days[selectedDay][0] + " - " + days[selectedDay][1] : "Selecionar Dia"} - ${tempTime[selectedTime || 0]}`}
              buttonTitle={selectedService?.getName() || "Selecionar Serviço"}
              onClick={() => {
                setTab(3);
              }}
            />
            <div className='gp-list'>
              {group
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((professional) => {
                  return availableProfessionals.includes(professional) || selectedService === null ? (
                    <ItemButton
                      title={professional.getName()}
                      subtitle={professional.getOccupations().join(", ")}
                      selected={professional.getId() === selectedProfessional?.getId()}
                      onClick={() => {
                        if (selectedProfessional?.getId() === professional.getId()) {
                          setSelectedProfessional(null);
                        } else {
                          setSelectedProfessional(professional);
                        }
                      }}
                    />
                  ) : null;
                })}
            </div>
            <DoubleButton
              title={["Próximo", "Ver Agenda"]}
              onClick={[
                () => {
                  setTab(0);
                },
                () => {
                  navigate(`/professional/schedule/${selectedProfessional?.getId()}`);
                },
              ]}
              hidden={[selectedProfessional === null, selectedProfessional === null || !group.getAdmins().includes(user.getId())]}
            />
          </div>
        );
      case 3: // Service Tab
        return (
          <div className='gp-service-tab'>
            <Header
              title={"Escolha o serviço"}
              icon={""}
              onClickReturn={() => {
                if (selectedService === null) {
                  setTab(0);
                } else {
                  setTab(1);
                }
                setSelectedTime(null);
              }}
              onClickIcon={() => {}}
            />
            <div className='gp-list'>
              {group
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service) => {
                  return (
                    <ItemButton
                      title={service.getName()}
                      subtitle={"Ainda não implementado"}
                      selected={service.getId() === selectedService?.getId()}
                      onClick={() => {
                        if (selectedService?.getId() === service.getId()) {
                          setSelectedService(null);
                        } else {
                          setSelectedService(service);
                        }
                      }}
                    />
                  );
                })}
            </div>
            <BottomButton
              hidden={selectedService == null}
              title={"Escolher Horário"}
              onClick={() => {
                setTab(1);
              }}
            />
          </div>
        );
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
