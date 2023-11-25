import "./group-form.css";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Services/firebase/firebase";
import { addImage, addUser, block, fullDays, locationPin, more, timeArray } from "../../_global";
import { LoadingScreen, Line, Header, LinkButton, BottomPopup, BottomButton, SubHeader, ItemButton, Carousel, GroupBanner, DoubleInput, IconInput } from "../../Components/component-imports";
import { Group, Professional, Service, User } from "../../Classes/classes-imports";
import { handleImageInput, onClickRef, stateSwitcher } from "../../Function/functions-imports";

import { ServiceForm } from "../service-form/service-form";
import { ProfessionalForm } from "../professional-form/professional-form";
import { ErrorPage } from "../../Pages/error-page/error-page";

type GroupFormType = {
  group?: Group;
  onClickReturn?: () => void;
};

export function GroupForm({ group, onClickReturn }: GroupFormType) {
  const [user, setUser] = useState(new User());
  const [loading, setLoading] = useState(false);
  const [groupForm, setGroupForm] = useState(new Group(group));
  const [tab, setTab] = useState(0);

  const [selectedDay, setSelectedDay] = useState(1); // Weekday
  const [selectedService, setSelectedService] = useState<null | string>(null); // Selected Service
  const [selectedProfessional, setSelectedProfessional] = useState<null | string>(null); // Selected Professional

  const navigate = useNavigate();
  const bannerRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, async (client) => {
      if (!client) return; //There is no user on the firebase authentication
      await user.getUser(client.uid);
      setUser(new User(user));
      groupForm.setOwner(user.getId());
      groupForm.setAdmins([...groupForm.getAdmins(), user.getId()]);
    });
    setLoading(false);
  }, []);

  const saveGroupForm = async (group: Group, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true);
    if (group.getId()) await group.setGroup();
    else await group.addGroup();
    setLoading(false);
  };

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home tab
        return (
          <div className='group-form'>
            <GroupBanner onClick={() => onClickRef(bannerRef)} banner={groupForm.getBanner()} />
            <div className='gf-profile' onClick={() => onClickRef(profileRef)}>
              <img className={`gf-profile-${groupForm.getProfile() ? "image" : "placeholder"}`} src={groupForm.getProfile() ? groupForm.getProfile() : addImage} />
            </div>
            <DoubleInput
              input1={{
                placeholder: "Editar nome",
                value: groupForm.getTitle(),
                onChange: (e) => groupForm.updateGroupState(setGroupForm, "title", e.target.value),
              }}
              input2={{
                placeholder: "Editar tipo de negócio",
                value: groupForm.getType(),
                onChange: (e) => groupForm.updateGroupState(setGroupForm, "type", e.target.value),
              }}
            />
            <div className='gf-data-block'>
              <IconInput icon={locationPin} value={groupForm.getLocation()} placeholder='Digite o Endereço' onChange={(e) => groupForm.updateGroupState(setGroupForm, "location", e.target.value)} />
              <Line />
              <div className='gf-links'>
                <LinkButton title='Editar Serviços' onClick={() => setTab(1)} />
                <LinkButton title='Editar Horários' onClick={() => setTab(2)} />
                <LinkButton title='Editar Profissionais' onClick={() => setTab(3)} />
              </div>
            </div>
            <BottomPopup
              title='Editando...'
              subtitle='Possui Alterações'
              buttonTitle='Salvar Alterações'
              onClick={async () => {
                await saveGroupForm(groupForm, setLoading);
                navigate("/");
              }}
              activated={groupForm.isValid()}
            />
            {/* Hidden inputs that are refferencied */}
            <input className='hidden' type='file' accept='image/*' onChange={(event) => handleImageInput(event, groupForm, setGroupForm, "banner")} ref={bannerRef} />
            <input className='hidden' type='file' accept='image/*' onChange={(event) => handleImageInput(event, groupForm, setGroupForm, "profile")} ref={profileRef} />
          </div>
        );
      case 1: // Service Tab
        return (
          <div className='gf-tab'>
            <Header
              title='Editar Serviços'
              icon={more}
              onClickReturn={() => {
                setTab(0);
                setSelectedService(null);
              }}
              onClickIcon={() => setTab(4)}
            />
            <SubHeader
              title={`${groupForm.getServices().length} serviços criados`}
              buttonTitle='Alterar Horários'
              onClick={() => {
                setTab(2);
                setSelectedService(null);
              }}
            />
            <div className='gf-list'>
              {groupForm
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service: Service) => {
                  return <ItemButton title={service.getName()} subtitle={service.getDurationValue()} selected={selectedService === service.getId()} onClick={() => stateSwitcher(selectedService, service.getId(), setSelectedService)} />;
                })}
            </div>
            <BottomButton hidden={selectedService == null} title='Editar Serviço' onClick={() => setTab(4)} />
          </div>
        );
      case 2: // Time Tab
        return (
          <div className='gf-tab'>
            <Header title='Alterar Horários' icon={block} onClickIcon={() => groupForm.cleanDay(selectedDay, setGroupForm)} onClickReturn={() => setTab(1)} />
            <SubHeader title={fullDays[selectedDay]} buttonTitle='Preencher horários' onClick={() => groupForm.fillHours(selectedDay, setGroupForm)} />
            <Carousel
              items={fullDays.map((day, index) => ({
                title: day,
                selected: selectedDay === index,
                onClick: () => setSelectedDay(index),
              }))}
            />
            <div className='gf-list'>
              {timeArray.map((timeValue, index) => {
                const selected = groupForm.getHours()[selectedDay]?.[index - groupForm.getStartHours()[selectedDay]];
                return index >= 12 ? <ItemButton title={timeValue} subtitle={""} selected={selected} onClick={() => groupForm.updateHourList(selectedDay, index, setGroupForm)} /> : null;
              })}
            </div>
            <BottomButton hidden={false} title={"Confirmar"} onClick={() => setTab(0)} />
          </div>
        );
      case 3: // Professional Tab
        return (
          <div className='gf-tab'>
            <Header
              title={"Editar Profissionais"}
              icon={addUser}
              onClickReturn={() => {
                setTab(0);
                setSelectedProfessional(null);
              }}
              onClickIcon={() => setTab(5)}
            />
            <div className='gf-professional-list'>
              {groupForm
                .getProfessionals()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((professional: Professional, index: number) => {
                  return <ItemButton title={professional.getName()} subtitle={professional.getOccupations().join(", ")} selected={selectedProfessional === professional.getId()} onClick={() => setSelectedProfessional(professional.getId())} />;
                })}
            </div>
            <BottomButton hidden={selectedProfessional == null} title={"Editar Profissional"} onClick={() => setTab(5)} />
          </div>
        );
      case 4: // ServiceForm Tab
        const services = groupForm.getServices();
        const service = services.find((service) => {
          return service.getId() == selectedService;
        });
        return <ServiceForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} service={service} onClickReturn={() => setTab(1)} />;
      case 5: // ProfessionalForm Tab
        const professionals = groupForm.getProfessionals();
        const professional = professionals.find((professional) => {
          return professional.getId() == selectedProfessional;
        });
        return <ProfessionalForm groupForm={groupForm} setGroupForm={setGroupForm} user={user} onClickReturn={() => setTab(3)} professional={professional} />;
      default:
        return <ErrorPage />;
    }
  };
  return loading ? <LoadingScreen /> : tabHandler();
}
