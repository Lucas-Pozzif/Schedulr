import "../schedule-page.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { capitalize, findRepetitionBlocks, formattedDate, parseDate } from "../../../Function/functions-imports";
import { editSquare, fullDays, longTimeArray, save, week } from "../../../_global";
import { Professional, Service, User } from "../../../Classes/classes-imports";
import { BottomButton, Carousel, DoubleButton, DualList, GenericHeader, Line, SchedulePageLoading, SubHeader } from "../../../Components/component-imports";

import { auth } from "../../../Services/firebase/firebase";
import { ErrorPage } from "../../error-page/error-page";

var isEqual = require("lodash.isequal");

export function ProfessionalSchedulePage() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const [user, setUser] = useState(new User());
  const [professional, SetProfessional] = useState(new Professional());

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
      Object.entries(professional.getSchedule()).forEach(([date, _]) => {
        setDisplayList((prevDisplayList) => [...prevDisplayList, date]);
      });

      setEditedTime((time) => ({
        ...time,
        client: user.getId(),
      }));
      setLoading(false);
    });
  }, [displayList, serviceCache, user, clientCache, professional, professionalId]);

  const timeList: string[] = [];

  const loadWeek = async () => {
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
  };

  const saveSchedule = async () => {
    if (changedValues.length === 0) return;
    setLoading(true);
    const updatePromises = changedValues.map(async ({ day, index }) => {
      return await professional.updateSchedule(day, index.toString(), professional.getSchedule()[day][index]);
    });

    await Promise.all(updatePromises);
    setChangedValues([]);
    setSelectedTimeList([]);
    setLoading(false);
  };

  const tabHandler = () => {
    switch (tab) {
      case 0: // Schedule tab
        return (
          <div className='tab'>
            <GenericHeader title={`Agenda de ${professional.getName()}`} icon={editSquare} onClickReturn={() => navigate(-1)} onClickIcon={() => setTab(1)} />
            {Object.entries(professional.getSchedule()).map(([date, schedule], index) => {
              // This is a day array
              const formattedDay = formattedDate(parseDate(date));
              const hiddenMessage = displayList.includes(date) ? "Ocultar" : "Exibir";
              const weekIndex = parseDate(date).getDay();

              return (
                <div key={index} className='sp-day'>
                  <SubHeader
                    title={formattedDay}
                    buttonTitle={hiddenMessage}
                    onClick={() => {
                      const updatedList = displayList.includes(date) ? displayList.filter((day) => day !== date) : [...displayList, formattedDay];
                      setDisplayList(updatedList);
                    }}
                  />
                  <DualList
                    items={findRepetitionBlocks(schedule)
                      .map((block) => {
                        if (!displayList.includes(date)) return null;

                        const firstIndex = block[0];
                        const lastIndex = block[1];
                        const scheduleItem = schedule[firstIndex];

                        const serviceName = scheduleItem.edited ? scheduleItem.service : serviceCache[scheduleItem.service].getName();
                        const clientName = clientCache[scheduleItem.client]?.getName();

                        const currentBlock = {
                          client: scheduleItem.client,
                          service: scheduleItem.service,
                          timeRange: block,
                          day: date,
                        };

                        return {
                          title: serviceName,
                          subtitle: clientName,
                          select: isEqual(selectedBlock, currentBlock),
                          onClick: () => (isEqual(selectedBlock, currentBlock) ? setSelectedBlock(null) : setSelectedBlock(currentBlock)),
                          leftButton: {
                            title: week[weekIndex],
                            subtitle: `${longTimeArray[firstIndex]} - ${longTimeArray[lastIndex]}`,
                          },
                        };
                      })
                      .filter((item): item is NonNullable<typeof item> => item !== null)}
                  />
                </div>
              );
            })}
            <SubHeader title={formattedDate(dayList[dayList.length - 1])} buttonTitle={"Próxima semana"} onClick={async () => loadWeek()} />
            <BottomButton hide={selectedBlock === null} title={"Editar"} onClick={() => setTab(2)} />
          </div>
        );
      case 1: // Edit schedule tab
        return (
          <div className='tab'>
            <GenericHeader title={`Agenda de ${professional.getName()}`} icon={changedValues.length === 0 ? "" : save} onClickReturn={() => setTab(0)} onClickIcon={() => saveSchedule()} />
            <Carousel
              items={[
                ...dayList.map((day) => {
                  return {
                    title: fullDays[day.getDay()],
                    subtitle: day.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit" }),
                    select: selectedDay === day,
                    onClick: () => {
                      setSelectedTimeList([]);
                      setSelectedDay(day);
                    },
                  };
                }),
                {
                  title: "Carregar semana",
                  select: false,
                  onClick: async () => {
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

                      scheduleEntries.forEach(([_, schedule]) => {
                        const scheduleItemEntries = Object.entries(schedule);
                        scheduleItemEntries.forEach(([_, scheduleItem]) => {
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
                  },
                },
              ]}
            />
            <SubHeader
              title={formattedDate(selectedDay)}
              buttonTitle={"Selecionar Tudo"}
              onClick={() => {
                const allTimes = longTimeArray
                  .map((_, index) => {
                    const dayShift = professional.getShift()[selectedDay.getDay()];
                    const startHours = professional.getStartHours()[selectedDay.getDay()];

                    const startTime = Math.floor(startHours / 2) * 6;
                    const endTime = Math.floor((dayShift.length - 1) / 2) * 6 + startTime;

                    if (!dayShift[0] || startTime > index || endTime < index) return null;

                    return {
                      index: index,
                      day: selectedDay.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      }),
                    };
                  })
                  .filter((value): value is { day: string; index: number } => value !== undefined);

                setSelectedTimeList([...allTimes]);
              }}
            />
            <DualList
              items={longTimeArray
                .map((time, index) => {
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
                  const selected = selectedTimeList.find((time) => currentTime.day === time.day && currentTime.index === time.index) !== undefined;

                  return {
                    leftButton: {
                      title: weekDay,
                      subtitle: time,
                    },
                    title: serviceName,
                    subtitle: clientName,
                    select: selected,
                    onClick: () => {
                      if (selectedTimeList.some((time) => time.day === currentTime.day && time.index === currentTime.index)) {
                        setSelectedTimeList(selectedTimeList.filter((time) => time.day !== currentTime.day || time.index !== currentTime.index));
                      } else {
                        setSelectedTimeList([...selectedTimeList, currentTime]);
                      }
                    },
                  };
                })
                .filter((item): item is NonNullable<typeof item> => item !== null)}
            />
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

                      const newValues = selectedTimeList.map((time) => {
                        const updatedChangedValues = changedValues.find((value) => isEqual(time, value));
                        if (!updatedChangedValues) {
                          return time;
                        }
                        return undefined;
                      });

                      const filteredNewValues = newValues.filter((value): value is { day: string; index: number } => value !== undefined);

                      setChangedValues([...changedValues, ...filteredNewValues]);
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
      case 2:
        const day = selectedBlock!.day;

        const client = selectedBlock!.client;

        const startIndex = selectedBlock!.timeRange[0];
        const endIndex = selectedBlock!.timeRange[1];
        const serviceSpan = endIndex - startIndex + 1;

        const blockTime = {
          service: "",
          client: client,
          edited: true,
        };
        const serviceList = Array.from({ length: serviceSpan }, (_) => {
          return blockTime;
        });

        const hiddenSaveButton = () => {
          const hidden = serviceList.map((_, index) => {
            const schedule = professional.getSchedule()[day];
            const scheduleItem = schedule?.[index + startIndex];
            return scheduleItem.service === "" && scheduleItem.edited !== false;
          });
          return hidden.includes(true);
        };

        return (
          <div className='tab'>
            <GenericHeader title={"Editar Bloco de Serviços"} onClickReturn={() => setTab(0)} />
            <div className='sp-input-block'>
              <input
                className='sp-input'
                placeholder='Digitar Serviço'
                value={editedTime.service}
                onChange={(e) => {
                  setEditedTime((time) => ({
                    ...time,
                    service: e.target.value,
                  }));
                  const newValues = selectedTimeList.map((time) => {
                    const updatedChangedValues = changedValues.find((value) => isEqual(time, value));
                    if (!updatedChangedValues) {
                      return time;
                    }
                    return undefined;
                  });

                  const filteredNewValues = newValues.filter((value): value is { day: string; index: number } => value !== undefined);

                  setChangedValues([...changedValues, ...filteredNewValues]);
                }}
              />
              <Line />
            </div>
            <SubHeader
              title={formattedDate(selectedDay)}
              buttonTitle={"Selecionar Tudo"}
              onClick={() => {
                const allTimes = serviceList.map((_, index) => {
                  const realIndex = index + startIndex;
                  return {
                    index: realIndex,
                    day: day,
                  };
                });
                setSelectedTimeList([...allTimes]);
              }}
            />
            <DualList
              items={serviceList.map((_, index) => {
                const currentTime = { day: day, index: index + startIndex };
                const selected = selectedTimeList.find((time) => currentTime.day === time.day && currentTime.index === time.index) !== undefined;

                const weekDay = week[parseDate(day).getDay()];
                const schedule = professional.getSchedule()[day];
                const scheduleItem = schedule?.[index + startIndex];

                if (selected) {
                  scheduleItem.service = editedTime.service;
                  scheduleItem.edited = editedTime.edited;
                  scheduleItem.client = user.getId();
                }

                const serviceName = selected
                  ? editedTime.edited
                    ? editedTime.service
                    : "Disponível"
                  : scheduleItem?.edited
                  ? scheduleItem.service !== ""
                    ? scheduleItem.service
                    : "Disponível"
                  : scheduleItem.service !== ""
                  ? serviceCache[scheduleItem?.service]?.getName()
                  : "Disponível";
                const clientName = editedTime.service === "" ? clientCache[scheduleItem?.client]?.getName() : user.getName();

                return {
                  leftButton: {
                    title: weekDay,
                    subtitle: timeList[index + startIndex],
                  },
                  title: serviceName,
                  subtitle: clientName,
                  select: selected,
                  onClick: () => {
                    if (selectedTimeList.some((time) => time.day === currentTime.day && time.index === currentTime.index)) {
                      setSelectedTimeList(selectedTimeList.filter((time) => time.day !== currentTime.day || time.index !== currentTime.index));
                    } else {
                      if (editedTime.service !== "" || !editedTime.edited) {
                        setSelectedTimeList([currentTime]);
                      } else {
                        setSelectedTimeList([...selectedTimeList, currentTime]);
                      }
                      setEditedTime((time) => ({
                        ...time,
                        edited: true,
                        service: "",
                      }));
                    }
                  },
                };
              })}
            />
            <DoubleButton
              title={["Salvar Alterações", "Desbloquear Horários"]}
              onClick={[
                async () => {
                  setLoading(true);
                  var updatePromises: any[] = [];

                  updatePromises = serviceList.map(async (_, index) => {
                    const realIndex = index + startIndex;
                    const schedule = professional.getSchedule()[day];
                    const scheduleItem = schedule?.[realIndex];

                    if (scheduleItem.edited === true) {
                      return await professional.updateSchedule(day, realIndex.toString(), scheduleItem);
                    } else if (scheduleItem.edited === false) {
                      return await professional.deleteScheduleIndex(day, realIndex.toString());
                    }
                  });
                  const updatedChangedValues = changedValues.filter((value) => {
                    return !serviceList.some((_, index) => isEqual(value, { index: index + startIndex, day: day }));
                  });

                  await Promise.all(updatePromises);
                  setChangedValues(updatedChangedValues);
                  setSelectedTimeList([]);
                  setEditedTime((time) => ({
                    ...time,
                    edited: true,
                    service: "",
                  }));
                  setTab(0);
                  setLoading(false);
                },
                () => {
                  selectedTimeList.forEach((time) => {
                    const schedule = professional.getSchedule()[time.day];
                    const scheduleItem = schedule?.[time.index];

                    scheduleItem.service = "";
                    scheduleItem.edited = false;
                    scheduleItem.client = "";

                    setEditedTime({
                      edited: false,
                      service: "",
                      client: "",
                    });
                  });
                  const newValues = selectedTimeList.map((time) => {
                    const updatedChangedValues = changedValues.find((value) => isEqual(time, value));
                    if (!updatedChangedValues) {
                      return time;
                    }
                    return undefined;
                  });

                  const filteredNewValues = newValues.filter((value): value is { day: string; index: number } => value !== undefined);

                  setChangedValues([...changedValues, ...filteredNewValues]);
                },
              ]}
              hide={[hiddenSaveButton(), selectedTimeList.length === 0]}
            />
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
          <div className='tab'>
            <GenericHeader
              title={`Editar Horários - ${selectedDay.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}`}
              onClickReturn={() => {
                setTab(1);
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
              }}
            />
            <div className='sp-input-block'>
              <input
                className='sp-input'
                placeholder='Digitar Serviço'
                onChange={(e) => {
                  setEditedTime((time) => ({
                    ...time,
                    service: e.target.value,
                  }));

                  const newValues = selectedTimeList.map((time) => {
                    const updatedChangedValues = changedValues.find((value) => isEqual(time, value));
                    if (!updatedChangedValues) {
                      return time;
                    }
                    return undefined;
                  });

                  const filteredNewValues = newValues.filter((value): value is { day: string; index: number } => value !== undefined);

                  setChangedValues([...changedValues, ...filteredNewValues]);
                }}
              />
              <Line />
            </div>
            <DualList
              items={selectedTimeList.map(({ day, index }) => {
                const weekDay = capitalize(week[selectedDay.getDay()]);

                const schedule =
                  professional.getSchedule()[
                    selectedDay.toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  ] || {};

                const scheduleItem = schedule[index] || {
                  service: "",
                  edited: false,
                  client: user.getId(),
                };

                const available = scheduleItem === undefined || editedTime.edited === false;

                const serviceName = editedTime.service === "" ? (available ? "Disponível" : scheduleItem?.edited ? scheduleItem?.service : serviceCache[scheduleItem?.service]?.getName()) : editedTime.service;
                const clientName = editedTime.service === "" ? clientCache[scheduleItem?.client]?.getName() : user.getName();
                if (!schedule[index]) {
                  schedule[index] = scheduleItem;
                  professional.getSchedule()[
                    selectedDay.toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  ] = schedule;
                }

                if (scheduleItem) {
                  scheduleItem.service = editedTime.service;
                  scheduleItem.edited = editedTime.edited;
                  scheduleItem.client = user.getId();
                }

                return {
                  leftButton: {
                    title: weekDay,
                    subtitle: timeList[index],
                  },
                  title: serviceName,
                  subtitle: clientName,
                };
              })}
            />
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
                  setTab(1);
                  setLoading(false);
                },
                () => {
                  const newValues = selectedTimeList.map((time) => {
                    const updatedChangedValues = changedValues.find((value) => isEqual(time, value));
                    if (!updatedChangedValues) {
                      return time;
                    }
                    return undefined;
                  });

                  const filteredNewValues = newValues.filter((value): value is { day: string; index: number } => value !== undefined);

                  setChangedValues([...changedValues, ...filteredNewValues]);
                  setEditedTime((time) => ({
                    ...time,
                    edited: false,
                    service: "",
                  }));
                },
              ]}
              hide={[(editedTime.edited === true && editedTime.service === "") || (editedTime.edited === false && editedTime.service !== ""), !isUnblockable]}
            />
          </div>
        );
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <SchedulePageLoading /> : tabHandler();
}
