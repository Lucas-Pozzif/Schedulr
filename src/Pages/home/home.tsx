import "./home.css";

import { useEffect, useState } from "react";
import { auth } from "../../Services/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { User } from "../../Classes/classes-imports";
import { GroupList, HomeBanner, HomeHeader, HomePageLoading, HomeSearchBar, ThickLine } from "../../Components/component-imports";
import { sort } from "../../_global";
import { Group } from "../../Classes/group/group";
import { Account } from "../../Classes/account/account";

export function Home() {
  const [loading, setLoading] = useState(false);

  const [account, setAccount] = useState(new Account());
  const [groups, setGroups] = useState<any[]>([]);
  const [searchText, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      onAuthStateChanged(auth, async (client) => {
        if (client?.uid) await account.getAccount(client.uid);
        const groupList: any = []; //await account.getGroups();
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

    return group.get("name").toLowerCase().includes(searchText.toLowerCase());
  });

  return loading ? (
    <HomePageLoading />
  ) : (
    <div className='tab'>
      <HomeHeader account={account} onClickProfile={() => navigate("/account")} />
      <HomeSearchBar placeholder={"Pesquisar"} value={searchText} onChange={(e) => setSearch(e.target.value)} />
      <ThickLine />
      <HomeBanner account={account} />
      <div className='hp-group-title-block'>
        <p className='hp-group-title'>Estabelecimentos Próximos</p>
        <img className='hp-sort-icon' src={sort} />
      </div>
      <ThickLine />
      <GroupList groupList={filteredGroups} />
    </div>
  );
}
