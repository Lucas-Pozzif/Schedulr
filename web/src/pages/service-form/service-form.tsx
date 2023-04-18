import { useState } from "react"
import { serviceType } from "../../controllers/serviceController"
import { IconButton } from "../../components/buttons/icon-button/icon-button"

import './service-form.css'
import { InformationTab } from "./information-tab/information-tab"

type serviceFormType = {
    service?: serviceType
}

function ServiceForm({ service }: serviceFormType) {

    const defaultService = {
        name: 'Novo serviço',
        stateNames: ['Curto', 'Médio', 'Longo', 'Extra-Longo'],
        stateValues: [50, 100, 150, 200],
        photo: null,
        inicial: false,
        haveStates: true,
        value: 100,
        duration: [true],
        promotion: {
            currentPromotion: null,
            promotedUntil: null
        }
    }

    const {
        name: serviceName,
        stateNames: serviceStateNames,
        stateValues: serviceStateValues,
        photo: servicePhoto,
        inicial: serviceInicial,
        haveStates: serviceHaveStates,
        value: serviceValue,
        duration: serviceDuration,
        promotion: servicePromotion
    } = service || {};

    const [serviceForm, setServiceForm] = useState<serviceType>({
        // Use the extracted default values and the extracted values from the service prop.
        name: serviceName || defaultService.name,
        stateNames: serviceStateNames || defaultService.stateNames,
        stateValues: serviceStateValues || defaultService.stateValues,
        photo: servicePhoto || defaultService.photo,
        inicial: serviceInicial || defaultService.inicial,
        haveStates: serviceHaveStates || defaultService.haveStates,
        value: serviceValue || defaultService.value,
        duration: serviceDuration || defaultService.duration,
        promotion: {
            currentPromotion: (servicePromotion && servicePromotion.currentPromotion) || defaultService.promotion.currentPromotion,
            promotedUntil: (servicePromotion && servicePromotion.promotedUntil) || defaultService.promotion.promotedUntil
        }
    })

    const [tab, setTab] = useState(0)

    function tabRender() {
        switch (tab) {
            case 0:
                return <InformationTab service={serviceForm} setService={setServiceForm} />

            default:
                break;
        }
    }

    return (
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
        </>
    )

}

export { ServiceForm }