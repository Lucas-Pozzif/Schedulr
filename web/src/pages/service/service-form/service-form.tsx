import { useState } from "react"
import { InformationTab } from "./information-tab/information-tab"
import { DurationTab } from "./duration-tab/duration-tab"
import { DeleteTab } from "./delete-tab/delete-tab"
import { serviceType, setService } from "../../../controllers/serviceController"
import { VerticalIconButton } from "../../../components/buttons/vertical-icon-button/vertical-icon-button"
import { ReturnButton } from "../../../components/buttons/return-button/return-button"
import { ServiceButton } from "../../../components/buttons/item-button/service-button/service-button"
import { useNavigate } from "react-router-dom"
import { SmallButton } from "../../../components/buttons/small-button/small-button"

import './style.css'

let serviceCache = require('../../../cache/serviceCache.json')

export type ServiceTabType = {
    service: serviceType,
    setService: (service: serviceType) => void
}

type serviceFormType = {
    serviceId?: number
}

function ServiceForm({ serviceId }: serviceFormType) {

    const [tab, setTab] = useState(0)
    const [serviceForm, setServiceForm] = useState<serviceType>(
        serviceId === undefined ?
            {
                name: 'Novo serviço',
                stateNames: ['Curto', 'Médio', 'Longo', 'Extra-Longo'],
                stateValues: [50, 100, 150, 200],
                stateDurations: {
                    0: Array(144).fill(false),
                    1: Array(144).fill(false),
                    2: Array(144).fill(false),
                    3: Array(144).fill(false),
                },
                photo: null,
                inicial: false,
                haveStates: true,
                value: 100,
                duration: Array(144).fill(false),
                promotion: {
                    currentPromotion: null,
                    promotedUntil: null
                }
            } :
            serviceCache[serviceId]
    )
    const navigate = useNavigate()

    function tabRender() {
        switch (tab) {
            case 0:
                return <InformationTab service={serviceForm} setService={setServiceForm} />
            case 2:
                return <DurationTab service={serviceForm} setService={setServiceForm} />
            case 3:
                return <DeleteTab service={serviceForm} setService={setServiceForm} />
            default:
                break;
        }
    }

    return serviceForm ?
        <div className="s-form">
            <div className="flex-div s-form-header">
                <ReturnButton onClickButton={() => navigate(-1)} />
                <div className="s-form-save-block">
                    <ServiceButton
                        state="active"
                        service={serviceForm}
                    />
                    <div className="s-form-save-button">
                        <SmallButton state="active" title="Salvar" onClickButton={async () => {
                            await setService(serviceForm, serviceId?.toString())
                            navigate('/')
                        }}
                        />
                    </div>
                </div>
            </div>
            <div className="s-form-tab-list flex-div">
                <VerticalIconButton state={tab == 0 ? "selected" : 'active'} title="Informações Individuais" icon="a" onClickButton={() => { setTab(0) }} />
                <VerticalIconButton state={tab == 1 ? "inactive" : 'inactive'} title="Alterar Profissionais" icon="a" onClickButton={() => { setTab(1) }} />
                <VerticalIconButton state={tab == 2 ? "selected" : 'active'} title="Tempo de Duração" icon="a" onClickButton={() => { setTab(2) }} />
                <VerticalIconButton state={tab == 3 ? "selected" : 'active'} title="Excluir Serviço" icon="a" onClickButton={() => { setTab(3) }} />
            </div>
            {tabRender()}
        </div> :
        <p>error</p>
}

export default ServiceForm