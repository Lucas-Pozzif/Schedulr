import "./group-page.css";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Group, Professional, Service, User } from "../../Classes/classes-imports";
import { capitalize, formatArray, formatDuration, idSwitcher } from "../../Function/functions-imports";
import { BottomButton, BottomPopup, Carousel, GenericHeader, GroupBanner, GroupFormLoading, GroupHeader, IconCarousel, ItemList, Line, LinkList, SmallHeader } from "../../Components/component-imports";
import { calendar, clock, config, fullDays, fullTimeArray, userIcon } from "../../_global";
import { DualList } from "../../Components/lists/dual-list/dual-list";
import { ErrorPage } from "../error-page/error-page";
import { DualButton } from "../../Components/buttons/dual-button/dual-button";
import { GroupConfigPage } from "../group-config-page/group-config-page";
import { BlockInput } from "../../Components/inputs/block-input/block-input";
import { ImageButton } from "../../Components/buttons/image-button/image-button";
import { ImageList } from "../../Components/lists/image-list/image-list";
import { ScheduleItemW } from "../../Classes/schedule/schedule";

export function GroupPage() {
  const [loading, setLoading] = useState(false);
  const [serviceLoading, setSLoading] = useState(false);
  const [professionalLoading, setPLoading] = useState(false);
  const [user, setUser] = useState(new User());
  const [group, setGroup] = useState(new Group());
  const [tab, setTab] = useState(0);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(-1);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const [selectedWeekDay, setSelectedWeekDay] = useState(1);
  const [availableProfessionals, setAvailableProfessionals] = useState<Professional[]>([]);
  const [confirm, setConfirm] = useState(false);

  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setSLoading(true);
    setPLoading(true);
    const fetchData = async () => {
      onAuthStateChanged(auth, async (client) => {
        if (client?.uid) {
          await user.getUser(client.uid);
        }
        await group.getGroup(groupId);
        setLoading(false);
        await group.updateProfessionals();
        setPLoading(false);
        await group.updateServices();
        setSLoading(false);
        setGroup(new Group(group));
      });
    };
    fetchData();
  }, []);

  const days: any[][] = [];

  for (let i = 0; i < 90; i++) {
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

  for (let i = startHour; i - startHour < endHour; i++) {
    if (i >= 0) {
      timeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
    }
  }

  const profSchedValue = {
    edited: false,
    client: user.getId() || "error",
    service: selectedService?.getId() || "error",
  };
  const wppSchedValue: ScheduleItemW = {
    messageSent: false,
    client: user.getName() || "",
    contact: user.getNumber() || "",
    service: selectedService?.getName() || "uma visita ao salão Leandro & Alessandro",
    professional: selectedProfessional?.getName() || "nossa equipe",
  };
  const clientSchedValue = {
    client: selectedProfessional?.getId() || "error",
    service: selectedService?.getId() || "error",
  };

  const handleDaySwitch = async (day: any, index: number) => {
    setLoading(true);
    setSelectedTime(null); // The time is now resetted
    setSelectedDay(index); // new day selected
    setSelectedWeekDay(day[3]); // new weekDay
    if (selectedService !== null) {
      await Promise.all(
        group
          .getProfessionals()
          .sort((a, b) => a.getName().localeCompare(b.getName())) // Professionals ordered in order
          .map(async (prof: Professional) => {
            if (prof.getServices().includes(selectedService!.getId())) await prof?.getScheduleDay(days[index][2]);
          })
      );
    }
    setLoading(false);
  };

  const timeValidator = (index: number): { isAvailable: boolean; isAvailableToday: boolean; professionals: Professional[] } => {
    const isAvailableToday = (index + group.getStartHours()[selectedDay] + 10) * 19 >= getMinutesSinceMidnight();

    const professionals: Professional[] = group
      .getProfessionals()
      .sort((a, b) => a.getName().localeCompare(b.getName()))
      .filter((prof: Professional) => {
        let isProfAvailable = true;

        selectedService?.getDuration().forEach((time, i) => {
          const schedule = prof.getSchedule()?.[days[selectedDay]?.[2]]?.[index + i + startHour * 6];
          if (!prof.getServices().includes(selectedService.getId()) || (schedule !== undefined && time) || !prof.getShift()[days[selectedDay][3]][+Math.floor(index / 3) - prof.getStartHours()[days[selectedDay][3]] + 18]) {
            isProfAvailable = false;
          }
        });

        return isProfAvailable;
      });

    const isAvailable = professionals.length > 0;
    return {
      isAvailable,
      isAvailableToday,
      professionals,
    };
  };

  // Utility function to get the minutes since midnight for a given date
  const getMinutesSinceMidnight = (): number => {
    const midnight = new Date();
    const date = new Date();
    midnight.setHours(0, 0, 0, 0);
    const diffInMilliseconds = date.getTime() - midnight.getTime();
    return Math.floor(diffInMilliseconds / (1000 * 60));
  };

  const switchSelectedTime = (index: number, professionals: Professional[]) => {
    const newSelectedTime = index + startHour * 6;
    if (selectedTime === null || selectedTime !== newSelectedTime) {
      setSelectedTime(newSelectedTime);
      setAvailableProfessionals(professionals);
    } else setSelectedTime(null);
  };

  const handleSchedule = async () => {
    if (selectedService && selectedProfessional && selectedTime) {
      setLoading(true);
      if (user.getId() === "" || (userProfId && !profSchedValue.edited)) {
        setTab(6);
      } else {
        for (let i = 0; i < selectedService.getDuration().length; i++) {
          if (selectedService.getDuration()[i] === true) {
            await selectedProfessional?.updateSchedule(days[selectedDay][2], (selectedTime + i).toString(), profSchedValue, wppSchedValue);
            await user?.updateSchedule(days[selectedDay][2], (selectedTime + i).toString(), clientSchedValue);
          }
        }

        setTab(4);
      }
      setLoading(false);
    }
  };

  const buttonList = [
    {
      title: "Selecionar Serviço",
      subtitle: `${group.getServicesIds().length} Serviços disponíveis`,
      onClick: () => setTab(1),
    },
    {
      title: "Selecionar Profissional",
      subtitle: `${group.getProfessionalsIds().length} Profissionais disponíveis`,
      onClick: () => setTab(3),
    },
  ];

  const tabCarousel = [
    {
      title: "Serviço",
      select: tab === 1,
      icon: calendar,
      onClick: () => setTab(1),
    },
    {
      title: "Horário",
      select: tab === 2,
      icon: clock,
      inactive: selectedService === null,
      onClick: () => {
        if (selectedService !== null) setTab(2);
        else {
          setTab(1);
        }
      },
    },
    {
      title: "Profissional",
      select: tab === 3,
      icon: userIcon,
      onClick: () => setTab(3),
    },
  ];

  const userProfId = group
    .getProfessionals()
    .find((professional) => {
      const professionalEmail = professional.getEmail().toLowerCase().replace(/\s/g, "");
      const userEmail = user.getEmail().toLowerCase().replace(/\s/g, "");
      return professionalEmail !== "" && professionalEmail === userEmail;
    })
    ?.getId();
  console.log(userProfId);

  const tabHandler = () => {
    switch (tab) {
      case -1:
        return <div></div>;
      case 0: // Home tab
        return (
          <div className='tab'>
            <GroupBanner banner={group.getBanner()} profile={group.getProfile()} returnButton onClickReturn={() => navigate('/user')} />
            <GroupHeader
              title={group.getTitle()}
              subtitle={group.getType()}
              iconButton={
                user.getId() !== ""
                  ? group.getOwner() === user.getId() || group.getAdmins().includes(user.getId())
                    ? {
                        isLoading: professionalLoading,
                        icon: config,
                        title: "Config",
                        onClick: () => setTab(5),
                      }
                    : {
                        isLoading: professionalLoading,
                        icon: calendar,
                        title: "Agenda",
                        onClick: () => {
                          if (professionalLoading) return;
                          if (userProfId) {
                            setTab(7);
                          } else {
                            navigate(`/user/schedule/${user.getId()}`);
                          }
                        },
                      }
                  : undefined
              }
            />
            <p className='gp-location'>{group.getLocation()}</p>
            <Line />
            <LinkList items={buttonList} />
            <BottomPopup stage={1} title={"Clique para iniciar"} subtitle={group.getTitle()} buttonTitle={"Iniciar Agendamento"} onClick={() => setTab(1)} />
          </div>
        );
      case 1: // Service tab
        return serviceLoading ? (
          <GroupFormLoading />
        ) : (
          <div className='tab'>
            <GenericHeader title={"Escolha o serviço"} onClickReturn={() => setTab(0)} />
            <IconCarousel items={tabCarousel} />
            <Carousel
              items={days.map((day, index) => {
                return {
                  title: day[0],
                  subtitle: day[1],
                  select: index === selectedDay,
                  onClick: async () => await handleDaySwitch(day, index),
                };
              })}
            />
            <ItemList
              items={group
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service) => {
                  return {
                    title: service.getName(),
                    subtitle: formatDuration(service.getDuration()),
                    select: service.getId() === selectedService?.getId(),
                    onClick: () => {
                      setSelectedProfessional(null);
                      setSelectedTime(null);
                      idSwitcher(selectedService, service, setSelectedService);
                      if (selectedService === null) setTab(2);
                    },
                  };
                })}
            />
            <BottomPopup stage={selectedService ? 1 : 0} title={`${fullDays?.[selectedWeekDay] || ""} - ${days?.[selectedDay]?.[1] || ""}`} subtitle={selectedService?.getName()} buttonTitle={"Escolher Horário"} onClick={() => setTab(2)} />
          </div>
        );
      case 2: // Time tab
        return (
          <div className='tab'>
            <GenericHeader title='Escolha o Horário' onClickReturn={() => setTab(1)} />
            <IconCarousel items={tabCarousel} />
            <Carousel
              items={days.map((day, index) => {
                return {
                  title: day[0],
                  subtitle: day[1],
                  select: index === selectedDay,
                  onClick: async () => await handleDaySwitch(day, index),
                };
              })}
            />
            <DualList
              items={timeArray
                .map((time, index) => {
                  const validation = timeValidator(index);
                  if (selectedDay === 0 && !validation.isAvailableToday) return null;
                  return validation.isAvailable && selectedDay > -1
                    ? {
                        title: selectedService?.getName() || "Serviço não selecionado",
                        subtitle: validation.professionals.map((prof) => prof.getName().split(" ")[0]).join(", "),
                        select: selectedTime !== null && index + startHour * 6 >= selectedTime && index + startHour * 6 < selectedTime + (selectedService?.getDuration().length || 0),
                        onClick: () => {
                          setSelectedProfessional(null);
                          switchSelectedTime(index, validation.professionals);
                          if (selectedTime === null) setTab(3);
                        },
                        leftButton: {
                          title: days[selectedDay]?.[0],
                          subtitle: time,
                        },
                      }
                    : null;
                })
                .filter((item): item is NonNullable<typeof item> => item !== null)}
            />
            <BottomPopup stage={selectedTime ? 1 : 0} title={`${fullDays?.[selectedWeekDay]} - ${days?.[selectedDay]?.[1]}`} subtitle={selectedService?.getName()} buttonTitle={"Escolher Profissional"} onClick={() => setTab(3)} />
          </div>
        );
      case 3: // Professional tab
        return professionalLoading ? (
          <GroupFormLoading />
        ) : (
          <div className='tab'>
            <GenericHeader title='Escolha o Profissional' onClickReturn={() => setTab(2)} />
            <IconCarousel items={tabCarousel} />
            <ImageList
              items={group
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((professional) => {
                  return availableProfessionals.includes(professional) || selectedService === null
                    ? {
                        title: professional.getName(),
                        subtitle: professional.getOccupations().join(", "),
                        select: professional.getId() === selectedProfessional?.getId(),
                        image: professional.getImage(),
                        onClick: () => idSwitcher(selectedProfessional, professional, setSelectedProfessional),
                      }
                    : null;
                })
                .filter((item): item is NonNullable<typeof item> => item !== null)}
            />
            <BottomPopup
              stage={selectedProfessional && selectedTime && selectedService ? (confirm ? 2 : 1) : 0}
              title={`${fullDays?.[selectedWeekDay]} - ${days?.[selectedDay]?.[1]}`}
              subtitle={selectedService?.getName()}
              buttonTitle={confirm ? "Confirmar" : "Agendar Serviço"}
              onClick={() => {
                if (confirm) handleSchedule();
                else setConfirm(true);
              }}
              onClickOut={() => setConfirm(false)}
              topText='Você confirma o agendamento?'
              bottomText='Você pode desmarcar na sua agenda'
              items={[
                {
                  title: selectedService?.getName() || "Serviço não selecionado",
                  subtitle: selectedProfessional?.getName() || "Profissional não selecionado",
                  selected: true,
                  leftTitle: fullDays[selectedWeekDay],
                  leftSubtitle: fullTimeArray[selectedTime || 0],
                },
              ]}
            />
          </div>
        );
      case 4: // Confirmation tab
        const date = new Date();
        return (
          <div className='tab'>
            <GroupBanner banner={group.getBanner()} profile={group.getProfile()} />
            <GroupHeader
              title={group.getTitle()}
              subtitle={group.getType()}
              iconButton={{
                icon: calendar,
                title: "Agenda",
                onClick: () => navigate(`/user/schedule/${user.getId()}`),
              }}
            />
            <p className='gp-confirm-title'>Seu agendamento foi confirmado!</p>
            <DualButton
              title={selectedService?.getName() || "Isso não deveria acontecer"}
              subtitle={selectedProfessional?.getName() || "Isso não deveria acontecer"}
              select={true}
              leftButton={{
                title: days[selectedDay][0],
                subtitle: `${days[selectedDay][1]} - ${fullTimeArray[selectedTime || 0]}`,
              }}
            />
            <div className='gp-confirm-bottom-block'>
              <p className='gp-bottom-text'>
                Agendado por {user.getName()} às {date.toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" })} - {date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
              </p>
              <Line />
            </div>
            <BottomButton
              title={"Retornar a Página Inicial"}
              onClick={() => {
                setSelectedDay(0);
                setSelectedService(null);
                setSelectedTime(null);
                setSelectedProfessional(null);
                setConfirm(false);

                setTab(0);
              }}
            />
          </div>
        );
      case 5: // Config tab
        return <GroupConfigPage user={user} group={group} />;
      case 6: // Login tab
        return (
          <div className='tab'>
            <GroupBanner banner={group.getBanner()} profile={group.getProfile()} />
            <GroupHeader title={group.getTitle()} subtitle={group.getType()} />
            <BlockInput label={"Por favor digite seu nome"} placeholder={"Nome"} value={user.getName()} onChange={(e) => user.updateState(setUser, "name", e.target.value)} />
            <BlockInput label={"Por favor digite seu número"} type='tel' value={user.getNumber()} maxLength={20} placeholder={"(00)00000-0000"} onChange={(e) => user.updateState(setUser, "number", e.target.value)} />
            <BottomButton
              title={"Salvar Perfil"}
              hide={!user.isNumberValid() || user.getName() === ""}
              onClick={async () => {
                setLoading(true);
                const formattedNumber = user.getNumber().startsWith("55") ? user.getNumber() : "55" + user.getNumber();
                user.setNumber(formattedNumber);
                if (user.getId() === "") {
                  await user.loginAnonymous();
                  await user.addUser();
                  profSchedValue.client = user.getId();
                  wppSchedValue.client = user.getName();
                } else {
                  profSchedValue.edited = true;
                  profSchedValue.client = user.getName();
                  profSchedValue.service = selectedService?.getName() || "Erro";

                  wppSchedValue.client = user.getName();
                  wppSchedValue.service = selectedService?.getName() || "uma visita no Salão Leandro e Alessandro";
                }
                await handleSchedule();

                setTab(4);
                setLoading(false);
              }}
            />
          </div>
        );
      case 7: // Professional list tab
        return (
          <div className='tab'>
            <SmallHeader title={group.getTitle()} onClickReturn={() => setTab(0)} />
            <ItemList
              items={group
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName())) // Alphabetical order
                .map((professional: Professional) => {
                  return {
                    title: professional.getName(),
                    subtitle: professional.getOccupations().join(", "),
                    select: selectedProfessional?.getId() === professional.getId(),
                    onClick: () => idSwitcher(selectedProfessional, professional, setSelectedProfessional),
                  };
                })}
            />
            <BottomButton title={`Ver ${selectedProfessional?.getName()}`} hide={selectedProfessional === null} onClick={() => navigate(`/professional/schedule/${selectedProfessional?.getId()}`)} />
          </div>
        );
      default:
        return <ErrorPage />;
    }
  };
  return loading ? <GroupFormLoading /> : tabHandler();
}

