import React, { useState } from "react"
import { InformationTab } from "./information-tab/information-tab"
import { DurationTab } from "./duration-tab/duration-tab"
import { DeleteTab } from "./delete-tab/delete-tab"

import './service-form.css'
import { getService, serviceType, setService } from "../../../controllers/serviceController"
import { IconButton } from "../../../components/buttons/icon-button/icon-button"

let serviceCache = require('../../../cache/serviceCache.json')

export type ServiceTabType = {
    service: serviceType,
    setService: (service: serviceType) => void
}

type serviceFormType = {
    serviceId?: number
}

function ServiceForm({ serviceId }: serviceFormType) {

    let service

    if (serviceId !== undefined) {
        service = serviceCache[serviceId]
    } else {
        service = {
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
        }
    }

    const [serviceForm, setServiceForm] = useState<serviceType>(service)
    const [tab, setTab] = useState(0)

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

    return (
        <>
            {
                serviceForm ?
                    <>
                        <div className="service-header">
                            <p>{serviceForm.name}</p>

                        </div>
                        <div className="tabs">
                            <IconButton darkMode={tab == 0} title="Informações Individuais" icon="a" onClickButton={() => { setTab(0) }} />
                            <IconButton darkMode={tab == 1} title="Alterar Profissionais" icon="a" onClickButton={() => { setTab(1) }} />
                            <IconButton darkMode={tab == 2} title="Tempo de Duração" icon="a" onClickButton={() => { setTab(2) }} />
                            <IconButton darkMode={tab == 3} title="Excluir Serviço" icon="a" onClickButton={() => { setTab(3) }} />
                        </div>
                        {tabRender()}
                        <div onClick={async () => {
                            setService(serviceForm, serviceId?.toString())
                        }}> Salvar</div>
                    </> :
                    <p>error</p>
            }


        </>
    )

}

export default ServiceForm