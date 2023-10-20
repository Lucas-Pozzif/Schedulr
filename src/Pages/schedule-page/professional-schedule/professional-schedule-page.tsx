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

var isEqual = require("lodash.isequal");

export function ProfessionalSchedulePage() {
  const [user, setUser] = useState(new User());
  const [professional, SetProfessional] = useState<Professional>(new Professional());
  const [loading, setLoading] = useState(false);
  const [dayList, setDayList] = useState([new Date()]);
  const [hiddenDayList, setHiddenDayList] = useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<{ client: string; service: string; timeRange: number[] } | null>(null);
  const [selectedTimeList, setSelectedTimeList] = useState<{day:Date; index:number}[]>([]);
  const [tab, setTab] = useState(0);

  const [serviceCache, setServiceCache] = useState<{ [serviceId: string]: Service }>({});
  const [clientCache, setClientCache] = useState<{ [clientId: string]: User }>({});

  const { professionalId } = useParams();
  const navigate = useNavigate();

  const save = require("../../../Assets/save.png");
  const edit = require("../../../Assets/edit.png");

  useEffect(() => {
    setLoading(true);
    const fetchUserAndProfessional = async () => {
      onAuthStateChanged(auth, async (client) => {
        if (!client) return;

        await user.getUser(client.uid);
        setUser(new User(user));
      });

      const day = new Date();

      // Fetch the schedule for the next 10 days
      const scheduleDays = Array.from({ length: 10 }, (_, index) => {
        const currentDate = new Date(day);
        currentDate.setDate(day.getDate() + index);
        return currentDate;
      });
      setDayList(scheduleDays);

      await professional.getProfessional(professionalId || "");
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
      SetProfessional(new Professional(professional));
      setLoading(false);
    };

    fetchUserAndProfessional();
  }, []);
  const timeList: string[] = [];

  for (let i = 0; i < 24; i++) {
    timeList.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
  }

  const tabHandler = () => {
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
                    if (hiddenDayList.includes(formattedDay)) return null;
                    const timeIndex = block[0];
                    const timeEnd = block[1];
                    const scheduleDate = schedule[block[0]];

                    if (serviceCache[scheduleDate.service] === undefined) {
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
                    return serviceCache[scheduleDate.service] !== undefined && clientCache[scheduleDate.client] !== undefined ? (
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
                          <ItemButton title={serviceCache[scheduleDate.service].getName()} subtitle={clientCache[scheduleDate.client].getName()} isSelected={selectedBlock?.timeRange[0] === timeIndex} onClick={() => {}} />
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
              onClickIcon={() => {}}
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
                      const available = professional.getSchedule()?.[scheduleDay]?.[index] === undefined;
                      const serviceName = serviceCache[professional.getSchedule()?.[scheduleDay]?.[index]?.service]?.getName();
                      const clientName = clientCache[professional.getSchedule()?.[scheduleDay]?.[index]?.client]?.getName();

                      return (
                        <div className='sp-time-row' onClick={() => {
                          //Fazer amanhã
                        }}>
                          <div className={"gp-time-button" + (false ? " selected" : "")}>
                            <p className='gpt-title'>{capitalize(day.toLocaleString("pt-BR", { weekday: "long" }))}</p>
                            <p className='gpt-title'>{time}</p>
                          </div>
                          <div className='gpt-row-item'>
                            <ItemButton title={available ? "Disponível" : serviceName} subtitle={available ? "" : clientName} isSelected={false} onClick={() => {}} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      default:
        return <div />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
