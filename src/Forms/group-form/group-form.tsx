import { useState } from "react";
import { Group } from "../../Classes/group";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { Service } from "../../Classes/service";
import { Professional } from "../../Classes/professional";
import { Header } from "../../Components/header/header";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { BottomPopup } from "../../Components/buttons/bottom-popup/bottom-popup";
import { DropdownButton } from "../../Components/buttons/dropdown-button/dropdown-button";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { ItemButton } from "../../Components/buttons/item-button/item-button";

import "./group-form.css"
import { ServiceForm } from "../service-form/service-form";

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
    const [selectedProfessional, setSelectedProfessional] = useState<null | string>(null);

    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    const fullDays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]

    const addImage = require("../../Assets/add-image.png");
    const locationPin = require("../../Assets/location-pin.png");
    const arrow = require("../../Assets/arrow.png");
    const more = require("../../Assets/more.png");
    const addUser = require("../../Assets/add-user.png");

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
                                    <DropdownButton
                                        title={days[selectedDay]}
                                        dropDownItems={days.map((day, index) => { return [day, () => setSelectedDay(index)] })}
                                    />
                                </div>
                                <div className="gf-right-column">
                                    <LinkButton title="Alterar Serviços e Horários" onClick={() => { setTab(1) }} />
                                    <LinkButton title="Alterar Profissionais" onClick={() => { setTab(3) }} />
                                    <div className="gf-image-group">
                                        <div className="gf-image-add">
                                            <img className="gf-image-add-icon" src={addImage} />
                                        </div>
                                        {groupForm.getImages().map((image) => { return (<img className="gf-image" src={image} />) })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BottomPopup
                            title="Editando..."
                            subtitle="Possui Alterações"
                            buttonTitle="Salvar Alterações"
                            onClick={() => {

                            }}
                        />
                    </div >
                )
            case 1:
                return (
                    <div className="gf-tab">
                        <Header
                            title="Editar Serviços"
                            icon={more}
                            onClickReturn={() => {
                                setTab(0)
                                setSelectedService(null)
                            }}
                            onClickIcon={() => { setTab(4) }}
                        />
                        <SubHeader
                            title=""
                            buttonTitle="Alterar Horários"
                            onClick={() => {
                                setTab(2)
                                setSelectedService(null)
                            }}
                        />
                        <div className="gf-list">
                            {
                                groupForm.getServicesIds().map((serviceId: string, index: number) => {
                                    const service = new Service()
                                    const serviceList = groupForm.getServices()
                                    service.getService(serviceId)
                                    serviceList[index] = service

                                    const updatedGroup = new Group(groupForm)
                                    setGroupForm(updatedGroup)

                                    return (
                                        <div className={"gf-button" + (selectedService === serviceId ? " selected" : "")} onClick={() => { setSelectedService(serviceId) }}>
                                            <p className="gf-button-title">{service.getName()}</p>
                                            <p className="gf-button-subtitle">profissionais que fazem o serviço, pendente{ }</p>
                                            <div className={"selection-circle" + (selectedService === serviceId ? " selected" : "")}>
                                                <div className="selection-inner-circle"></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <BottomButton
                            hide={selectedService == null}
                            title="Editar Serviço"
                            onClick={() => { alert("ainda não implementado") }}
                        />
                    </div>
                )
            case 2:
                const timeArray = [];

                for (let i = 0; i <= 24; i++) {
                    timeArray.push(`${i}:00`, `${i}:30`);
                }
                return (
                    <div className="gf-tab">
                        <Header
                            title="Alterar Horários"
                            icon=""
                            onClickIcon={() => { }}
                            onClickReturn={() => { setTab(1) }}
                        />
                        <SubHeader
                            title={fullDays[selectedDay]}
                            buttonTitle="Limpar horários"
                            onClick={() => {
                                const startHours = [...groupForm.getStartHours()]
                                const hours = [...groupForm.getHours()]
                                startHours[selectedDay] = 0
                                hours[selectedDay] = []
                                groupForm.setStartHours(startHours)
                                groupForm.setHours([])
                                const updatedGroupForm = new Group(groupForm)
                                setGroupForm(updatedGroupForm)
                            }}
                        />
                        <div className="gf-day-carrousel">
                            {
                                fullDays.map((day, index) => {
                                    return (<p className={"gf-day-carrousel-item" + (selectedDay == index ? " selected" : "")} onClick={() => { setSelectedDay(index) }}>{day}</p>)
                                })
                            }
                        </div>
                        <div className="gf-list">
                            {
                                timeArray.map((timeValue, index) => {
                                    const startHour = [...groupForm.getStartHours()]
                                    const hours = [...groupForm.getHours()];
                                    const selected = groupForm.getHours()[selectedDay]?.[index - groupForm.getStartHours()[selectedDay]]

                                    return (
                                        <ItemButton
                                            title={timeValue}
                                            subtitle={"Pendente"}
                                            isSelected={selected}
                                            onClick={() => {
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
                                            }}
                                        />

                                    )
                                })
                            }
                        </div>
                        <BottomButton
                            hide={false}
                            title={"Confirmar"}
                            onClick={() => { setTab(1) }}
                        />
                    </div>
                )
            case 3:
                return (
                    <div className="gf-tab">
                        <Header
                            title={"Editar Profissionais"}
                            icon={addUser}
                            onClickReturn={() => {
                                setTab(0)
                                setSelectedProfessional(null)
                            }}
                            onClickIcon={() => {
                                alert('ainda não implementado')

                            }}
                        />
                        <div className="gf-professional-list">
                            {
                                groupForm.getProfessionalsIds().map((professionalId: string, index: number) => {
                                    const professional = new Professional()
                                    const professionalList = groupForm.getProfessionals()
                                    professional.getProfessional(professionalId)
                                    professionalList[index] = professional

                                    const updatedGroup = new Group(groupForm)
                                    setGroupForm(updatedGroup)

                                    return (
                                        <ItemButton
                                            title={professional.getName()}
                                            subtitle={professional.getOccupations().join(', ')}
                                            isSelected={selectedProfessional === professionalId}
                                            onClick={() => { setSelectedProfessional(professionalId) }}
                                        />
                                    )
                                })
                            }
                        </div>
                        <BottomButton
                            hide={selectedProfessional == null}
                            title={"Editar Serviço"}
                            onClick={() => { alert('ainda não implementado') }}
                        />
                    </div>
                )
            case 4:

                const services = groupForm.getServices()
                const service = services.find((service) => { return service.getId() == selectedService })
                console.log(services, service)
                return (<ServiceForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} service={service} onClickReturn={() => { setTab(1) }} />)
            default:
                return <div />
        }
    }

    return loading ?
        <LoadingScreen /> :
        tabHandler()
}