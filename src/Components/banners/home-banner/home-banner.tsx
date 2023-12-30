import { useNavigate } from "react-router-dom";
import { User } from "../../../Classes/classes-imports";
import { findRepetitionBlocks } from "../../../Function/functions-imports";
import { WhiteButton } from "../../component-imports";
import { HomeBannerLoading } from "../../loading/home-banner-loading/home-banner-loading";
import "./home-banner.css";
import { useState, useEffect } from "react";
import { Account } from "../../../Classes/account/account";

type HomeBannerType = {
  account: Account;
};

export function HomeBanner({ account }: HomeBannerType) {
  const [loading, setLoading] = useState(false);
  const [scheduleToday, setScheduleToday] = useState<any>();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const day = new Date();
      const formattedDay = day.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      if (account.get("id")) {
        await account.getScheduleDay(day);
        setScheduleToday(account.get("schedule")[formattedDay]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return loading ? (
    <HomeBannerLoading />
  ) : (
    <div className='home-banner'>
      <div className='hb-message-block'>
        <p className='hb-message'>Obrigado por participar da fase inicial de S-Agenda, Toda opinião é valiosa!</p>
        <p className='hb-signature'>- O desenvolvedor</p>
      </div>
      <div className='hb-buttons'>
        <WhiteButton
          title='Enviar Feedback'
          onClick={() => {
            const subject = encodeURIComponent("Feedback sobre S-agenda");
            window.location.href = `mailto:lucaspozzif.feedback@gmail.com?subject=${subject}`;
          }}
        />
        <WhiteButton title={account.get("id") === "" ? "Fazer Login" : "Ver Agenda"} onClick={() => navigate(`/account${account.get("id") === "" ? "" : `/schedule/${account.get("id")}`}`)} />
      </div>
    </div>
  );
}
