import "./home.css";

import { useEffect, useState } from "react";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { filter, search, sort, userProfile } from "../../_global";
import { Group, User } from "../../Classes/classes-imports";
import { LoadingScreen, VerticalLine, GroupList } from "../../Components/component-imports";

export function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(new User());
  const [groups, setGroups] = useState<any[]>([]);
  const [searchText, setSearch] = useState("");

  const filteredGroups = groups.filter((group: Group) => {
    if (!searchText) {
      return true;
    }

    return group.getTitle().toLowerCase().includes(searchText.toLowerCase());
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      onAuthStateChanged(auth, async (client) => {
        if (client) {
          await user.getUser(client.uid);
          setUser(new User(user));
        }
      });
      const groupList = await user.getGroups();
      setGroups(groupList);
      setLoading(false);
    };

    fetchData();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className='home'>
      <div className='h-header'>
        <p className='h-title'>Boa Tarde {user.getName()}</p>
        <p className='h-subtitle'>Verifique sua agenda para ver seus agendamentos</p>
        <div className='h-searchbar-block'>
          <img className='h-search-icon' src={search} />
          <input className='h-search-input' placeholder='Pesquisar' onChange={(e) => setSearch(e.target.value)} />
          <VerticalLine />
          <img className='h-filter-icon' src={filter} />
        </div>
        <img className='h-user-icon' src={user.getPhoto() || userProfile} onClick={() => navigate("/user")} />
      </div>
      <div className='h-banner-block'>
        <div className='h-banner'>
          <div className='development-message'>
            <p>Obrigado por participar da fase inicial de S-Agenda, Toda opinião é valiosa!</p>
            <p className='dm-signature'>- O desenvolvedor</p>
          </div>
          <p
            className='h-banner-feedback-button'
            onClick={() => {
              const subject = encodeURIComponent("Feedback sobre S-agenda");
              window.location.href = `mailto:lucaspozzif20@gmail.com?subject=${subject}`;
            }}
          >
            Enviar Feedback
          </p>
          <p className='h-banner-schedule-button' onClick={() => navigate(`/user/schedule/${user.getId()}`)}>
            Ver Agenda
          </p>
        </div>
        <div className='hb-bottom'>
          <p className='hb-list-title'>Estabelecimentos Próximos</p>
          <img className='hb-sort-icon' src={sort} />
        </div>
      </div>
      <GroupList
        onClick={() => {
          if (user.getId() == "") navigate("/user");
        }}
        groupList={filteredGroups}
      />
    </div>
  );
}
