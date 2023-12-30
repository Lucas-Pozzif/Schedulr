import { Account } from "../../../Classes/account/account";
import { User } from "../../../Classes/classes-imports";
import { defaultUser } from "../../../_global";
import { HomeHeaderLoading } from "../../loading/home-header-loading/home-header-loading";
import "./home-header.css";
import { useState, useEffect } from "react";

type HomeHeaderType = {
  account: Account;
  onClickProfile: () => void;
};

export function HomeHeader({ account, onClickProfile }: HomeHeaderType) {
  const [loading, setLoading] = useState(false);
  const [scheduleToday, setScheduleToday] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const day = new Date();
      const formattedDay = day.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      if (account.get(`id`)) {
        await account.getScheduleDay(day);
        setScheduleToday(account.get("schedule")[formattedDay]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const now = new Date();
  const currentHour = now.getHours();
  let salutation;

  if (currentHour >= 0 && currentHour < 5) {
    salutation = "Boa madrugada";
  } else if (currentHour >= 5 && currentHour < 12) {
    salutation = "Bom Dia";
  } else if (currentHour >= 12 && currentHour < 17) {
    salutation = "Boa tarde";
  } else {
    salutation = "Boa noite";
  }
  const subtitle = scheduleToday === undefined ? `Você não tem nenhum agendamento hoje,` : `Você tem agendamentos hoje,`;
  const subtitle2 = scheduleToday === undefined ? "que tal agendar alguma coisa?" : "verifique sua agenda";

  return loading ? (
    <HomeHeaderLoading />
  ) : (
    <div className='home-header'>
      <p className='hh-salutation'>
        {salutation} {account.get("name")}!
      </p>
      <p className='hh-subtitle'>{subtitle}</p>
      <p className='hh-subtitle'>{subtitle2}</p>
      <img className='hh-profile' src={account.get("profile") || defaultUser} onClick={onClickProfile} />
    </div>
  );
}
