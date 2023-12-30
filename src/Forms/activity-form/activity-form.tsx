import { Dispatch, SetStateAction, useState } from "react";
import { Account } from "../../Classes/account/account";
import { Activity } from "../../Classes/activity/activity";
import { BottomPopup, GenericHeader, HeaderInput, IconCarousel, ItemList, Line, LinkList, Popup, SmallIconButton, SubHeader, UserPageLoading } from "../../Components/component-imports";
import { add, bin, clock, userIcon } from "../../_global";
import { Profile } from "../../Classes/profile/profile";
import { ErrorPage } from "../../Pages/error-page/error-page";
import { Group } from "../../Classes/group/group";

import './activity-form.css'

type ActivityFormType = {
  account?: Account;
  groupForm: Group;
  setGroupForm: Dispatch<SetStateAction<Group>>;
  activity?: Activity;
  onClickReturn: () => void;
};

export function ActivityForm({ account, groupForm, setGroupForm, activity = new Activity(), onClickReturn }: ActivityFormType) {
  const [loading, setLoading] = useState(false);
  const [activityForm, setActivityForm] = useState(activity);
  const [tab, setTab] = useState(0);

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

  const saveActivity = async () => {
    setLoading(true);
    var updatedActivities = [...groupForm.get("activities")];

    if (activityForm.get("id") === "") {
      activityForm.generateLocalId();
      updatedActivities = [...updatedActivities, activityForm.groupFormat()];
    } else {
      const activityIndex = groupForm.get("activities").findIndex((activity: { _id: string; _activity: Activity }) => activity._id === activityForm.get("id"));
      updatedActivities[activityIndex] = activityForm.groupFormat();
    }

    groupForm.updateValue("activities", updatedActivities, false, setGroupForm);
    setLoading(false);
    onClickReturn();
  };

  const handleProfiles = (profActivities: string[], profile: Profile) => {
    if (profActivities.includes(activityForm.get("id"))) {
      profActivities = profActivities.filter((id) => id !== activityForm.get("id"));
    } else {
      profActivities.push(activityForm.get("id"));
    }
    const profiles = groupForm.get("profiles");
    const foundProfile: {
      _id: string;
      _profile: Profile;
    }[] = profiles.find((prof: { _id: string; _profile: Profile }) => prof._profile.get("id") === profile.get("id"));

    if (foundProfile) {
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    onClickReturn();
    setLoading(false);
  };

  const buttonList = [
    {
      title: "Alterar Tempo de Duração",
      subtitle: `${activityForm.formattedDuration()}`,
      onClick: () => setTab(1),
    },
    {
      title: "Alterar Profissionais",
      subtitle: `${groupForm.get("profiles").length} Profissionais disponíveis`,
      onClick: () => setTab(2),
    },
  ];

  const tabCarousel = [
    {
      title: "Duração",
      select: tab === 1,
      icon: clock,
      onClick: () => setTab(1),
    },
    {
      title: "Profissional",
      select: tab === 2,
      icon: userIcon,
      onClick: () => setTab(2),
    },
  ];

  const tabHandler = () => {
    switch (tab) {
      case 0: // Home tab
        return (
          <div className='tab'>
            <HeaderInput
              placeholder='Nome do serviço'
              value={activityForm.get("name")}
              icon={bin}
              onChange={(e) => activityForm.updateValue("name", e.target.value, setActivityForm)}
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
              onClickIcon={() =>
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
                }))
              }
            />
            <LinkList items={buttonList} />
            <BottomPopup stage={activityForm.isValid() ? 1 : 0} title={"Editando..."} subtitle={"Possui alterações"} buttonTitle={"Salvar alterações"} onClick={async () => await saveActivity()} />
            <Popup title={popupData.title} text={popupData.text} display={popupData.display} onClickExit={popupData.onClickExit} buttons={popupData.buttons} />
          </div>
        );
      case 1: // Duration tab
        const longTimeArray = Array.from({ length: 144 }, (_, i) => `${String((i + 6) % 24).padStart(2, "0")}:${String((i % 6) * 10).padStart(2, "0")}`);

        return (
          <div className='tab'>
            <GenericHeader title={"Alterar Horários"} icon={bin} onClickReturn={() => setTab(0)} onClickIcon={() => activityForm.updateValue("duration", [], setActivityForm)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={activityForm.formattedDuration()} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
            <ItemList
              items={longTimeArray.map((timeValue, index) => {
                return {
                  title: timeValue,
                  select: activityForm.get("duration")?.[index],
                  onClick: () => activityForm.updateHourList(index, setActivityForm),
                };
              })}
            />
            <BottomPopup stage={1} title={activityForm.formattedDuration()} buttonTitle={"Preencher Horários"} onClick={() => activityForm.fillHours(setActivityForm)} />
          </div>
        );
      case 2: // Profile tab
        return (
          <div className='tab'>
            <GenericHeader title={"Alterar Profissionais"} icon={add} onClickReturn={() => setTab(1)} onClickIcon={() => setTab(3)} />
            <IconCarousel items={tabCarousel} />
            <SubHeader title={`${groupForm.get("profiles").length} Profissionais disponíveis`} buttonTitle={"Salvar"} onClick={() => setTab(0)} />
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
                )
                .map((profile: Profile) => {
                  var profActivities = profile.get(`activities`);
                  return {
                    title: profile.get("name"),
                    subtitle: profile.get("occupations").join(", "),
                    select: profActivities.includes(activityForm.get("id")),
                    onClick: () => handleProfiles(profActivities, profile),
                  };
                })}
            />
            <BottomPopup stage={0} />
          </div>
        );
      case 3: // Profile Form
      //return <ProfileForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} onClickReturn={() => setTab(0)} />;
      default:
        return <ErrorPage />;
    }
  };

  return loading ? <UserPageLoading /> : tabHandler();
}
