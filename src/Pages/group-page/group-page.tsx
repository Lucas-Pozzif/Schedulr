import "./group-page.css";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate, useParams } from "react-router-dom";

import { Group, Professional, Service, User } from "../../Classes/classes-imports";
import { capitalize, formatDuration, idSwitcher } from "../../Function/functions-imports";
import { BottomButton, BottomPopup, Carousel, DoubleItemButton, DoubleTextBlock, GroupBanner, Header, ItemButton, Line, LinkButton, LoadingScreen, SubHeader } from "../../AComponents/component-imports";
import { DoubleButton } from "../../AComponents/buttons/double-button/double-button";

import { ErrorPage } from "../error-page/error-page";
import { GroupForm } from "../../Forms/group-form/group-form";

export function GroupPage() {
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
                  <DoubleItemButton
                    leftButtonTitle={{
                      title1: days[selectedDay]?.[0],
                      title2: time,
                    }}
                    title={selectedService?.getName() || "Serviço não selecionado"}
                    subtitle={validation.professionals.map((prof) => prof.getName()).join(", ")}
                    selected={selected}
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
