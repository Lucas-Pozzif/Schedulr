import "../schedule-page.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Services/firebase/firebase";

import { fullTimeArray } from "../../../_global";
import { Professional, Service, User } from "../../../Classes/classes-imports";
import { capitalize, findRepetitionBlocks, formattedDate, parseDate } from "../../../Function/functions-imports";
import { BottomButton, GenericHeader, SchedulePageLoading, SubHeader } from "../../../Components/component-imports";
import { DualButton } from "../../../Components/buttons/dual-button/dual-button";

var isEqual = require("lodash.isequal");

export function ClientSchedulePage() {
  const [user, setUser] = useState(new User());
  const [loading, setLoading] = useState(false);

  const [dayList, setDayList] = useState([new Date()]);
  const [displayList, setDisplayList] = useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<{
    client: string;
    service: string;
    timeRange: number[];
    day: string;
  } | null>(null);

  const [serviceCache, setServiceCache] = useState<{ [serviceId: string]: Service }>({});
  const [professionalCache, setProfessionalCache] = useState<{ [professionalId: string]: Professional }>({});

  const { userId } = useParams();
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
      Object.entries(user.getSchedule()).forEach(([date, _]) => {
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

  const loadWeek = async () => {
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
  };

  const unSchedule = async () => {
    setLoading(true);
    const day = selectedBlock!.day;

    const professional = selectedBlock!.client;

    const startIndex = selectedBlock!.timeRange[0];
    const endIndex = selectedBlock!.timeRange[1];
    const serviceSpan = endIndex - startIndex + 1;

    /* Grabs the day data before accessing it so it doesn't bug with the undefined day, very important */
    await professionalCache[professional]?.getScheduleDay(day);
    await user.getScheduleDay(day);

    const userPromise = Array.from({ length: serviceSpan }, async (_, index) => {
      const realIndex = (index + startIndex).toString();
      await user.deleteScheduleIndex(day, realIndex);
    });

    const profPromise = Array.from({ length: serviceSpan }, async (_, index) => {
      const realIndex = index + startIndex;
      await professionalCache[professional]?.deleteScheduleIndex(day, realIndex.toString());
    });

    await Promise.all(userPromise);
    await Promise.all(profPromise);
    setLoading(false);
  };

  return loading ? (
    <SchedulePageLoading />
  ) : (
    <div className='schedule-page'>
      <GenericHeader title={"Minha Agenda"} icon={user.getPhoto()} onClickReturn={() => navigate(-1)} onClickIcon={() => navigate("/user")} />
      {Object.entries(user.getSchedule()).map(([date, schedule], index) => {
        const formattedDay = formattedDate(parseDate(date));
        const hiddenMessage = displayList.includes(formattedDay) ? "Ocultar" : "Exibir";
        const weekDay = capitalize(parseDate(date).toLocaleDateString("pt-BR", { weekday: "long" }));

        return (
          <div key={index} className='sp-day-block'>
            <SubHeader
              title={formattedDay}
              buttonTitle={hiddenMessage}
              onClick={() => {
                const updatedList = displayList.includes(formattedDay) ? displayList.filter((day) => day !== formattedDay) : [...displayList, formattedDay];
                setDisplayList(updatedList);
              }}
            />
            <div className='sp-list'>
              {findRepetitionBlocks(schedule).map((block, index) => {
                if (!displayList.includes(formattedDay)) return null;
                const firstIndex = block[0];
                const lastIndex = block[1];
                const scheduleItem = schedule[firstIndex]; //the block content is all the same regardless of the index so i'll take the first one

                const serviceName = serviceCache[scheduleItem.service]?.getName();
                const profName = professionalCache[scheduleItem.client]?.getName();

                const currentBlock = {
                  client: scheduleItem.client,
                  service: scheduleItem.service,
                  timeRange: block,
                  day: date,
                };

                return (
                  <DualButton
                    key={index}
                    leftButton={{
                      title: weekDay,
                      subtitle: `${fullTimeArray[firstIndex]} - ${fullTimeArray[lastIndex]}`,
                    }}
                    title={serviceName}
                    subtitle={profName}
                    select={isEqual(selectedBlock, currentBlock)}
                    onClick={() => (isEqual(selectedBlock, currentBlock) ? setSelectedBlock(null) : setSelectedBlock(currentBlock))}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <SubHeader title={formattedDate(dayList[dayList.length - 1])} buttonTitle={"Carregar próxima semana"} onClick={loadWeek} />
      <BottomButton hide={selectedBlock === null} title={"Desmarcar"} onClick={async () => await unSchedule()} />
    </div>
  );
}
