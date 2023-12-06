import "./home.css";

import { useEffect, useState } from "react";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { Group, User } from "../../Classes/classes-imports";
import { GroupList, HomeBanner, HomeHeader, HomePageLoading, HomeSearchBar, ThickLine } from "../../Components/component-imports";
import { sort } from "../../_global";

export function Home() {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(new User());
  const [groups, setGroups] = useState<any[]>([]);
  const [searchText, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      onAuthStateChanged(auth, async (client) => {
        if (client?.uid) {
          await user.getUser(client.uid);
        }
        const groupList = await user.getGroups();
        setGroups(groupList);
        setLoading(false);
      });
    };

    fetchData();
  }, []);

  const filteredGroups = groups.filter((group: Group) => {
    if (!searchText) {
      return true;
    }

    return group.getTitle().toLowerCase().includes(searchText.toLowerCase());
  });

  return loading ? (
    <HomePageLoading />
  ) : (
    <div className='tab'>
      <HomeHeader user={user} onClickProfile={() => navigate("/user")} />
      <HomeSearchBar placeholder={"Pesquisar"} value={searchText} onChange={(e) => setSearch(e.target.value)} />
      <ThickLine />
      <HomeBanner user={user} />
      <div className='hp-group-title-block'>
        <p className='hp-group-title'>Estabelecimentos Próximos</p>
        <img className='hp-sort-icon' src={sort} />
      </div>
      <ThickLine />
      <GroupList
        onClick={() => {
          if (user.getId() == "") navigate("/user");
        }}
        groupList={filteredGroups}
      />
    </div>
  );
}
