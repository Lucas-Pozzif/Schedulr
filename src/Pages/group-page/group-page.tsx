import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Group } from "../../Classes/group";
import { User } from "../../Classes/user";
import { Service } from "../../Classes/service";
import { Professional } from "../../Classes/professional";
import { DropdownButton } from "../../Components/buttons/dropdown-button/dropdown-button";
import { Line } from "../../Components/line/line";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Header } from "../../Components/header/header";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { Carousel } from "../../Components/carousel/carousel";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";
import { DoubleButton } from "../../Components/buttons/double-button/double-button";
import { capitalize } from "../../Function/capitalize/capitalize";

import "./group-page.css";
import { RatingPage } from "../rating-page/rating-page";

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
      case 0:
        return (
          <div className='group-page'>
            <img className='gp-banner' src={group.getBanner()} />
            <div className='gp-title-block'>
              <p className='gp-title'>{group.getTitle()}</p>
              <p className='gp-type'>
                {group.getType()} - {"$".repeat(group.getPricing())}
              </p>
            </div>
            <div className='gp-header'>
              {/* //Futuro, aba de comentários
                <div
                className='gp-block'
                onClick={() => {
                  setTab(4);
                }}
              >
                <div className='gp-rating-block'>
                  <img className='gp-rating-icon' src={star} />
                  <p className='gp-rating'>
                    {averageRating} ({group.getRatings().length})
                  </p>
                </div>
                <p className='gp-comment'>Comentários ({group.getRatings().length})</p>
              </div>
               */}
              <p className='gp-distance'>{group.getLocation()}</p>
              <Line />
            </div>
            <div className='gp-bottom-columns'>
              <div className='gp-right-column'>
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
                <div className='gp-image-group'>
                  {group.getImages().map((image) => {
                    return <img className='gf-image' src={image} />;
                  })}
                </div>
              </div>
            </div>
            <div className={"bottom-popup " + (selectedService && selectedProfessional && selectedTime ? "" : "hidden")}>
              <div className='bp-text-block'>
                <p className='bp-title'>
                  {selectedDay > 0 ? days[selectedDay][1] : ""} - {tempTime[selectedTime || 0]}
                </p>
                <p className='bp-title'>{selectedService?.getName()}</p>
                <p className='bp-subtitle'>{selectedProfessional?.getName()}</p>
              </div>
              <p
                className={"bp-button" + (true ? "" : " inactive")}
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
              >
                Confirmar Agendamento
              </p>
            </div>
            <BottomButton
              hidden={selectedService != null || selectedProfessional != null || selectedTime != null}
              onClick={() => {
                navigate(`/user/schedule/${user.getId()}`);
              }}
              title={"Ver Minha Agenda"}
            />
            <img className='return-button gp-return-button' src={arrow} onClick={() => navigate(-1)} />
            <img className='gp-profile' src={group.getProfile()} onClick={() => {}} />
          </div>
        );
      case 1:
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
            <div className='carousel'>
              {days.map((day, index) => {
                return (
                  <div
                    className={"carousel-item" + (index === selectedDay ? " selected" : "")}
                    onClick={async () => {
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
                    }}
                  >
                    <p className='carousel-item-text'>{day[0]}</p>
                    <p className='carousel-item-text'>{day[1]}</p>
                  </div>
                );
              })}
            </div>
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
                  <div
                    className='gp-time-row'
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
                  >
                    <div className={"gp-time-button" + (selectedTime !== null && index + startHour * 6 >= selectedTime && index + startHour * 6 < selectedTime + (selectedService?.getDuration().length || 0) ? " selected" : "")}>
                      <p className='gpt-title'>{days[selectedDay]?.[0]}</p>
                      <p className='gpt-title'>{time}</p>
                    </div>
                    <div className='gpt-row-item'>
                      <ItemButton
                        title={selectedService?.getName() || "Serviço não selecionado"}
                        subtitle={professionals
                          .map((prof) => {
                            return prof.getName();
                          })
                          .join(", ")}
                        selected={selectedTime !== null && index + startHour * 6 >= selectedTime && index + startHour * 6 < selectedTime + (selectedService?.getDuration().length || 0)}
                        onClick={() => {}}
                      />
                    </div>
                  </div>
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
      case 2:
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
      case 3:
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
      case 4: //rating page
        console.log(group.getRatings());
        return <RatingPage group={group} />;
      default:
        return <div />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
