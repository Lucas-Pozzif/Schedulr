import { useEffect, useState } from "react"
import { Group } from "../../Classes/group";
import { GroupList } from "../../Components/group-list/group-list";
import { VerticalLine } from "../../Components/line/line";
import { User } from "../../Classes/user";

import "./home.css";
import { useNavigate } from "react-router-dom";

export function Home() {
    const [user, setUser] = useState(new User())

    const navigate = useNavigate()

    const group = new Group()
    group.getGroup("2")

    const search = require('../../Assets/search.png');
    const filter = require('../../Assets/filter.png');
    const sort = require('../../Assets/sort.png');

    return (
        <div className="home">
            <div className="h-header">
                <p className="h-title">Boa Tarde {user.getName()}</p>
                <p className="h-subtitle">Você não tem agendamentos</p>
                <div className="h-searchbar-block">
                    <img className="h-search-icon" src={search} />
                    <input className="h-search-input" placeholder="Pesquisar" />
                    <VerticalLine />
                    <img className="h-filter-icon" src={filter} />
                </div>
                <img className="h-user-icon" src={""} onClick={() => { navigate("/user") }} />
            </div>
            <div className="h-banner-block">
                <div className="h-banner">
                </div>
                <div className="hb-bottom">
                    <p className="hb-list-title">Estabelecimentos Próximos</p>
                    <img className="hb-sort-icon" src={sort} />
                </div>
            </div>
            <GroupList groupList={[group, group, group, group, group, group]} />
        </div>
    )
}