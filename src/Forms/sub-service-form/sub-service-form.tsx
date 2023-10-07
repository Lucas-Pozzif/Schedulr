import { Dispatch, SetStateAction, useState } from "react"
import { Service, SubService } from "../../Classes/service"
import { User } from "../../Classes/user"
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen"
import { ServiceForm } from "../service-form/service-form"
import { Line } from "../../Components/line/line"
import { SmallButton } from "../../Components/buttons/small-button/small-button"
import { LinkButton } from "../../Components/buttons/link-button/link-button"
import { SubHeader } from "../../Components/sub-header/sub-header"
import { ItemButton } from "../../Components/buttons/item-button/item-button"

import './sub-service-form.css'
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button"

type subServiceFormType = {
    user?: User
    serviceForm: Service
    setServiceForm: Dispatch<SetStateAction<Service>>
    subService?: SubService
    onClickReturn?: () => void
}

export function SubServiceForm({ user, serviceForm, setServiceForm, subService = new SubService(), onClickReturn }: subServiceFormType) {
    const [loading, setLoading] = useState(false);
    const [sServiceForm, setSServiceForm] = useState(subService);
    const [tab, setTab] = useState(0)

    const arrow = require("../../Assets/arrow.png");
    const more = require("../../Assets/more.png");
    const bin = require("../../Assets/delete.png");
    const money = require("../../Assets/money.png");
    const addImage = require("../../Assets/add-image.png");
    const addUser = require("../../Assets/add-user.png");

    const timeArray: string[] = [];

    timeArray.push(`0:10`, `0:20`, `0:30`, `0:40`, `0:50`);
    for (let i = 1; i <= 11; i++) {
        timeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
    }
    timeArray.push(`12:00`);
    const duration = [...sServiceForm.getDuration()]

    return loading ?
        <LoadingScreen /> :
        <div className="sub-service-form">
            <div className="ssf-header">
                <img className="return-button" src={arrow} onClick={onClickReturn} />
                <div className="ssf-header-text-block">
                    <input className="ssf-header-title" placeholder="Nome do Subserviço" value={sServiceForm.getName()} onChange={(e) => {
                        sServiceForm.setName(e.target.value);
                        const updatedSService = new SubService(sServiceForm);
                        setSServiceForm(updatedSService);
                    }} />
                    <p className="ssf-header-subtitle">{serviceForm.getName()}</p>
                </div>
                <img className="ssf-delete-button" src={bin} onClick={() => { alert("ainda não implementado") }} />
            </div>
            <div className="ssf-data-block">
                <div className="ssf-value-block">
                    <img className="ssf-value-icon" src={money} />
                    <input className="ssf-value-input" placeholder="Digitar valor" value={sServiceForm.getValue()} onChange={(e) => {
                        sServiceForm.setValue(e.target.value);
                        const updatedSService = new SubService(sServiceForm);
                        setSServiceForm(updatedSService);
                    }} />
                </div>
                <Line />
                <div className="ssf-bottom-columns">
                    <div className="ssf-left-column">
                        <SmallButton
                            title={"A partir de"}
                            isSelected={sServiceForm.getInicial()}
                            onClick={() => {
                                sServiceForm.setInicial(!sServiceForm.getInicial())
                                const updatedSService = new SubService(sServiceForm)
                                setSServiceForm(updatedSService)
                            }}
                        />
                    </div>
                    <div className="ssf-right-column">
                        <SubHeader
                            title={`${Math.floor((duration.length) / 6)}h ${((duration.length % 6) * 10)}m`}
                            buttonTitle={"Remover espaços"}
                            onClick={() => {
                                const duration = sServiceForm.getDuration()
                                duration.map((value, index) => { duration[index] = true })
                                sServiceForm.setDuration(duration)
                                const updatedSService = new SubService(sServiceForm)
                                setSServiceForm(updatedSService)

                            }}
                        />
                        <div className="sf-item-list">
                            {
                                timeArray.map((timeValue, index) => {
                                    return (
                                        <ItemButton
                                            title={timeValue}
                                            subtitle={"Pendente"}
                                            isSelected={sServiceForm.getDuration()?.[index]}
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
                                                sServiceForm.setDuration(duration)
                                                const updatedSService = new SubService(sServiceForm)
                                                setSServiceForm(updatedSService)
                                            }}
                                        />

                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <BottomButton hide={false} title={"Salvar Subserviço"} onClick={onClickReturn} />
        </div>

}