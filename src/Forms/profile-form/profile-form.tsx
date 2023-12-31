import { Dispatch, SetStateAction, useState } from "react";
import { Account } from "../../Classes/account/account";
import { Group } from "../../Classes/group/group";
import { Profile } from "../../Classes/profile/profile";
import { add, bin, calendar, clock, closeIcon, key, occupation } from "../../_global";
import { BottomPopup, Carousel, GenericHeader, HeaderInput, IconCarousel, ItemList, Line, LinkList, Popup, ProfessionalFormLoading, SubHeader } from "../../Components/component-imports";
import { Activity } from "../../Classes/activity/activity";
import { stateSwitcher } from "../../Function/functions-imports";
import { ActivityForm } from "../activity-form/activity-form";
import { ErrorPage } from "../../Pages/error-page/error-page";

type ProfileFormType = {
  account?: Account;
  groupForm: Group;
  setGroupForm: Dispatch<SetStateAction<Group>>;
  profile?: Profile;
  onClickReturn: () => void;
};

export function ProfileForm({ account, groupForm, setGroupForm, profile = new Profile(), onClickReturn }: ProfileFormType) {
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [tab, setTab] = useState(0);

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedOccupation, setSelectedOccupation] = useState<null | string>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [popupData, setPopup] = useState({
    title: "",
    text: "",
    display: false,
    onClickExit: () => {},
    buttons: [
      {
        title: "",
        onClick: () => {},
      },
    ],
  });

  const updateAdmins = async () => {
    /*
    const profUser: Account = await profileForm.findAccount();

    if (profUser.get("id") == "") {
      profileForm.updateValue("isAdmin", false, setProfileForm);
      setMessage("usuário não encontrado");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      return;
    }
    const admins = groupForm.get("admins");

    if (!profileForm.get("isAdmin")) {
      admins.push(profUser.get("id"));
      setMessage(`${profUser.get("name")} é um administrador`);
    } else {
      const index = admins.indexOf(profUser.get("id"));
      if (index !== -1) {
        admins.splice(index, 1);
      }
      setMessage(`${profUser.get("name")} não é mais um administrador`);
    }
    profileForm.updateValue("isAdmin", !profileForm.get("isAdmin"), setProfileForm);
    groupForm.updateValue("admins", admins);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
    */
  };

  const saveProfessional = async () => {
    setLoading(true);
    // if (profileForm.get("id")) {
    //   await profileForm.setProfessional();
    //   const idIndex = groupForm.getProfessionalsIds().indexOf(profileForm.get("id"));
    //   const professional = groupForm.getProfessionals();
    //   professional[idIndex] = profileForm;
    // } else {
    //   await profileForm.addProfessional();
    //   groupForm.setProfessionalsIds([...groupForm.getProfessionalsIds(), profileForm.get("id")]);
    //   groupForm.setProfessionals([...groupForm.getProfessionals(), profileForm]);
    // }
    setGroupForm(new Group(groupForm));
    setLoading(false);
    onClickReturn();
  };

  const handleDeleteOccupation = () => {
    profileForm.updateValue(
      "occupations",
      profileForm.get("occupations").filter((occupation: { _name: string; _id: string }) => occupation._id !== selectedOccupation)
    );
    setSelectedOccupation(null);
  };

  const handleOccupationInput = (occupations: { _name: string; _id: string }[], input: string) => {
    if (selectedOccupation === null) {
      setSelectedOccupation(profileForm.generateNewOccupation());
    }
    const occupationIndex = occupations.findIndex((occupation) => occupation._id === selectedOccupation);
    occupations[occupationIndex]._name = input;
    profileForm.updateValue("occupations", occupations, setProfileForm);
  };

  const handleDelete = async () => {
    setLoading(true);
    if (profileForm.get("id") !== "") {
      await profileForm.deleteProfessional();
      const updatedProfileList = groupForm.get("profiles").filter((profile: { _id: string; _profile: Profile }) => profile._id !== profileForm.get("id"));

      groupForm.updateValue("profiles", updatedProfileList);
      await groupForm.setGroup();
    }
    onClickReturn();
    setLoading(false);
  };

  const buttonList = [
    {
      title: "Alterar Serviços",
      subtitle: `${profileForm.get("activities").length} Serviços selecionados`,
      onClick: () => setTab(2),
    },
    {
      title: "Alterar Profissionais",
      subtitle: `${profileForm.get("occupations").length} Ocupações criadas`,
      onClick: () => setTab(3),
    },
  ];
  const professionalButtons = [
    {
      title: "Horários",
      icon: calendar,
      onClick: () => setTab(1),
    },
    {
      title: "Admin",
      select: profileForm.get("isAdmin"),
      icon: key,
      onClick: () => {}, //updateAdmins(),
    },
  ];

  const tabCarousel = [
    {
      title: "Horário",
      select: tab === 1,
      icon: clock,
      onClick: () => setTab(1),
    },
    {
      title: "Serviço",
      select: tab === 2,
      icon: calendar,
      onClick: () => setTab(2),
    },
    {
      title: "Ocupações",
      select: tab === 3,
      icon: occupation,
      onClick: () => setTab(3),
    },
  ];

  const tabHandler = () => {
    switch (tab) {
      case 0: // Professional tab
        return (
          <div className='tab'>
            <HeaderInput
              placeholder={"Nome do Profissional"}
              value={profileForm.get("name")}
              subtitle={profileForm.formattedOccupations()}
              icon={bin}
              onChange={(e) => profileForm.updateValue("name", e.target.value, setProfileForm)}
              onClickReturn={() =>
                setPopup({
                  title: "Você tem Certeza?",
                  text: "Existem alterações não salvas",
                  display: true,
                  onClickExit: () => setPopup({ ...popupData, display: false }),
                  buttons: [
                    {
                      title: "Cancelar",
                      onClick: () => setPopup({ ...popupData, display: false }),
                    },
                    {
                      title: "Confirmar",
                      onClick: onClickReturn,
                    },
                  ],
                })
              }
              onClickIcon={() => {
                setPopup((prevPopupData) => ({
                  title: "Você realmente deseja excluir?",
                  text: "Essa ação não pode ser desfeita",
                  display: true,
                  onClickExit: () => setPopup({ ...prevPopupData, display: false }),
                  buttons: [
                    {
                      title: "Cancelar",
                      onClick: () => setPopup({ ...prevPopupData, display: false }),
                    },
                    {
                      title: "Confirmar",
                      onClick: async () => await handleDelete(),
                    },
                  ],
                }));
              }}
            />
            <input className='pf-input' value={profileForm.get("number")} placeholder='Digitar telefone' onChange={(e) => profileForm.updateValue("number", e.target.value, setProfileForm)} />
            <Line />
            <IconCarousel items={professionalButtons} />
            <p className={`pf-message ${message ? "" : "hidden"}`}>{message}</p>
            <LinkList items={buttonList} />
            <Popup title={popupData.title} text={popupData.text} display={popupData.display} onClickExit={popupData.onClickExit} buttons={popupData.buttons} />
          </div>
        );
      case 1: // Time tab
        const weekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const timeArray = Array.from({ length: 48 }, (_, index) => `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 === 0 ? "00" : "30"}`);

        return (
          <div className='tab'>
            <GenericHeader title={"Editar Horários"} icon={closeIcon} onClickReturn={() => setTab(0)} onClickIcon={() => profileForm.cleanDay(selectedDay, setProfileForm)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={profileForm.daySpan(selectedDay)} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <Carousel
              items={weekDays.map((day, index) => ({
                title: day,
                subtitle: groupForm.daySpan(index),
                select: selectedDay === index,
                onClick: () => setSelectedDay(index),
              }))}
            />
            <ItemList
              items={timeArray
                .filter((_, index) => index >= 12)
                .map((timeValue, index) => {
                  const selected = profileForm.get("hours")[selectedDay]?.[index + 12 - profileForm.get("startHours")[selectedDay]];
                  return {
                    title: timeValue,
                    select: selected,
                    onClick: () => profileForm.updateHourList(selectedDay, index + 12, setProfileForm),
                  };
                })}
            />
            <BottomPopup stage={1} title={weekDays[selectedDay]} subtitle={groupForm.daySpan(selectedDay)} buttonTitle={"Preencher Horários"} onClick={() => profileForm.fillHours(selectedDay, setProfileForm)} />
          </div>
        );
      case 2: // Service tab
        return (
          <div className='tab'>
            <GenericHeader title={"Editar Serviços"} icon={add} onClickReturn={() => setTab(1)} onClickIcon={() => setTab(4)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={`${groupForm.get("activities").length} Serviços criados`} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <ItemList
              items={groupForm
                .get("activities")
                .sort(
                  (
                    a: {
                      _id: string;
                      _activity: Activity;
                    },
                    b: {
                      _id: string;
                      _activity: Activity;
                    }
                  ) => a._activity.get("name").localeCompare(b._activity.get("name"))
                ) // Alphabetical order
                .map((activity: { _id: string; _activity: Activity }) => {
                  return {
                    title: activity._activity.get("name"),
                    subtitle: activity._activity.formattedDuration(),
                    select: profileForm.get("activities").filter((item: { _id: string; _activity: Activity }) => item._activity.get("id") === activity._activity.get("id")),
                    onClick: () => profileForm.handleActivity(activity._id, setProfileForm),
                  };
                })}
            />
          </div>
        );
      case 3: // Occupation Tab
        return (
          <div className='tab'>
            <HeaderInput
              placeholder='Digite a Ocupação'
              value={selectedOccupation !== null ? profileForm.get("occupations")[selectedOccupation] : ""}
              subtitle='Ocupações do profissional'
              icon={bin}
              maxLength={30}
              onChange={(e) => handleOccupationInput(profileForm.get("occupations"), e.target.value)}
              onClickReturn={() => setTab(0)}
              onClickIcon={() => handleDeleteOccupation()}
            />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={`${profileForm.get("occupations").length} Ocupações criadas`} buttonTitle={"Salvar"} onClick={() => setTab(2)} />
            <ItemList
              items={profileForm.get("occupations").map((occupation: { _name: string; _id: string }) => {
                return {
                  title: occupation,
                  select: occupation._id == selectedOccupation,
                  onClick: () => stateSwitcher(selectedOccupation, occupation._id, setSelectedOccupation),
                };
              })}
            />
            <BottomPopup stage={selectedOccupation === null ? 0 : 1} title='' buttonTitle='Adicionar Ocupação' onClick={() => setSelectedOccupation(null)} />
          </div>
        );
      case 4: // Service form
        return <ActivityForm account={account} groupForm={groupForm} setGroupForm={setGroupForm} onClickReturn={() => setTab(2)} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <ProfessionalFormLoading /> : tabHandler();
}
