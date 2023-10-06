import { Dispatch, SetStateAction, useState } from "react";
import { Service } from "../../Classes/service";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { useNavigate } from "react-router-dom";

import "./service-form.css"
import { SmallButton } from "../../Components/buttons/small-button/small-button";
import { DropdownButton } from "../../Components/buttons/dropdown-button/dropdown-button";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { Header } from "../../Components/header/header";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { Group } from "../../Classes/group";
import { Professional } from "../../Classes/professional";

type ServiceFormType = {
    user?: User
    groupForm: Group
    setGroupForm: Dispatch<SetStateAction<Group>>
    service?: Service
    onClickReturn?: () => void
}
export function ServiceForm({ user, groupForm, setGroupForm, service = new Service(), onClickReturn }: ServiceFormType) {
    const [loading, setLoading] = useState(false);
    const [serviceForm, setServiceForm] = useState(service);
    const [tab, setTab] = useState(0)
    const [selectedSService, setSelectedSService] = useState<null | string>(null)

    const arrow = require("../../Assets/arrow.png");
    const bin = require("../../Assets/delete.png");
    const money = require("../../Assets/money.png");
    const addImage = require("../../Assets/add-image.png");
    const addUser = require("../../Assets/add-user.png");

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className="service-form">
                        <div className="sf-header">
                            <img className="return-button" src={arrow} onClick={onClickReturn} />
                            <div className="sf-header-text-block">
                                <input className="sf-header-title" placeholder="Nome do Serviço" value={serviceForm.getName()} onChange={(e) => {
                                    serviceForm.setName(e.target.value);
                                    const updatedService = new Service(serviceForm);
                                    setServiceForm(updatedService);
                                }} />
                                <p className="sf-header-subtitle">aasdfas</p>
                            </div>
                            <img className="sf-delete-button" src={bin} onClick={() => { alert("ainda não implementado") }} />
                        </div>
                        <div className="sf-data-block">
                            <div className="sf-value-block">
                                <img className="sf-value-icon" src={money} />
                                <input className="sf-value-input" placeholder="Digitar valor" value={serviceForm.getValue()} onChange={(e) => {
                                    serviceForm.setValue(e.target.value);
                                    const updatedService = new Service(serviceForm);
                                    setServiceForm(updatedService);
                                }} />
                            </div>
                            <Line />
                            <div className="sf-bottom-columns">
                                <div className="sf-left-column">
                                    <SmallButton
                                        title={"A partir de"}
                                        isSelected={serviceForm.getInicial()}
                                        onClick={() => {
                                            serviceForm.setInicial(!serviceForm.getInicial())
                                            const updatedService = new Service(serviceForm)
                                            setServiceForm(updatedService)
                                        }}
                                    />
                                    <DropdownButton
                                        title={""}
                                        dropDownItems={[]}
                                    />
                                </div>
                                <div className="sf-right-column">
                                    <LinkButton
                                        title={"Alterar tempo de duração"}
                                        onClick={
                                            () => { setTab(1) }
                                        }
                                    />
                                    <LinkButton
                                        title={"Alterar Profissionais"}
                                        onClick={
                                            () => { setTab(2) }
                                        }
                                    />
                                    <div className="sf-image-group">
                                        <div className="sf-image-add">
                                            <img className="sf-image-add-icon" src={addImage} />
                                        </div>
                                        {serviceForm.getPhotos().map((image) => { return (<img className="gf-image" src={image} />) })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 1:
                const timeArray = [];

                timeArray.push(`0:10`, `0:20`, `0:30`, `0:40`, `0:50`);
                for (let i = 1; i <= 11; i++) {
                    timeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
                }
                timeArray.push(`12:00`);
                const duration = [...serviceForm.getDuration()]
                return (
                    <div className="service-form">
                        <Header
                            title={"Alterar Duração"}
                            icon={""}
                            onClickReturn={() => { setTab(0) }}
                            onClickIcon={() => { }}
                        />
                        <SubHeader
                            title={`${Math.floor((duration.length) / 6)}h ${((duration.length % 6) * 10)}m`}
                            buttonTitle={"Remover espaços"}
                            onClick={() => {
                                const duration = serviceForm.getDuration()
                                duration.map((value, index) => { duration[index] = true })
                                serviceForm.setDuration(duration)
                                const updatedService = new Service(serviceForm)
                                setServiceForm(updatedService)

                            }}
                        />
                        <div className="sf-item-list">
                            {
                                timeArray.map((timeValue, index) => {
                                    return (
                                        <ItemButton
                                            title={timeValue}
                                            subtitle={"Pendente"}
                                            isSelected={serviceForm.getDuration()?.[index]}
                                            onClick={() => {

                                                if (index >= duration.length) {
                                                    const diff = index - duration.length + 1;
                                                    duration.push(...Array(diff).fill(false));
                                                }
                                                duration[index] = !duration[index];
                                                let lastIndex = duration.length - 1;
                                                while (lastIndex >= 0 && !duration[lastIndex]) {
                                                    duration.pop();
                                                    lastIndex--;
                                                }
                                                serviceForm.setDuration(duration)
                                                const updatedService = new Service(serviceForm)
                                                setServiceForm(updatedService)
                                            }}
                                        />

                                    )
                                })
                            }
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="service-form">
                        <Header
                            title={"Editar Profissionais"}
                            icon={addUser}
                            onClickReturn={() => {
                                setTab(0)
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
                                            isSelected={false}
                                            onClick={() => { }}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            default: return <div />
        }
    }

    return loading ?
        <LoadingScreen /> :
        tabHandler()
}
