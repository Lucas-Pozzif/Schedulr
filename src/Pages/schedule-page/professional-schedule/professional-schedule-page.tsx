import { useEffect, useState } from "react";
import { User } from "../../../Classes/user";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "../../../Components/loading/loading-screen/loading-screen";
import { Professional } from "../../../Classes/professional";
import { Header } from "../../../Components/header/header";
import { SubHeader } from "../../../Components/sub-header/sub-header";
import { parseDate } from "../../../Function/parse-date/parse-date";
import { capitalize } from "../../../Function/capitalize/capitalize";
import { Service } from "../../../Classes/service";
import { BottomButton } from "../../../Components/buttons/bottom-button/bottom-button";
import { findRepetitionBlocks } from "../../../Function/find-repetition-blocks/find-repetition-blocks";
import { formattedDate } from "../../../Function/formatted-date/formatted-date";
import { DoubleButton } from "../../../Components/buttons/double-button/double-button";
import { DoubleItemButton } from "../../../Components/buttons/double-item-button/double-item-button";
import { Carousel } from "../../../Components/carousel/carousel";

import "../schedule-page.css";

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
      Object.entries(professional.getSchedule()).map(([date, _]) => {
        const formattedDay = formattedDate(parseDate(date));
        setDisplayList([...displayList, formattedDay]);
      });

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
                setSelectedTimeList([]);
                setLoading(false);
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
            <SubHeader
              title={formattedDate(selectedDay)}
              buttonTitle={"Selecionar Tudo"}
              onClick={() => {
                const allTimes = timeList
                  .map((time, index) => {
                    const dayShift = professional.getShift()[selectedDay.getDay()];
                    const startHours = professional.getStartHours()[selectedDay.getDay()];

                    const startTime = Math.floor(startHours / 2) * 6;
                    const endTime = Math.floor((dayShift.length - 1) / 2) * 6 + startTime;
                    const schedule =
                      professional.getSchedule()[
                        selectedDay.toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                      ];
                    const scheduleItem = schedule?.[index];

                    if (!dayShift[0] || startTime > index || endTime < index) return;

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
                console.log(selectedTimeList, allTimes);

                setSelectedTimeList([...allTimes]);
              }}
            />
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

        const hideSaveButton = () => {
          const hide = serviceList.map((_, index) => {
            const schedule = professional.getSchedule()[day];
            const scheduleItem = schedule?.[index + startIndex];
            return scheduleItem.service === "" && scheduleItem.edited !== false;
          });
          return hide.includes(true);
        };

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
            </div>

            {serviceList.map((_, index) => {
              const currentTime = { day: day, index: index + startIndex };
              const isSelected = selectedTimeList.find((time) => currentTime.day === time.day && currentTime.index === time.index) !== undefined;

              const weekDay = week[parseDate(day).getDay()];
              const schedule = professional.getSchedule()[day];
              const scheduleItem = schedule?.[index + startIndex];
              const available = scheduleItem === undefined || editedTime.edited === false;

              if (isSelected) {
                scheduleItem.service = editedTime.service;
                scheduleItem.edited = editedTime.edited;
                scheduleItem.client = user.getId();
              }

              const serviceName = isSelected
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
                  }}
                />
              );
            })}
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
              hide={[hideSaveButton(), selectedTimeList.length == 0]}
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
          <div className='edit-schedule-time-tab'>
            <Header
              title={`Editar Horários - ${selectedDay.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}`}
              icon={""}
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
              hide={[editedTime.service === "" || (editedTime.edited && editedTime.service === ""), !isUnblockable]}
            />
          </div>
        );
      default:
        return <div />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
