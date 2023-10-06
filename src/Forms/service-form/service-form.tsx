import { useState } from "react";
import { Service } from "../../Classes/service";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";

type ServiceFormType = {
    user?: User
    service?: Service
}
export function ServiceForm({ user, service = new Service() }: ServiceFormType) {
    const [loading, setLoading] = useState(false);
    const [serviceForm, setServiceForm] = useState(service);
    const [tab, setTab] = useState(0)

    const arrow = require("../../Assets/arrow.png");
    const bin = require("../../Assets/delete.png");
    const money = require("../../Assets/money.png");

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className="service-form">
                        <div className="sf-header">
                            <img className="return-button" src={arrow} />
                            <div className="sf-header-text-block">
                                <input className="sf-header-title" placeholder="Nome do Serviço" value={serviceForm.getName()} onChange={(e) => {
                                    serviceForm.setName(e.target.value);
                                    const updatedService = new Service(serviceForm);
                                    setServiceForm(updatedService);
                                }} />
                                <p className="sf-header-subtitle"></p>
                            </div>
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

                            </div>
                            <div className="sf-right-column">

                            </div>
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
