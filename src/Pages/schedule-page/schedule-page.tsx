import { useEffect, useState } from "react";
import { User } from "../../Classes/user";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Professional } from "../../Classes/professional";
import { Header } from "../../Components/header/header";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { parseDate } from "../../Function/parse-date/parse-date";
import { capitalize } from "../../Function/capitalize/capitalize";
import { Service } from "../../Classes/service";
import { ScheduleItem } from "../../Classes/schedule";

import "./schedule-page.css";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";

var isEqual = require("lodash.isequal");

export function SchedulePage() {
  const [user, setUser] = useState(new User());
  const [professional, SetProfessional] = useState<Professional>(new Professional());
  const [loading, setLoading] = useState(false);
  const [dayList, setDayList] = useState([new Date()]);
  const [hiddenDayList, setHiddenDayList] = useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<{ client: string; service: string; timeRange: number[] } | null>();
  const [tab, setTab] = useState(0);

  const [serviceCache, setServiceCache] = useState<{ [serviceId: string]: Service }>({});
  const [userCache, setUserCache] = useState<{ [userId: string]: User }>({});

  const { userId } = useParams();

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

      await professional.getProfessional(userId || "");
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

  const navigate = useNavigate();

  const tabHandler = () => {
    switch (tab) {
      case 0:
        return (
          <div className='schedule-page'>
            <Header
              title={"Minha agenda"}
              icon={""}
              onClickReturn={() => {
                navigate("/");
              }}
              onClickIcon={() => {}}
            />
            {Object.entries(professional.getSchedule()).map(([date, schedule]) => {
              const formattedDay = capitalize(parseDate(date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" }).replace(/,/g, " -"));
              const tempTime: string[] = [];

              for (let i = 0; i < 24; i++) {
                tempTime.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
              }
              function findRepetitionBlocks(schedule: any) {
                const blocks = [];
                let currentScheduleItem = null;
                let firstIndex = null;

                const scheduleKeys = Object.keys(schedule).sort((a, b) => parseInt(a) - parseInt(b));

                for (let i = 0; i < scheduleKeys.length; i++) {
                  const currentKey = scheduleKeys[i];
                  const { service, client } = schedule[currentKey];

                  if (firstIndex === null || (service === currentScheduleItem?.service && client === currentScheduleItem?.client)) {
                    // Start or continue the current block
                    if (firstIndex === null) {
                      firstIndex = parseInt(currentKey, 10);
                    }
                    currentScheduleItem = { service, client };
                  } else {
                    // End of the current block, store first and last indexes
                    blocks.push([firstIndex, parseInt(scheduleKeys[i - 1], 10)]);
                    firstIndex = parseInt(currentKey, 10);
                    currentScheduleItem = { service, client };
                  }
                }

                if (firstIndex !== null) {
                  // Store the last block if there is one
                  blocks.push([firstIndex, parseInt(scheduleKeys[scheduleKeys.length - 1], 10)]);
                }

                return blocks;
              }
              return (
                <div className='sp-day-block'>
                  <SubHeader
                    title={formattedDay}
                    buttonTitle={hiddenDayList.includes(formattedDay) ? "Exibir" : "Ocultar"}
                    onClick={() => {
                      if (hiddenDayList.includes(formattedDay)) {
                        // Day is already hidden, so remove it
                        const updatedHidden = hiddenDayList.filter((day) => day !== formattedDay);
                        setHiddenDayList(updatedHidden);
                      } else {
                        // Day is not hidden, so add it
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
                    if (userCache[scheduleDate.client] === undefined) {
                      setLoading(true);
                      const user = new User();
                      user.getUser(scheduleDate.client).then(() => {
                        const userList = userCache;
                        userList[user.getId()] = user;
                        setUserCache(userList);
                        setLoading(false);
                      });
                    }
                    return serviceCache[scheduleDate.service] !== undefined && userCache[scheduleDate.client] !== undefined ? (
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
                            {tempTime[timeIndex]} - {tempTime[timeEnd]}
                          </p>
                        </div>
                        <div className='gpt-row-item'>
                          <ItemButton title={serviceCache[scheduleDate.service].getName()} subtitle={userCache[scheduleDate.client].getName()} isSelected={selectedBlock?.timeRange[0] === timeIndex} onClick={() => {}} />
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
              title={capitalize(dayList[dayList.length - 1].toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" }).replace(/,/g, " -"))}
              buttonTitle={"Carregar mais 7 dias"}
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
                alert("pendente");
              }}
            />
          </div>
        );
      default:
        return <div />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
