import { useState } from "react"
import { InformationTab } from "./information-tab/information-tab"
import { ServiceTab } from "./service-tab/service-tab"
import { DisponibilityTab } from "./disponibility-tab/disponibility-tab"
import { professionalType, setProfessional } from "../../../controllers/professionalController"
import { VerticalIconButton } from "../../../components/buttons/vertical-icon-button/vertical-icon-button"
import { ReturnButton } from "../../../components/buttons/return-button/return-button"
import { ProfessionalButton } from "../../../components/buttons/image-button/professional-button/professional-button"
import { useNavigate } from "react-router-dom"

import './style.css'

let professionalCache = require('../../../cache/professionalCache.json')

export type professionalTabType = {
    professional: professionalType,
    setProfessional: (professional: professionalType) => void
}

type professionalFormType = {
    professionalId?: number
}

function ProfessionalForm({ professionalId }: professionalFormType) {
    const navigate = useNavigate()

    const [tab, setTab] = useState(0)
    const [professionalForm, setProfessionalForm] = useState<professionalType>(
        professionalId === undefined ?
            {
                name: 'Novo Profissional',
                email: null,
                photo: null,
                occupations: [],
                services: [],
                disponibility: {
                    0: Array(144).fill(true),
                    1: Array(144).fill(true),
                    2: Array(144).fill(true),
                    3: Array(144).fill(true),
                    4: Array(144).fill(true),
                    5: Array(144).fill(true),
                    6: Array(144).fill(true)
                },
                lastOnline: null
            } :
            professionalCache[professionalId]
    )

    function tabRender() {
        switch (tab) {
            case 0:
                return <InformationTab professional={professionalForm} setProfessional={setProfessionalForm} />
            case 1:
                return <ServiceTab professional={professionalForm} setProfessional={setProfessionalForm} />
            case 2:
                return <DisponibilityTab professional={professionalForm} setProfessional={setProfessionalForm} />
            default:
                return <p>error</p>;
        }
    }
    return professionalForm ?
        <div className="p-form">
            <div className="flex-div p-form-header">
                <ReturnButton onClickButton={() => navigate(-1)} />
                <ProfessionalButton
                    state="active"
                    professional={professionalForm}
                    detailText="Salvar"
                    onClickDetailButton={async () => {
                        setProfessional(professionalForm, professionalId?.toString())
                        navigate('/professional')
                    }}
                />
            </div>
            <div className="p-form-tab-list flex-div">
                <VerticalIconButton state={tab == 0 ? 'selected' : 'active'} title="Informações Pessoais" icon="a" onClickButton={() => { setTab(0) }} />
                <VerticalIconButton state={tab == 1 ? 'selected' : 'active'} title="Alterar Serviços" icon="a" onClickButton={() => { setTab(1) }} />
                <VerticalIconButton state={tab == 2 ? 'selected' : 'active'} title="Alterar Horários" icon="a" onClickButton={() => { setTab(2) }} />
                <VerticalIconButton state={'inactive'} title="Excluir Conta" icon="a" onClickButton={() => { }} />
            </div>
            {tabRender()}
        </div> :
        <p>error</p>
}

export default ProfessionalForm