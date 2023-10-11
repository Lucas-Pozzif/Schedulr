import { Group } from "../../Classes/group";
import { GroupList } from "../../Components/group-list/group-list";
import { VerticalLine } from "../../Components/line/line";

import "./home.css";

export function Home() {
    const group = new Group()
    group.getGroup("1")

    return (
        <div className="home">
            <div className="h-header">
                <p className="h-title">Boa Tarde User</p>
                <p className="h-subtitle">Você não tem agendamentos</p>
                <div className="h-searchbar-block">
                    <img className="h-search-icon" />
                    <input className="h-search-input" />
                    <VerticalLine />
                    <img className="h-filter-icon" />
                </div>
                <img className="h-user-icon" />
            </div>
            <div className="h-banner-block">
                <div className="h-banner">
                </div>
                <p className="hb-list-title">Estabelecimentos Próximos</p>
                <img className="hb-sort-icon" />
            </div>
            <GroupList groupList={[group]} />
        </div>
    )
}