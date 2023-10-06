import { useState } from "react";
import { Service } from "../../Classes/service";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Components/header/header";

type ServiceFormType = {
    user?: User
    service?: Service
}
export function ServiceForm({ user, service = new Service() }: ServiceFormType) {
    const [loading, setLoading] = useState(false);
    const [serviceForm, setServiceForm] = useState(service);
    const [tab, setTab] = useState(0)
    const [selectedSService, setSelectedSService] = useState<null | string>(null)

    const navigate = useNavigate()

    const arrow = require("../../Assets/arrow.png");
    const bin = require("../../Assets/delete.png");
    const money = require("../../Assets/money.png");
    const addImage = require("../../Assets/add-image.png");

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className="service-form">
                        <div className="sf-header">
                            <img className="return-button" src={arrow} onClick={() => { navigate(-1) }} />
                            <div className="sf-header-text-block">
                                <input className="sf-header-title" placeholder="Nome do Serviço" value={serviceForm.getName()} onChange={(e) => {
                                    serviceForm.setName(e.target.value);
                                    const updatedService = new Service(serviceForm);
                                    setServiceForm(updatedService);
                                }} />
                                <p className="sf-header-subtitle"></p>
                            </div>
                            <img className="sf-delete-button" src={bin} onClick={() => { alert("ainda não implementado") }} />
                        </div>
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
                                <p className={"sf-inicial-selector" + (serviceForm.getInicial() ? " selected" : "")} onClick={() => {
                                    serviceForm.setInicial(!serviceForm.getInicial)
                                    const updatedService = new Service(serviceForm)
                                    setServiceForm(updatedService)
                                }}>A partir de</p>
                                <div className="sf-subservice-selector">
                                    <p className="sf-subservice-title">{ }</p>
                                    <img className="sched-arrow up" src={arrow} />
                                </div>
                            </div>
                            <div className="sf-right-column">
                                <div className="sf-selector" onClick={() => { setTab(1) }}>
                                    <p className="sf-selector-text">Alterar tempo de duração</p>
                                    <img className={"sched-arrow right"} src={arrow} />
                                </div>
                                <div className="sf-selector" onClick={() => { setTab(2) }}>
                                    <p className="sf-selector-text">Alterar profissionais</p>
                                    <img className={"sched-arrow right"} src={arrow} />
                                </div>
                            </div>
                            <div className="sf-image-group">
                                <div className="sf-image-add">
                                    <img className="sf-image-add-icon" src={addImage} />
                                </div>
                                {serviceForm.getPhotos().map((image) => { return (<img className="gf-image" src={image} />) })}
                            </div>
                        </div>
                    </div>
                )
            case 1:
            default: return <div />
        }
    }

    return loading ?
        <LoadingScreen /> :
        tabHandler()
}
