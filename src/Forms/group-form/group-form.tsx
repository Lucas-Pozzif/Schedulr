import { useEffect, useRef, useState } from "react";
import { Account } from "../../Classes/account/account";
import { Activity } from "../../Classes/activity/activity";
import { Profile } from "../../Classes/profile/profile";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { BottomPopup, Carousel, GenericHeader, GroupBanner, GroupFormLoading, GroupHeader, IconCarousel, ItemList, Line, LinkList, SubHeader } from "../../Components/component-imports";
import { handleImageInput, idSwitcher, onClickRef } from "../../Function/functions-imports";
import { add, calendar, clock, closeIcon, fullDays, userIcon } from "../../_global";
import { Group } from "../../Classes/group/group";
import { ActivityForm } from "../activity-form/activity-form";
import { ErrorPage } from "../../Pages/error-page/error-page";
import { ProfileForm } from "../profile-form/profile-form";

type GroupFormType = {
  group?: Group;
  onClickReturn?: () => void;
};

export function GroupForm({ group, onClickReturn }: GroupFormType) {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(new Account());
  const [groupForm, setGroupForm] = useState(new Group(group));
  const [tab, setTab] = useState(0);

  const [selectedDay, setSelectedDay] = useState(0); // Weekday
  const [selectedActivity, setSelectedActivity] = useState<null | Activity>(null); // Selected Activity
  const [selectedProfile, setSelectedProfile] = useState<null | Profile>(null); // Selected Profile

  const navigate = useNavigate();
  const bannerRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  const { groupId } = useParams();

  useEffect(() => {
    setLoading(true);

    onAuthStateChanged(auth, async (client) => {
      if (client?.uid) await account.getAccount(client.uid); //It is essential to have an account on this case
      setAccount(new Account(account));

      if (groupId === undefined && groupForm.get("id") === "") {
        //If it is a new group
        groupForm.updateValue("owner", account.get("id"));
        if (!groupForm.get("admins").includes(account.get("id"))) groupForm.updateValue("admins", [...groupForm.get("admins"), account.get("id")]);
      } else {
        await groupForm.getGroup(groupId === undefined ? groupForm.get("id") : groupId); //If it comes from the params
        await groupForm.getActivities();
        await groupForm.getProfiles();
        await groupForm.getImages();
      }

      if (!groupForm.get("admins").includes(account.get("id"))) setTab(-1); //User is not an admin, nor the owner
    });
    setLoading(false);
  }, []);

  const saveGroupForm = async () => {
    setLoading(true);
    // Criar o grupo para ter um id válido
    // Associar as activities e profiles com o novo id e dar ids válidos para elas também
    alert("ainda nao implementado");
    setLoading(false);
  };

  const buttonList = [
    {
      title: "Alterar Serviços",
      subtitle: `${groupForm.get("activities").length} Serviços criados`,
      onClick: () => setTab(2),
    },
    {
      title: "Alterar Profissionais",
      subtitle: `${groupForm.get("profiles").length} Profissionais adicionados`,
      onClick: () => setTab(3),
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
      title: "Profissional",
      select: tab === 3,
      icon: userIcon,
      onClick: () => setTab(3),
    },
  ];

  console.log(account, groupForm);

  const tabHandler = () => {
    switch (tab) {
      case -1: // Invalid User tab
        return (
          <div className='tab'>
            <p onClick={() => navigate("/")}>Ops, você não deveria estar aqui, clique aqui para voltar</p>
          </div>
        );
      case 0: // Group tab
        return (
          <div className='tab'>
            <GroupBanner
              banner={groupForm.get("images")._banner}
              profile={groupForm.get("images")._profile}
              returnButton={true}
              onClickBanner={() => onClickRef(bannerRef)}
              onClickProfile={() => onClickRef(profileRef)}
              onClickReturn={onClickReturn}
            />
            <GroupHeader
              title={groupForm.get("name")}
              subtitle={groupForm.get("type")}
              iconButton={{
                icon: calendar,
                title: "Horários",
                hide: false,
                onClick: () => setTab(1),
              }}
              editMode={true}
              titlePlaceholder={"Nome do estabelecimento"}
              subtitlePlaceholder={"Tipo de estabelecimento"}
              onChangeTitle={(e) => groupForm.updateValue("name", e.target.value, false, setGroupForm)}
              onChangeSubtitle={(e) => groupForm.updateValue("type", e.target.value, false, setGroupForm)}
            />
            <input className='gf-location' placeholder='Endereço do estabelecimento' value={groupForm.get("location")} onChange={(e) => groupForm.updateValue("location", e.target.value, false, setGroupForm)} />
            <Line />
            <LinkList items={buttonList} />
            <BottomPopup stage={groupForm.isValid() ? 1 : 0} title={"Editando..."} subtitle={"Possui alterações"} buttonTitle={"Salvar alterações"} onClick={() => saveGroupForm()} />

            {/* Hidden inputs that are refferencied */}
            <input className='hidden' type='file' accept='image/*' onChange={(event) => handleImageInput(event, groupForm, setGroupForm, "banner")} ref={bannerRef} />
            <input className='hidden' type='file' accept='image/*' onChange={(event) => handleImageInput(event, groupForm, setGroupForm, "profile")} ref={profileRef} />
          </div>
        );
      case 1: // Time tab
        const weekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const timeArray = Array.from({ length: 48 }, (_, index) => `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 === 0 ? "00" : "30"}`);

        return (
          <div className='tab'>
            <GenericHeader title={"Editar Horários"} icon={closeIcon} onClickReturn={() => setTab(0)} onClickIcon={() => groupForm.cleanDay(selectedDay, setGroupForm)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={"Aberto x dias na semana"} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
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
                  const selected = groupForm.get("hours")[selectedDay]?.[index + 12 - groupForm.get("startHours")[selectedDay]];
                  return {
                    title: timeValue,
                    select: selected,
                    onClick: () => groupForm.updateHourList(selectedDay, index + 12, setGroupForm),
                  };
                })}
            />
            <BottomPopup stage={1} title={fullDays[selectedDay]} subtitle={groupForm.daySpan(selectedDay)} buttonTitle={"Preencher Horários"} onClick={() => groupForm.fillHours(selectedDay, setGroupForm)} />
          </div>
        );
      case 2: // Activity tab
        return (
          <div className='tab'>
            <GenericHeader
              title={"Editar Serviços"}
              icon={add}
              onClickReturn={() => setTab(1)}
              onClickIcon={() => {
                setSelectedActivity(null);
                setTab(4);
              }}
            />
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
                    select: selectedActivity?.get("id") == activity._activity.get("id"),
                    onClick: () => idSwitcher(selectedActivity, activity._activity, setSelectedActivity),
                  };
                })}
            />
            <BottomPopup stage={1} title={selectedActivity?.get("name")} subtitle={selectedActivity?.formattedDuration()} buttonTitle={selectedActivity === null ? "Criar Serviço" : "Editar Serviço"} onClick={() => setTab(4)} />
          </div>
        );
      case 3: // Profile tab
        return (
          <div className='tab'>
            <GenericHeader
              title={"Editar Profissionais"}
              icon={add}
              onClickReturn={() => setTab(2)}
              onClickIcon={() => {
                setSelectedProfile(null);
                setTab(5);
              }}
            />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={`${groupForm.get("profiles").length} Profissionais criados`} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <ItemList
              items={groupForm
                .get("profiles")
                .sort(
                  (
                    a: {
                      _id: string;
                      _profile: Profile;
                    },
                    b: {
                      _id: string;
                      _profile: Profile;
                    }
                  ) => a._profile.get("name").localeCompare(b._profile.get("name"))
                ) // Alphabetical order
                .map((profile: Profile) => {
                  return {
                    title: profile.get("name"),
                    subtitle: profile.get("occupations").join(", "),
                    select: selectedProfile?.get("id") === profile.get("id"),
                    onClick: () => idSwitcher(selectedProfile, profile, setSelectedProfile),
                  };
                })}
            />
            <BottomPopup stage={1} title={selectedProfile?.get("name")} subtitle={selectedProfile?.get("occupations").join(", ")} buttonTitle={selectedProfile === null ? "Criar Profissional" : "Editar Profissional"} onClick={() => setTab(5)} />
          </div>
        );
      case 4: // Activity Form
        return <ActivityForm account={account} groupForm={groupForm} setGroupForm={setGroupForm} activity={selectedActivity || undefined} onClickReturn={() => setTab(2)} />;
      case 5: // Profile Form
        return <ProfileForm account={account} groupForm={groupForm} setGroupForm={setGroupForm} profile={selectedProfile || undefined} onClickReturn={() => setTab(3)} />;
      default:
        return <ErrorPage />;
    }
  };
  return loading ? <GroupFormLoading /> : tabHandler();
}
