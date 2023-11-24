import { useEffect, useState } from "react";
import { User } from "../../../Classes/user";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "../../../Components/loading/loading-screen/loading-screen";
import { Professional } from "../../../Classes/professional";
import { Header } from "../../../Components/header/header/header";
import { SubHeader } from "../../../Components/sub-header/sub-header";
import { parseDate } from "../../../Function/formatting/parse-date/parse-date";
import { capitalize } from "../../../Function/formatting/capitalize/capitalize";
import { Service } from "../../../Classes/service";
import { BottomButton } from "../../../Components/buttons/bottom-button/bottom-button";
import { findRepetitionBlocks } from "../../../Function/find-repetition-blocks/find-repetition-blocks";
import { formattedDate } from "../../../Function/formatting/formatted-date/formatted-date";
import { DoubleButton } from "../../../Components/buttons/double-button/double-button";
import { DoubleItemButton } from "../../../Components/buttons/double-item-button/double-item-button";
import { Carousel } from "../../../Components/carousel/carousel";

import "../schedule-page.css";

var isEqual = require("lodash.isequal");

export function ClientSchedulePage() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const [user, setUser] = useState(new User());
  // const [professional, SetProfessional] = useState<Professional>(new Professional());

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
  const [professionalCache, setProfessionalCache] = useState<{ [professionalId: string]: Professional }>({});

  const { userId } = useParams();
  const navigate = useNavigate();

  const save = require("../../../Assets/save.png");

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
        await user.getUser(userId || "");
        await user.getScheduleDay(formattedDay);
        if (user.getSchedule()[formattedDay] === undefined) {
          const updatedSchedule = user.getSchedule();
          delete updatedSchedule[formattedDay];
          user.setSchedule(updatedSchedule);
        }
        setUser(user);
      });
      await Promise.all(schedulePromises);
    };
    const fetchServicesAndProfessionals = async () => {
      const scheduleEntries = Object.entries(user.getSchedule());
      const servicePromises: Promise<void>[] = [];
      const professionalPromisses: Promise<void>[] = [];

      scheduleEntries.forEach(([day, schedule]) => {
        const scheduleItemEntries = Object.entries(schedule);
        scheduleItemEntries.forEach(([index, scheduleItem]) => {
          if (!serviceCache[scheduleItem.service]) {
            servicePromises.push(fetchServiceAndCache(scheduleItem.service));
          }
          if (!professionalCache[scheduleItem.client]) {
            professionalPromisses.push(fetchProfessionalAndCache(scheduleItem.client));
          }
        });
      });

      await Promise.all([...servicePromises, ...professionalPromisses]);
    };

    const fetchServiceAndCache = async (serviceId: string) => {
      const service = new Service();
      await service.getService(serviceId);
      setServiceCache((prevServiceCache) => ({
        ...prevServiceCache,
        [service.getId()]: service,
      }));
    };

    const fetchProfessionalAndCache = async (profId: string) => {
      const professional = new Professional();
      await professional.getProfessional(profId);
      setProfessionalCache((prevProfCache) => ({
        ...prevProfCache,
        [professional.getId()]: professional,
      }));
    };

    const execute = async () => {
      await fetchUser();
      await fetchScheduleForDays(scheduleDays);
      await fetchServicesAndProfessionals();
      Object.entries(user.getSchedule()).map(([date, _]) => {
        const formattedDay = formattedDate(parseDate(date));
        setDisplayList([...displayList, formattedDay]);
      });
    };

    const scheduleDays: Date[] = Array.from({ length: 10 }, (_, index) => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + index);
      return currentDate;
    });
    setDayList(scheduleDays);

    execute().then(() => setLoading(false));
  }, []);

  const timeList: string[] = [];
  const week = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  for (let i = 0; i < 24; i++) {
    timeList.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className='schedule-page'>
      <Header
        title={"Minha Agenda"}
        icon={user.getPhoto()}
        onClickReturn={() => {
          navigate(-1);
        }}
        onClickIcon={() => {
          navigate("/user");
        }}
      />
      {Object.entries(user.getSchedule()).map(([date, schedule]) => {
        const formattedDay = formattedDate(parseDate(date));
        const hiddenMessage = displayList.includes(formattedDay) ? "Ocultar" : "Exibir";

        const weekDay = capitalize(parseDate(date).toLocaleDateString("pt-BR", { weekday: "long" }));

        return (
          <div className='sp-day-block'>
            <SubHeader
              title={formattedDay}
              buttonTitle={hiddenMessage}
              onClick={() => {
                const updatedList = displayList.includes(formattedDay) ? displayList.filter((day) => day !== formattedDay) : [...displayList, formattedDay];
                setDisplayList(updatedList);
              }}
            />
            <div className='sp-list'>
              {findRepetitionBlocks(schedule).map((block) => {
                if (!displayList.includes(formattedDay)) return null;

                const firstIndex = block[0];
                const lastIndex = block[1];
                const scheduleItem = schedule[firstIndex]; //the block content is all the same regardless of the index so i'll take the first one

                const serviceName = serviceCache[scheduleItem.service].getName();
                const profName = professionalCache[scheduleItem.client].getName();

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
                    subtitle={profName}
                    selected={isEqual(selectedBlock, currentBlock)}
                    onClick={() => {
                      isEqual(selectedBlock, currentBlock) ? setSelectedBlock(null) : setSelectedBlock(currentBlock);
                    }}
                  />
                );
              })}
            </div>
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
              await user.getScheduleDay(formattedDay);
              if (user.getSchedule()[formattedDay] === undefined) {
                const updatedSchedule = user.getSchedule();
                delete updatedSchedule[formattedDay];
                user.setSchedule(updatedSchedule);
              }
            });
            await Promise.all(schedulePromises);
          };

          const fetchServicesAndProfessionals = async () => {
            const scheduleEntries = Object.entries(user.getSchedule());
            const servicePromises: Promise<void>[] = [];
            const professionalPromisses: Promise<void>[] = [];

            scheduleEntries.forEach(([day, schedule]) => {
              const scheduleItemEntries = Object.entries(schedule);
              scheduleItemEntries.forEach(([index, scheduleItem]) => {
                if (!serviceCache[scheduleItem.service]) {
                  servicePromises.push(fetchServiceAndCache(scheduleItem.service));
                }
                if (!professionalCache[scheduleItem.client]) {
                  professionalPromisses.push(fetchProfessionalAndCache(scheduleItem.client));
                }
              });
            });

            await Promise.all([...servicePromises, ...professionalPromisses]);
          };

          const fetchServiceAndCache = async (serviceId: string) => {
            const service = new Service();
            await service.getService(serviceId);
            setServiceCache((prevServiceCache) => ({
              ...prevServiceCache,
              [service.getId()]: service,
            }));
          };

          const fetchProfessionalAndCache = async (profId: string) => {
            const prof = new Professional();
            await prof.getProfessional(profId);
            setProfessionalCache((prevProfCache) => ({
              ...prevProfCache,
              [prof.getId()]: prof,
            }));
          };

          const scheduleDays: Date[] = Array.from({ length: 8 }, (_, index) => {
            const currentDate = new Date(dayList[dayList.length - 1]);
            currentDate.setDate(currentDate.getDate() + index);
            return currentDate;
          });
          setDayList([...dayList, ...scheduleDays]);

          await fetchScheduleForDays(scheduleDays);
          await fetchServicesAndProfessionals();
          setLoading(false);
        }}
      />
      <BottomButton
        hidden={selectedBlock === null}
        title={"Desmarcar"}
        onClick={async () => {
          {
            setLoading(true);
            const day = selectedBlock!.day;

            const professional = selectedBlock!.client;

            const startIndex = selectedBlock!.timeRange[0];
            const endIndex = selectedBlock!.timeRange[1];
            const serviceSpan = endIndex - startIndex + 1;

            /* Grabs the day data before accessing it so it doesn't bug with the undefined day, very important */
            await professionalCache[professional].getScheduleDay(day);
            await user.getScheduleDay(day);
            console.log(user.getSchedule()[day]);

            const userPromise = Array.from({ length: serviceSpan }, async (_, index) => {
              const realIndex = (index + startIndex).toString();
              await user.deleteScheduleIndex(day, realIndex);
            });

            const profPromise = Array.from({ length: serviceSpan }, async (_, index) => {
              const realIndex = index + startIndex;
              await professionalCache[professional].deleteScheduleIndex(day, realIndex.toString());
            });

            await Promise.all(userPromise);
            await Promise.all(profPromise);
            // setChangedValues([]);
            setSelectedTimeList([]);
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
