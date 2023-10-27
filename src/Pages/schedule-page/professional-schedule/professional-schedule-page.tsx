import { useEffect, useState } from "react";
import { User } from "../../../Classes/user";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "../../../Components/loading/loading-screen/loading-screen";
import { Professional } from "../../../Classes/professional";
import { Header } from "../../../Components/header/header";
import { ItemButton } from "../../../Components/buttons/item-button/item-button";
import { SubHeader } from "../../../Components/sub-header/sub-header";
import { parseDate } from "../../../Function/parse-date/parse-date";
import { capitalize } from "../../../Function/capitalize/capitalize";
import { Service } from "../../../Classes/service";
import { BottomButton } from "../../../Components/buttons/bottom-button/bottom-button";

import "../schedule-page.css";
import { findRepetitionBlocks } from "../../../Function/find-repetition-blocks/find-repetition-blocks";
import { formattedDate } from "../../../Function/formatted-date/formatted-date";
import { DoubleButton } from "../../../Components/buttons/double-button/double-button";
import { DoubleItemButton } from "../../../Components/buttons/double-item-button/double-item-button";
import { Carousel } from "../../../Components/carousel/carousel";

var isEqual = require("lodash.isequal");

export function ProfessionalSchedulePage() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const [user, setUser] = useState(new User());
  const [professional, SetProfessional] = useState<Professional>(new Professional());

  const [dayList, setDayList] = useState([new Date()]);

  const [displayList, setDisplayList] = useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<{
    client: string;
    service: string;
    timeRange: number[];
    day: string;
  } | null>(null);
  const [selectedTimeList, setSelectedTimeList] = useState<{ day: string; index: number }[]>([]);
  const [editedTime, setEditedTime] = useState<{
    service: string;
    client: string;
    edited: boolean;
  }>({ service: "", client: user.getId(), edited: true });
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [changedValues, setChangedValues] = useState<{ day: string; index: number }[]>([]);

  const [serviceCache, setServiceCache] = useState<{ [serviceId: string]: Service }>({});
  const [clientCache, setClientCache] = useState<{ [clientId: string]: User }>({});

  const { professionalId } = useParams();
  const navigate = useNavigate();

  const save = require("../../../Assets/save.png");
  const edit = require("../../../Assets/edit-square.png");
  const clock = require("../../../Assets/clock.png");

  useEffect(() => {
    setLoading(true);

    const fetchUser = async () => {
      onAuthStateChanged(auth, async (client) => {
        if (!client) return;
        await user.getUser(client.uid);
        setUser(new User(user));
      });
    };

    const fetchScheduleForDays = async (days: Date[]) => {
      const schedulePromises = days.map(async (scheduleDay) => {
        const formattedDay = scheduleDay.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
        await professional.getScheduleDay(formattedDay);
        if (professional.getSchedule()[formattedDay] === undefined) {
          const updatedSchedule = professional.getSchedule();
          delete updatedSchedule[formattedDay];
          professional.setSchedule(updatedSchedule);
        }
      });
      await Promise.all(schedulePromises);
    };
    const fetchServicesAndClients = async () => {
      const scheduleEntries = Object.entries(professional.getSchedule());
      const servicePromises: Promise<void>[] = [];
      const clientPromises: Promise<void>[] = [];

      scheduleEntries.forEach(([day, schedule]) => {
        const scheduleItemEntries = Object.entries(schedule);
        scheduleItemEntries.forEach(([index, scheduleItem]) => {
          if (!scheduleItem.edited) {
            if (!serviceCache[scheduleItem.service]) {
              servicePromises.push(fetchServiceAndCache(scheduleItem.service));
            }
            if (!clientCache[scheduleItem.client]) {
              clientPromises.push(fetchClientAndCache(scheduleItem.client));
            }
          }
        });
      });

      await Promise.all([...servicePromises, ...clientPromises]);
    };

    const fetchServiceAndCache = async (serviceId: string) => {
      const service = new Service();
      await service.getService(serviceId);
      setServiceCache((prevServiceCache) => ({
        ...prevServiceCache,
        [service.getId()]: service,
      }));
    };

    const fetchClientAndCache = async (clientId: string) => {
      const client = new User();
      await client.getUser(clientId);
      setClientCache((prevClientCache) => ({
        ...prevClientCache,
        [client.getId()]: client,
      }));
    };

    const scheduleDays: Date[] = Array.from({ length: 10 }, (_, index) => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + index);
      return currentDate;
    });
    setDayList(scheduleDays);

    fetchUser();
    professional.getProfessional(professionalId || "").then(async () => {
      await fetchScheduleForDays(scheduleDays);
      await fetchServicesAndClients();
      SetProfessional(new Professional(professional));

      setEditedTime((time) => ({
        ...time,
        client: user.getId(),
      }));
      setLoading(false);
    });
  }, []);

  const timeList: string[] = [];
  const week = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  for (let i = 0; i < 24; i++) {
    timeList.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
  }
  const tabHandler = () => {
    switch (tab) {
      case 0: //Home page
        return (
          <div className='schedule-page'>
            <Header
              title={"Minha Agenda"}
              icon={edit}
              onClickReturn={() => {
                navigate(-1);
              }}
              onClickIcon={() => {
                setTab(1); //Edit schedule tab
              }}
            />
            {Object.entries(professional.getSchedule()).map(([date, schedule]) => {
              const formattedDay = formattedDate(parseDate(date));
              const hideMessage = displayList.includes(formattedDay) ? "Ocultar" : "Exibir";

              const weekDay = capitalize(parseDate(date).toLocaleDateString("pt-BR", { weekday: "long" }));

              return (
                <div className='sp-day-block'>
                  <SubHeader
                    title={formattedDay}
                    buttonTitle={hideMessage}
                    onClick={() => {
                      const updatedList = displayList.includes(formattedDay) ? displayList.filter((day) => day !== formattedDay) : [...displayList, formattedDay];
                      setDisplayList(updatedList);
                    }}
                  />
                  {findRepetitionBlocks(schedule).map((block) => {
                    if (!displayList.includes(formattedDay)) return null;

                    const firstIndex = block[0];
                    const lastIndex = block[1];
                    const scheduleItem = schedule[firstIndex]; //the block content is all the same regardless of the index so i'll take the first one

                    const serviceName = scheduleItem.edited ? scheduleItem.service : serviceCache[scheduleItem.service].getName();
                    const clientName = clientCache[scheduleItem.client]?.getName();

                    const currentBlock = {
                      client: scheduleItem.client,
                      service: scheduleItem.service,
                      timeRange: block,
                      day: date,
                    };

                    return (
                      <DoubleItemButton
                        leftButtonTitle={{
                          title1: weekDay,
                          title2: `${timeList[firstIndex]} - ${timeList[lastIndex]}`,
                        }}
                        title={serviceName}
                        subtitle={clientName}
                        isSelected={isEqual(selectedBlock, currentBlock)}
                        onClick={() => {
                          isEqual(selectedBlock, currentBlock) ? setSelectedBlock(null) : setSelectedBlock(currentBlock);
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
            <SubHeader
              title={formattedDate(dayList[dayList.length - 1])}
              buttonTitle={"Carregar próxima semana"}
              onClick={async () => {
                setLoading(true);

                const fetchScheduleForDays = async (days: Date[]) => {
                  const schedulePromises = days.map(async (scheduleDay) => {
                    const formattedDay = scheduleDay.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    });
                    await professional.getScheduleDay(formattedDay);
                    if (professional.getSchedule()[formattedDay] === undefined) {
                      const updatedSchedule = professional.getSchedule();
                      delete updatedSchedule[formattedDay];
                      professional.setSchedule(updatedSchedule);
                    }
                  });
                  await Promise.all(schedulePromises);
                };

                const fetchServicesAndClients = async () => {
                  const scheduleEntries = Object.entries(professional.getSchedule());
                  const servicePromises: Promise<void>[] = [];
                  const clientPromises: Promise<void>[] = [];

                  scheduleEntries.forEach(([day, schedule]) => {
                    const scheduleItemEntries = Object.entries(schedule);
                    scheduleItemEntries.forEach(([index, scheduleItem]) => {
                      if (!scheduleItem.edited) {
                        if (!serviceCache[scheduleItem.service]) {
                          servicePromises.push(fetchServiceAndCache(scheduleItem.service));
                        }
                        if (!clientCache[scheduleItem.client]) {
                          clientPromises.push(fetchClientAndCache(scheduleItem.client));
                        }
                      }
                    });
                  });

                  await Promise.all([...servicePromises, ...clientPromises]);
                };

                const fetchServiceAndCache = async (serviceId: string) => {
                  const service = new Service();
                  await service.getService(serviceId);
                  setServiceCache((prevServiceCache) => ({
                    ...prevServiceCache,
                    [service.getId()]: service,
                  }));
                };

                const fetchClientAndCache = async (clientId: string) => {
                  const client = new User();
                  await client.getUser(clientId);
                  setClientCache((prevClientCache) => ({
                    ...prevClientCache,
                    [client.getId()]: client,
                  }));
                };

                const scheduleDays: Date[] = Array.from({ length: 8 }, (_, index) => {
                  const currentDate = new Date(dayList[dayList.length - 1]);
                  currentDate.setDate(currentDate.getDate() + index);
                  return currentDate;
                });
                setDayList([...dayList, ...scheduleDays]);

                await fetchScheduleForDays(scheduleDays);
                await fetchServicesAndClients();
                setLoading(false);
              }}
            />
            <BottomButton
              hide={selectedBlock === null}
              title={"Editar"}
              onClick={() => {
                setTab(2); //Edit block tab
              }}
            />
          </div>
        );
      case 1: //Edit schedule tab
        return (
          <div className='edit-schedule-tab'>
            <Header
              title={"Minha Agenda"}
              icon={changedValues.length == 0 ? "" : save}
              onClickReturn={() => {
                //saved?
                setTab(0); //Home page
              }}
              onClickIcon={async () => {
                if (changedValues.length == 0) return;
                setLoading(true);
                const updatePromises = changedValues.map(async ({ day, index }) => {
                  return await professional.updateSchedule(day, index.toString(), professional.getSchedule()[day][index]);
                });
                await Promise.all(updatePromises);
                setChangedValues([]);
                setLoading(false);
                setSelectedTimeList([]);
              }}
            />
            <Carousel
              items={dayList.map((day) => {
                return {
                  title: formattedDate(day),
                  isSelected: selectedDay == day,
                  onClick: () => {
                    setSelectedTimeList([]);
                    setSelectedDay(day);
                  },
                };
              })}
            />
            <SubHeader title={formattedDate(selectedDay)} buttonTitle={"Bloquear Tudo"} onClick={() => {}} />
            {timeList.map((time, index) => {
              const dayShift = professional.getShift()[selectedDay.getDay()];
              const startHours = professional.getStartHours()[selectedDay.getDay()];

              const startTime = Math.floor(startHours / 2) * 6;
              const endTime = Math.floor((dayShift.length - 1) / 2) * 6 + startTime;

              if (
                !dayShift[0] || // Check if the first element in dayShift is false
                startTime > index || // Check if startHours is less than index
                endTime < index
              ) {
                return null;
              }

              const weekDay = capitalize(week[selectedDay.getDay()]);
              const schedule =
                professional.getSchedule()[
                  selectedDay.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                ];
              const scheduleItem = schedule?.[index];
              const available = scheduleItem === undefined;

              const serviceName = available ? "Disponível" : scheduleItem?.edited ? scheduleItem?.service : serviceCache[scheduleItem?.service]?.getName();
              const clientName = clientCache[scheduleItem?.client]?.getName();

              const currentTime = {
                day: selectedDay.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }),
                index: index,
              };
              const isSelected = selectedTimeList.find((time) => currentTime.day === time.day && currentTime.index === time.index) !== undefined;

              return (
                <DoubleItemButton
                  leftButtonTitle={{
                    title1: weekDay,
                    title2: time,
                  }}
                  title={serviceName}
                  subtitle={clientName}
                  isSelected={isSelected}
                  onClick={() => {
                    if (selectedTimeList.some((time) => time.day === currentTime.day && time.index === currentTime.index)) {
                      setSelectedTimeList(selectedTimeList.filter((time) => time.day !== currentTime.day || time.index !== currentTime.index));
                    } else {
                      setSelectedTimeList([...selectedTimeList, currentTime]);
                    }
                  }}
                />
              );
            })}
            <DoubleButton
              title={["Bloquear", "Editar"]}
              onClick={[
                () => {
                  const blockedValue = {
                    service: "Bloqueado",
                    client: user.getId(),
                    edited: true,
                  };

                  selectedTimeList.forEach((time) => {
                    if (professional.getSchedule()?.[time.day]?.[time.index] === undefined) {
                      const blockedSchedule = professional.getSchedule();

                      if (!blockedSchedule[time.day]) {
                        blockedSchedule[time.day] = {};
                      }

                      blockedSchedule[time.day][time.index] = blockedValue;

                      professional.setSchedule(blockedSchedule);
                      SetProfessional(new Professional(professional));
                      setChangedValues([...changedValues, { day: time.day, index: time.index }]);
                    }
                  });
                  setSelectedTimeList([]);
                },
                () => {
                  setTab(3); //Edit time tab
                },
              ]}
              hide={[selectedTimeList.length <= 0, selectedTimeList.length <= 0]}
            />
          </div>
        );
      case 2: //Edit block tab
        const day = selectedBlock!.day;

        const client = selectedBlock!.client;
        const service = selectedBlock!.service;

        const startIndex = selectedBlock!.timeRange[0];
        const endIndex = selectedBlock!.timeRange[1];
        const serviceSpan = endIndex - startIndex + 1;

        const blockTime = {
          service: "",
          client: client,
          edited: true,
        };
        const serviceList = Array.from({ length: serviceSpan }, (_, index) => {
          return blockTime;
        });

        return (
          <div className='edit-schedule-block-tab'>
            <Header
              title={"Editar Bloco de Serviços"}
              icon={""}
              onClickReturn={() => {
                setTab(0);
              }}
              onClickIcon={() => {}}
            />
            <div className='sf-value-block'>
              <img className='sf-value-icon' src={clock} />
              <input
                className='sf-value-input'
                placeholder='Digitar Serviço'
                value={editedTime.service}
                onChange={(e) => {
                  setEditedTime((time) => ({
                    ...time,
                    service: e.target.value,
                  }));
                  selectedTimeList.forEach(({ day, index }) => {
                    setChangedValues([...changedValues, { day: day, index: index }]);
                  });
                }}
              />
            </div>

            {serviceList.map((_, index) => {
              const currentTime = { day: day, index: index };
              const isSelected = selectedTimeList.find((time) => currentTime.day === time.day && currentTime.index === time.index) !== undefined;

              const weekDay = week[parseDate(day).getDay()];
              const schedule = professional.getSchedule()[day];
              const scheduleItem = schedule?.[index + startIndex];
              const available = scheduleItem === undefined || editedTime.edited === false;

              if (isSelected) {
                scheduleItem.service = editedTime.service;
                scheduleItem.edited = true;
                scheduleItem.client = user.getId();
              }

              const serviceName = isSelected
                ? editedTime.service || (available ? "Disponível" : scheduleItem?.edited ? scheduleItem.service : serviceCache[scheduleItem?.service]?.getName())
                : available
                ? "Disponível"
                : scheduleItem?.edited
                ? scheduleItem.service
                : serviceCache[scheduleItem?.service]?.getName();

              const clientName = editedTime.service === "" ? clientCache[scheduleItem?.client]?.getName() : user.getName();

              return (
                <DoubleItemButton
                  leftButtonTitle={{
                    title1: weekDay,
                    title2: timeList[index + startIndex],
                  }}
                  title={serviceName}
                  subtitle={clientName}
                  isSelected={isSelected}
                  onClick={() => {
                    if (selectedTimeList.some((time) => time.day === currentTime.day && time.index === currentTime.index)) {
                      setSelectedTimeList(selectedTimeList.filter((time) => time.day !== currentTime.day || time.index !== currentTime.index));
                    } else {
                      setEditedTime((time) => ({
                        ...time,
                        edited: true,
                        service: "",
                      }));
                      if (editedTime.service !== "") {
                        setSelectedTimeList([currentTime]);
                      } else {
                        setSelectedTimeList([...selectedTimeList, currentTime]);
                      }
                    }
                  }}
                />
              );
            })}
            {/* 26/10 - Tomorrow ill do the functions on this one, after this it will be just some debug and its done */}
            <DoubleButton title={["Salvar Alterações", "Desbloquear Horários"]} onClick={[async () => {}, () => {}]} hide={[false, selectedTimeList.length == 0]} />
          </div>
        );
      case 3: //Edit time tab
        const isUnblockable = selectedTimeList.some(({ index }) => {
          const schedule =
            professional.getSchedule()[
              selectedDay.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            ];
          const scheduleItem = schedule?.[index];
          const available = scheduleItem === undefined || editedTime.edited === false;

          return !available; // Check if the item is not available
        });
        return (
          <div className='edit-schedule-time-tab'>
            <Header
              title={`Editar Horários - ${selectedDay.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}`}
              icon={""}
              onClickReturn={() => {
                setTab(1);
                setSelectedTimeList([]);
                setEditedTime((time) => ({
                  ...time,
                  edited: true,
                  service: "",
                }));
              }}
              onClickIcon={() => {}}
            />
            <div className='sf-value-block'>
              <img className='sf-value-icon' src={clock} />
              <input
                className='sf-value-input'
                placeholder='Digitar Serviço'
                onChange={(e) => {
                  setEditedTime((time) => ({
                    ...time,
                    service: e.target.value,
                  }));
                  selectedTimeList.forEach(({ day, index }) => {
                    setChangedValues([...changedValues, { day: day, index: index }]);
                  });
                }}
              />
            </div>
            {selectedTimeList.map(({ day, index }) => {
              const weekDay = capitalize(week[selectedDay.getDay()]);

              const schedule =
                professional.getSchedule()[
                  selectedDay.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                ];
              const scheduleItem = schedule?.[index];
              const available = scheduleItem === undefined || editedTime.edited === false;

              const serviceName = editedTime.service === "" ? (available ? "Disponível" : scheduleItem?.edited ? scheduleItem?.service : serviceCache[scheduleItem?.service]?.getName()) : editedTime.service;
              const clientName = editedTime.service === "" ? clientCache[scheduleItem?.client]?.getName() : user.getName();

              return (
                <DoubleItemButton
                  leftButtonTitle={{
                    title1: weekDay,
                    title2: timeList[index],
                  }}
                  title={serviceName}
                  subtitle={clientName}
                  isSelected={false}
                  onClick={() => {}}
                />
              );
            })}
            <DoubleButton
              title={["Salvar Alterações", "Desbloquear Horários"]}
              onClick={[
                async () => {
                  setLoading(true);
                  var updatePromises: any[] = [];
                  const scheduleValue = professional.getSchedule();

                  if (!editedTime.edited) {
                    updatePromises = selectedTimeList.map(async ({ day, index }) => {
                      if (scheduleValue[day][index]) {
                        return await professional.deleteScheduleIndex(day, index.toString());
                      }
                    });
                  } else {
                    updatePromises = selectedTimeList.map(async ({ day, index }) => {
                      return await professional.updateSchedule(day, index.toString(), editedTime);
                    });
                  }
                  await Promise.all(updatePromises);
                  const filteredArray = changedValues.filter((item) => {
                    return !selectedTimeList.some((selectedItem) => {
                      return item.day === selectedItem.day && item.index === selectedItem.index;
                    });
                  });
                  setChangedValues(filteredArray);
                  setSelectedTimeList([]);
                  setEditedTime((time) => ({
                    ...time,
                    edited: true,
                    service: "",
                  }));
                  setLoading(false);
                },
                () => {
                  selectedTimeList.forEach(({ day, index }) => {
                    setChangedValues([...changedValues, { day: day, index: index }]);
                  });
                  setEditedTime((time) => ({
                    ...time,
                    edited: false,
                    service: "",
                  }));
                },
              ]}
              hide={[editedTime.service === "" || editedTime.edited, !isUnblockable]}
            />
          </div>
        );
      default:
        return <div />;
    }
  };
  /*
  const oldtabHandler = () => {
    switch (tab) {
      case 0:
        return (
          <div className='schedule-page'>
            <Header
              title={"Minha agenda"}
              icon={edit}
              onClickReturn={() => {
                navigate(-1);
              }}
              onClickIcon={() => {
                setTab(1);
              }}
            />
            {Object.entries(professional.getSchedule()).map(([date, schedule]) => {
              const formattedDay = capitalize(parseDate(date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" }).replace(/,/g, " -"));
              return (
                <div className='sp-day-block'>
                  <SubHeader
                    title={formattedDay}
                    buttonTitle={hiddenDayList.includes(formattedDay) ? "Exibir" : "Ocultar"}
                    onClick={() => {
                      if (hiddenDayList.includes(formattedDay)) {
                        const updatedHidden = hiddenDayList.filter((day) => day !== formattedDay);
                        setHiddenDayList(updatedHidden);
                      } else {
                        const updatedHidden = [...hiddenDayList, formattedDay];
                        setHiddenDayList(updatedHidden);
                      }
                    }}
                  />
                  {findRepetitionBlocks(schedule).map((block) => {
                    console.log(block);
                    if (hiddenDayList.includes(formattedDay)) return null;
                    const timeIndex = block[0];
                    const timeEnd = block[1];
                    const scheduleDate = schedule[block[0]];

                    if (serviceCache[scheduleDate.service] === undefined && !scheduleDate.edited) {
                      setLoading(true);
                      const service = new Service();
                      service.getService(scheduleDate.service).then(() => {
                        const serviceList = serviceCache;
                        serviceList[service.getId()] = service;
                        setServiceCache(serviceList);
                        setLoading(false);
                      });
                    }
                    if (clientCache[scheduleDate.client] === undefined) {
                      setLoading(true);
                      const user = new User();
                      user.getUser(scheduleDate.client).then(() => {
                        const clientList = clientCache;
                        clientList[user.getId()] = user;
                        setClientCache(clientList);
                        setLoading(false);
                      });
                    }
                    return (serviceCache[scheduleDate.service] !== undefined || scheduleDate.edited) && clientCache[scheduleDate.client] !== undefined ? (
                      <div
                        className='sp-time-row'
                        onClick={() => {
                          const currentBlock = {
                            client: scheduleDate.client,
                            service: scheduleDate.service,
                            timeRange: block,
                          };
                          if (isEqual(selectedBlock, currentBlock)) setSelectedBlock(null);
                          else {
                            setSelectedBlock(currentBlock);
                          }
                        }}
                      >
                        <div className={"gp-time-button" + (selectedBlock?.timeRange[0] === timeIndex ? " selected" : "")}>
                          <p className='gpt-title'>{capitalize(parseDate(date).toLocaleDateString("pt-BR", { weekday: "long" }))}</p>
                          <p className='gpt-title'>
                            {timeList[timeIndex]} - {timeList[timeEnd]}
                          </p>
                        </div>
                        <div className='gpt-row-item'>
                          <ItemButton title={scheduleDate.edited ? scheduleDate.service : serviceCache[scheduleDate.service].getName()} subtitle={clientCache[scheduleDate.client].getName()} isSelected={selectedBlock?.timeRange[0] === timeIndex} onClick={() => {}} />
                        </div>
                      </div>
                    ) : (
                      <LoadingScreen />
                    );
                  })}
                </div>
              );
            })}
            <SubHeader
              title={formattedDate(dayList[dayList.length - 1])}
              buttonTitle={"Carregar próxima semana"}
              onClick={async () => {
                setLoading(true);

                const scheduleDays = Array.from({ length: 8 }, (_, index) => {
                  const currentDate = new Date(dayList[dayList.length - 1]);
                  currentDate.setDate(currentDate.getDate() + index);
                  return currentDate;
                });

                setDayList([...dayList, ...scheduleDays]);

                await Promise.all(
                  scheduleDays.map(async (scheduleDay) => {
                    const formattedDay = scheduleDay.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
                    await professional.getScheduleDay(formattedDay);

                    if (professional.getSchedule()[formattedDay] === undefined) {
                      //remove the scheduleDay from professional
                      const updatedSchedule = professional.getSchedule();
                      delete updatedSchedule[formattedDay];

                      professional.setSchedule(updatedSchedule);
                    }
                  })
                );

                setLoading(false);
              }}
            />
            <BottomButton
              hide={selectedBlock === null}
              title={"Editar"}
              onClick={() => {
                setTab(2);
              }}
            />
          </div>
        );
      case 1:
        return (
          <div className='schedule-edit-tab'>
            <Header
              title={"Minha Agenda"}
              icon={save}
              onClickReturn={() => {
                setTab(0);
              }}
              onClickIcon={async () => {
                setLoading(true);
                const updatePromises = selectedTimeList.map(async ({ day, index }) => {
                  return await professional.updateSchedule(day, index.toString(), professional.getSchedule()[day][index]);
                });
                await Promise.all(updatePromises);
                setLoading(false);
                setSelectedTimeList([]);
              }}
            />
            {dayList.map((day) => {
              return (
                <div className='sp-day-block'>
                  <SubHeader
                    title={formattedDate(day)}
                    buttonTitle={hiddenDayList.includes(formattedDate(day)) ? "Exibir" : "Ocultar"}
                    onClick={() => {
                      if (hiddenDayList.includes(formattedDate(day))) {
                        const updatedHidden = hiddenDayList.filter((day1) => day1 !== formattedDate(day));
                        setHiddenDayList(updatedHidden);
                      } else {
                        const updatedHidden = [...hiddenDayList, formattedDate(day)];
                        setHiddenDayList(updatedHidden);
                      }
                    }}
                  />
                  <div className='sp-day-list'>
                    {timeList.map((time, index) => {
                      if (hiddenDayList.includes(formattedDate(day))) return null;
                      if (professional.getShift()[day.getDay()][0] === false) return null;
                      const startTime = Math.floor(professional.getStartHours()[day.getDay()] / 2) * 6;
                      const endTime = Math.floor((professional.getShift()[day.getDay()].length - 1) / 2) * 6 + startTime;
                      if (startTime > index) return null;
                      if (endTime < index) return null;

                      const scheduleDay = day.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
                      const schedData = professional.getSchedule()?.[scheduleDay]?.[index];

                      const available = schedData === undefined;
                      const serviceName = schedData?.edited ? schedData?.service : serviceCache[schedData?.service]?.getName();
                      const clientName = clientCache[schedData?.client]?.getName();

                      const existingIndex = selectedTimeList.findIndex((item) => item.day === scheduleDay && item.index === index);
                      console.log(selectedTimeList.length);
                      return (
                        <div
                          className='sp-time-row'
                          onClick={() => {
                            const timeValue = {
                              day: scheduleDay,
                              index: index,
                            };

                            if (existingIndex !== -1) {
                              const updatedList = [...selectedTimeList];
                              updatedList.splice(existingIndex, 1);
                              setSelectedTimeList(updatedList);
                            } else {
                              setSelectedTimeList([...selectedTimeList, timeValue]);
                            }
                          }}
                        >
                          <div className={"gp-time-button" + (existingIndex !== -1 ? " selected" : "")}>
                            <p className='gpt-title'>{capitalize(day.toLocaleString("pt-BR", { weekday: "long" }))}</p>
                            <p className='gpt-title'>{time}</p>
                          </div>
                          <div className='gpt-row-item'>
                            <ItemButton title={available ? "Disponível" : serviceName} subtitle={available ? "" : clientName} isSelected={existingIndex !== -1} onClick={() => {}} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <DoubleButton
              title={["Bloquear", "Editar"]}
              onClick={[
                () => {
                  const blockedValue = {
                    service: "Bloqueado",
                    client: user.getId(),
                    edited: true,
                  };
                  selectedTimeList.forEach((time) => {
                    if (professional.getSchedule()?.[time.day]?.[time.index] === undefined) {
                      const blockedSchedule = professional.getSchedule();

                      if (!blockedSchedule[time.day]) {
                        blockedSchedule[time.day] = {};
                      }

                      blockedSchedule[time.day][time.index] = blockedValue;

                      professional.setSchedule(blockedSchedule);
                      SetProfessional(new Professional(professional));
                    }
                  });

                  setSelectedTimeList([]);
                },
                () => {
                  setTab(2);
                },
              ]}
              hide={[selectedTimeList.length <= 0, selectedTimeList.length <= 0]}
            />
          </div>
        );
      case 2:
        const firstDay = selectedTimeList[0]?.day;
        const firstIndex = selectedTimeList[0]?.index;
        return (
          <div className='schedule-edit'>
            <Header
              title={"Editar Horários"}
              icon={""}
              onClickReturn={() => {
                setTab(1);
                setSelectedTimeList([]);
              }}
              onClickIcon={() => {}}
            />
            <div className='sf-value-block'>
              <img className='sf-value-icon' src={clock} />
              <input
                className='sf-value-input'
                placeholder='Digitar Serviço'
                //value={professional.getSchedule()?.[firstDay]?.[firstIndex]?.service}
                onChange={(e) => {
                  const editedValue = {
                    service: e.target.value,
                    client: user.getId(),
                    edited: true,
                  };
                  selectedTimeList.map(({ day, index }) => {
                    const scheduleValue = professional.getSchedule();
                    if (!scheduleValue[day]) {
                      scheduleValue[day] = {};
                    }
                    scheduleValue[day][index] = editedValue;

                    professional.setSchedule(scheduleValue);
                    SetProfessional(new Professional(professional));
                  });
                }}
              />
            </div>
            {selectedTimeList.map(({ day, index }) => {
              console.log(professional.getSchedule()?.[day]?.[index]?.service);
              return (
                <div className='sp-time-row' onClick={() => {}}>
                  <div className={"gp-time-button" + (false ? " selected" : "")}>
                    <p className='gpt-title'>{day}</p>
                    <p className='gpt-title'>{timeList[index]}</p>
                  </div>
                  <div className='gpt-row-item'>
                    <ItemButton
                      title={professional.getSchedule()?.[day]?.[index]?.edited ? professional.getSchedule()?.[day]?.[index]?.service : serviceCache[professional.getSchedule()?.[day]?.[index]?.service]?.getName() || "Disponível"}
                      subtitle={clientCache[professional.getSchedule()?.[day]?.[index]?.client]?.getName()}
                      isSelected={false}
                      onClick={() => {}}
                    />
                  </div>
                </div>
              );
            })}
            <DoubleButton
              title={["Salvar Alterações", "Desbloquear Horários"]}
              onClick={[
                async () => {
                  setLoading(true);
                  const updatePromises = selectedTimeList.map(async ({ day, index }) => {
                    return await professional.updateSchedule(day, index.toString(), professional.getSchedule()[day][index]);
                  });
                  await Promise.all(updatePromises);
                  setLoading(false);
                  setSelectedTimeList([]);
                },
                async () => {
                  setLoading(true);
                  const updatePromises = selectedTimeList.map(async ({ day, index }) => {
                    const scheduleValue = professional.getSchedule();
                    delete scheduleValue[day][index];
                    professional.setSchedule(scheduleValue);
                    SetProfessional(new Professional(professional));

                    return await professional.deleteScheduleIndex(day, index.toString());
                  });
                  await Promise.all(updatePromises);
                  setLoading(false);
                },
              ]}
              hide={[professional.getSchedule()?.[firstDay]?.[firstIndex]?.service === "", false]}
            />
          </div>
        );
      default:
        return <div />;
    }
  };*/

  return loading ? <LoadingScreen /> : tabHandler();
}
