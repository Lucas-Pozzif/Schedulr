import { useState } from "react";
import { Group } from "../../Classes/group";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";

type GroupFormType = {
    user?: User
    group?: Group
}
export function GroupForm({ user, group = new Group() }: GroupFormType) {
    const [loading, setLoading] = useState(false);
    const [groupForm, setGroupForm] = useState(group);
    const [GTShow, setGTShow] = useState(false); //Group type
    const [tab, setTab] = useState(0);
    const [dayList, setDayList] = useState(false);
    const [selectedDay, setSelectedDay] = useState(1);

    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

    const addImage = require("../../Assets/add-image.png");
    const locationPin = require("../../Assets/location-pin.png");
    const arrow = require("../../Assets/arrow.png");

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className="group-form">
                        <div className="gf-banner">
                            {
                                groupForm.getBanner() ?
                                    <img className="gf-banner-image" src={groupForm.getBanner()} /> :
                                    <img className="gf-banner-placeholder" src={addImage} />
                            }
                        </div>
                        <div className="gf-profile">
                            {
                                groupForm.getProfile() ?
                                    <img className="gf-profile-image" src={groupForm.getProfile()} /> :
                                    <img className="gf-profile-placeholder" src={addImage} />
                            }
                        </div>
                        <div className="gf-title-block">
                            <input className="gf-title-input" placeholder="Editar nome" value={groupForm.getTitle()} onChange={(e) => {
                                groupForm.setTitle(e.target.value);
                                const updatedGroup = new Group(groupForm);
                                setGroupForm(updatedGroup);
                            }} />
                            <div className="gf-group-type-selector"></div>
                        </div>
                        <div className="gf-data-block">
                            <div className="gf-location-block">
                                <img className="gf-location-icon" src={locationPin} />
                                <input className="gf-location-input" placeholder="Digitar o endereço" value={groupForm.getLocation()} onChange={(e) => {
                                    groupForm.setLocation(e.target.value);
                                    const updatedGroup = new Group(groupForm);
                                    setGroupForm(updatedGroup);
                                }} />
                            </div>
                            <Line />
                            <div className="gf-bottom-columns">
                                <div className="gf-left-column">
                                    <div className="gf-day-selector">
                                        <p className="gf-day-selector-text">{days[selectedDay]}</p>
                                        <img className={"sched-arrow" + dayList ? " up" : " down"} src={arrow} />
                                    </div>
                                    <div className={"gf-day-list" + dayList ? "" : " hidden"}>
                                        {days.map((day) => { return (<p className="gf-day-list-item">{day}</p>) })}
                                    </div>
                                </div>
                                <div className="gf-right-column">
                                    <div className="gf-service-link">
                                        <p className="gf-day-selector-text">Alterar Serviços e Horários</p>
                                        <img className={"sched-arrow right"} src={arrow} />
                                    </div>
                                    <div className="gf-professional-link">
                                        <p className="gf-day-selector-text">Alterar Profissionais</p>
                                        <img className={"sched-arrow right"} src={arrow} />
                                    </div>
                                    <div className="gf-image-group">
                                        <div className="gf-image-add">
                                            <img className="gf-image-add-icon" src={addImage} />
                                        </div>
                                        {groupForm.getImages().map((image) => { return (<img className="gf-image" src={image} />) })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="gf-confirm-tab">
                            <div className="gf-confirm-tab-text-block">
                                <p className="gf-confirm-tab-title"></p>
                                <p className="gf-confirm-tab-subtitle"></p>
                            </div>
                            <button className="gf-confirm-button"></button>
                        </div>
                    </div >
                )
            case 1:
                return (
                    <div className="gf-service-tab">
                        <div className="gf-header">
                            <img className="return-button left" src={arrow} onClick={() => setTab(0)} />
                            <p className="gf-header-title">Editar Serviços</p>
                        </div>
                        <div className="gf-sub-header">
                            <p className="gf-sub-header-title">{ }</p>
                            <button className="gf-sub-header-button">Alterar Horários</button>
                        </div>
                        <div className="gf-service-list">
                            {groupForm.getServices().map((service: string) => {
                                return (
                                    <div className="gf-service-button">
                                        <p className="gf-service-button-title">{ }</p>
                                        <p className="gf-service-button-subtitle">{ }</p>
                                        <div className="selection-circle"></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            case 2:
                return
            default:
                return
        }
    }

    return loading ?
        <LoadingScreen /> :
        tabHandler()
}