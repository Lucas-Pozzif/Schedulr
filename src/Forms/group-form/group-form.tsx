import { useState } from "react";
import { Group } from "../../Classes/group";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { Service } from "../../Classes/service";

import "./group-form.css"

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
    const [selectedDay, setSelectedDay] = useState(2);
    const [selectedService, setSelectedService] = useState<null | string>(null);

    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    const fullDays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]

    const addImage = require("../../Assets/add-image.png");
    const locationPin = require("../../Assets/location-pin.png");
    const arrow = require("../../Assets/arrow.png");
    const more = require("../../Assets/more.png");

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
                            <div className="gf-group-type-selector">
                                <p className="gf-group-type-selector-title">Tipo de estabelecimento</p>
                            </div>
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
                                    <div className="gf-selector">
                                        <p className="gf-selector-text">{days[selectedDay]}</p>
                                        <img className={"sched-arrow" + (dayList ? " up" : " down")} src={arrow} />
                                    </div>
                                    <div className={"gf-day-list" + (dayList ? "" : " hidden")}>
                                        {days.map((day) => { return (<p className="gf-day-list-item">{day}</p>) })}
                                    </div>
                                </div>
                                <div className="gf-right-column">
                                    <div className="gf-selector" onClick={() => { setTab(1) }}>
                                        <p className="gf-selector-text">Alterar Serviços e Horários</p>
                                        <img className={"sched-arrow right"} src={arrow} />
                                    </div>
                                    <div className="gf-selector" onClick={() => { setTab(3) }}>
                                        <p className="gf-selector-text">Alterar Profissionais</p>
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
                                <p className="gf-confirm-tab-title">Editando...</p>
                                <p className="gf-confirm-tab-subtitle">Possui Alterações</p>
                            </div>
                            <p className="gf-confirm-button">Salvar Alterações</p>
                        </div>
                    </div >
                )
            case 1:
                return (
                    <div className="gf-service-tab">
                        <div className="gf-header">
                            <img className="return-button left" src={arrow} onClick={() => {
                                setTab(0)
                                setSelectedService(null)
                            }} />
                            <p className="gf-header-title">Editar Serviços</p>
                            <img className="gf-add-service-button" src={more} onClick={() => { alert('ainda não implementado') }} />
                        </div>
                        <div className="gf-sub-header">
                            <div className="gf-sub-header-left"></div>
                            <button className="gf-sub-header-button" onClick={() => {
                                setTab(2)
                                setSelectedService(null)
                            }}>Alterar Horários</button>
                        </div>
                        <div className="gf-service-list">
                            {
                                groupForm.getServicesIds().map((serviceId: string, index: number) => {
                                    const service = new Service()
                                    const serviceList = groupForm.getServices()
                                    service.getService(serviceId)
                                    serviceList[index] = service

                                    const updatedGroup = new Group(groupForm)
                                    setGroupForm(updatedGroup)

                                    return (
                                        <div className={"gf-service-button" + selectedService === serviceId ? " selected" : ""} onClick={() => { setSelectedService(serviceId) }}>
                                            <p className="gf-service-button-title">{service.getName()}</p>
                                            <p className="gf-service-button-subtitle">profissionais que fazem o serviço, pendente{ }</p>
                                            <div className={"selection-circle" + selectedService === serviceId ? " selected" : ""}>
                                                <div className="selection-inner-circle"></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={"gf-service-edit-button" + selectedService !== null ? "" : " hidden"} onClick={() => { alert("ainda não implementado") }}>
                            <p className="gf-service-edit-button-title">Editar Serviço</p>
                        </div>
                    </div>
                )
            case 2:
                const timeArray = [];

                for (let i = 0; i <= 24; i++) {
                    timeArray.push(`${i}:00`, `${i}:30`);
                }
                return (
                    <div className="gf-time-tab">
                        <div className="gf-header">
                            <img className="return-button left" src={arrow} onClick={() => {
                                setTab(1)
                            }} />
                            <p className="gf-header-title">Alterar Horários</p>
                        </div>
                        <div className="gf-sub-header">
                            <div className="gf-sub-header-left">
                                <p className="gf-sub-header-text">{fullDays[selectedDay]}</p>
                            </div>
                            <button className="gf-sub-header-button" onClick={() => {
                            }}>Bloquear o dia</button>
                        </div>
                        <div className="gf-day-carrousel">
                            {
                                fullDays.map((day, index) => {
                                    return (
                                        <div className="gf-day-carrousel-item" onClick={() => { setSelectedDay(index) }}>
                                            <p className="gf-day-carrousel-title">{day}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="gf-time-list">
                            {
                                timeArray.map((timeValue, index) => {
                                    const startHour = [...groupForm.getStartHours()]
                                    const hours = [...groupForm.getHours()];
                                    const selected = groupForm.getHours()[selectedDay]?.[index - groupForm.getStartHours()[selectedDay]]

                                    return (
                                        <div className={"gf-time-button" + (selected ? " selected" : "")} onClick={() => {
                                            if (!startHour[selectedDay]) { startHour[selectedDay] = 0; }
                                            startHour[selectedDay] = parseInt(startHour[selectedDay].toString());

                                            if (isNaN(startHour[selectedDay])) { startHour[selectedDay] = 0; }

                                            if (startHour[selectedDay] > 0) {
                                                const falseValuesToAdd = Array(startHour[selectedDay]).fill(false);
                                                hours[selectedDay] = [...falseValuesToAdd, ...hours[selectedDay]];
                                                startHour[selectedDay] = 0;
                                            }
                                            if (!hours[selectedDay]) { hours[selectedDay] = []; }

                                            if (index >= hours[selectedDay].length) {
                                                const diff = index - hours[selectedDay].length + 1;
                                                hours[selectedDay].push(...Array(diff).fill(false));
                                            }
                                            hours[selectedDay][index] = !hours[selectedDay][index];
                                            let lastIndex = hours[selectedDay].length - 1;
                                            while (lastIndex >= 0 && !hours[selectedDay][lastIndex]) {
                                                hours[selectedDay].pop();
                                                lastIndex--;
                                            }
                                            startHour[selectedDay] = hours[selectedDay].indexOf(true);
                                            for (let i = 0; i < startHour[selectedDay]; i++) {
                                                hours[selectedDay].shift();
                                            }
                                            groupForm.setHours(hours)
                                            groupForm.setStartHours(startHour)
                                            const updatedGroupForm = new Group(groupForm)
                                            setGroupForm(updatedGroupForm)
                                        }}>
                                            <p className="gf-time-button-title">{timeValue}{selected ? " - selected" : ""}</p>
                                            <p className="gf-time-button-subtitle">pendente{groupForm.getHours()[index]}</p>
                                            <div className={"selection-circle" + (selected ? " selected" : "")}>
                                                <div className="selection-inner-circle"></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            case 3:
                return (<div className=""></div>)
            default:
                return <div />
        }
    }

    return loading ?
        <LoadingScreen /> :
        tabHandler()
}