/*
export function GroupPasge() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(new User());
  const [group, setGroup] = useState(new Group());
  const [tab, setTab] = useState(0);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(-1);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const [selectedWeekDay, setSelectedWeekDay] = useState(1);
  const [availableProfessionals, setAvailableProfessionals] = useState<Professional[]>([]);

  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client) => {
      if (!client) return;

      await user.getUser(client.uid);
      setUser(new User(user));
    });

    group.getGroup(groupId).then(async () => {
      await group.updateServices();
      await group.updateProfessionals();
      setGroup(new Group(group));
      setLoading(false);
    });
  }, []);

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

  const profSchedValue = {
    client: user.getId(),
    service: selectedService?.getId() || "error",
  };
  const clientSchedValue = {
    client: selectedProfessional?.getId() || "error",
    service: selectedService?.getId() || "error",
  };

  const handleDaySwitch = async (day: any, index: number) => {
    setLoading(true);
    setSelectedTime(null); // The time is now resetted
    setSelectedDay(index); // new day selected
    setSelectedWeekDay(day[3]); // new weekDay
    await Promise.all(
      group
        .getProfessionals()
        .sort((a, b) => a.getName().localeCompare(b.getName())) // Professionals ordered in order
        .map(async (prof: Professional) => {
          if (prof.getServices().includes(selectedService!.getId())) await prof?.getScheduleDay(days[index][2]);
        })
    );
    setLoading(false);
  };

  const timeValidator = (index: number) => {
    var isAvailable = false;
    const professionals: Professional[] = [];
    group
      .getProfessionals()
      .sort((a, b) => a.getName().localeCompare(b.getName()))
      .map((prof) => {
        var isProfAvailable = true;
        selectedService?.getDuration().map((time, i) => {
          console.log(selectedService, prof);
          if (!prof.getServices().includes(selectedService.getId()) || (prof.getSchedule()?.[days[selectedDay]?.[2]]?.[index + i + startHour * 6] !== undefined && time)) {
            isProfAvailable = false;
          }
        });
        if (isProfAvailable) {
          professionals.push(prof);
          isAvailable = true;
        }
      });
    return {
      isAvailable: isAvailable,
      professionals: professionals,
    };
  };
  const switchSelectedTime = (index: number, professionals: Professional[]) => {
    const newSelectedTime = index + startHour * 6;
    if (selectedTime === null || selectedTime !== newSelectedTime) {
      setSelectedTime(newSelectedTime);
      setAvailableProfessionals(professionals);
    } else setSelectedTime(null);
  };

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home Tab
        return (
          <div className='group-page'>
            <GroupBanner banner={group.getBanner()} returnButton onClickReturn={() => navigate(-1)} />
            <DoubleTextBlock title={group.getTitle()} subtitle={group.getType()} />
            <div className='gp-header'>
              <p className='gp-distance'>{group.getLocation()}</p>
              <Line />
            </div>
            <div className='gp-bottom-columns'>
              <LinkButton title='Editar Estabelecimento' hidden={!group.getAdmins().includes(user.getId())} onClick={() => setTab(4)} />
              <LinkButton title='Horário e Serviço' onClick={() => (selectedService === null ? setTab(3) : setTab(1))} />
              <LinkButton title='Profissional' onClick={() => setTab(2)} />
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
            <DoubleButton
              title={["Ver Agenda", "Iniciar Agendamento"]}
              onClick={[() => navigate(`/user/schedule/${user.getId()}`), () => (selectedService === null ? setTab(3) : setTab(1))]}
              hidden={[selectedService !== null && selectedProfessional !== null && selectedTime !== null, selectedService !== null && selectedProfessional !== null && selectedTime !== null]}
            />
            <img className='gp-profile' src={group.getProfile()} />
          </div>
        );
      case 1: // Time Tab
        return (
          <div className='gp-service-tab'>
            <Header title={"Escolha o horário"} onClickReturn={() => setTab(0)} />
            <SubHeader title={selectedService?.getName()} buttonTitle={"Alterar Serviço"} onClick={() => setTab(3)} />
            <Carousel
              items={days.map((day, index) => {
                return {
                  title: day[0],
                  title2: day[1],
                  selected: index === selectedDay,
                  onClick: async () => await handleDaySwitch(day, index),
                };
              })}
            />
            <div className='gp-list'>
              {timeArray.map((time, index) => {
                const validation = timeValidator(index);
                const selected = selectedTime !== null && index + startHour * 6 >= selectedTime && index + startHour * 6 < selectedTime + (selectedService?.getDuration().length || 0);
                return validation.isAvailable && selectedDay > 0 ? (
                  <DualButton
                    leftButton={{
                      title: days[selectedDay]?.[0],
                      subtitle: time,
                    }}
                    title={selectedService?.getName() || "Serviço não selecionado"}
                    subtitle={validation.professionals.map((prof) => prof.getName()).join(", ")}
                    select={selected}
                    onClick={() => switchSelectedTime(index, validation.professionals)}
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
        const dayTitle = `${selectedDay > 0 ? days[selectedDay][0] + " - " + days[selectedDay][1] : "Selecionar Dia"} - ${tempTime[selectedTime || 0]}`;
        return (
          <div className='gp-professional-tab'>
            <Header title={"Escolha o Profissional"} onClickReturn={() => (selectedService !== null ? setTab(1) : setTab(0))} />
            <SubHeader title={dayTitle} buttonTitle={selectedService?.getName() || "Selecionar Serviço"} onClick={() => setTab(3)} />
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
                      onClick={() => idSwitcher(selectedProfessional, professional, setSelectedProfessional)}
                    />
                  ) : null;
                })}
            </div>
            <DoubleButton
              title={["Próximo", "Ver Agenda"]}
              onClick={[() => setTab(0), () => navigate(`/professional/schedule/${selectedProfessional?.getId()}`)]}
              hidden={[selectedProfessional === null, selectedProfessional === null || !group.getAdmins().includes(user.getId())]}
            />
          </div>
        );
      case 3: // Service Tab
        return (
          <div className='gp-service-tab'>
            <Header
              title={"Escolha o serviço"}
              onClickReturn={() => {
                selectedService === null ? setTab(0) : setTab(1);
                setSelectedTime(null);
              }}
            />
            <div className='gp-list'>
              {group
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service) => {
                  return <ItemButton title={service.getName()} subtitle={formatDuration(service.getDuration())} selected={service.getId() === selectedService?.getId()} onClick={() => idSwitcher(selectedService, service, setSelectedService)} />;
                })}
            </div>
            <BottomButton hidden={selectedService == null} title={"Escolher Horário"} onClick={() => setTab(1)} />
          </div>
        );
      case 4: // Group edit Tab
        return <GroupForm group={group} onClickReturn={() => setTab(0)} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
*/
