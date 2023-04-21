import React, { useState } from "react"
import { IconButton } from "../../../components/buttons/icon-button/icon-button"
import { InformationTab } from "./information-tab/information-tab"
import { ServiceTab } from "./service-tab/service-tab"
import { DisponibilityTab } from "./disponibility-tab/disponibility-tab"
import { professionalType, setProfessional } from "../../../controllers/professionalController"

let professionalCache = require('../../../cache/professionalCache.json')

export type professionalTabType = {
    professional: professionalType,
    setProfessional: (professional: professionalType) => void
}

type professionalFormType = {
    professionalId?: number
}

function ProfessionalForm({ professionalId }: professionalFormType) {

    let professional

    if (professionalId !== undefined) {
        professional = professionalCache[professionalId]
    } else {
        professional = {
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
        }
    }

    const [professionalForm, setProfessionalForm] = useState<professionalType>(professional)
    const [tab, setTab] = useState(0)

    function tabRender() {
        switch (tab) {
            case 0:
                return <InformationTab professional={professionalForm} setProfessional={setProfessionalForm} />
            case 1:
                return <ServiceTab professional={professionalForm} setProfessional={setProfessionalForm} />
            case 2:
                return <DisponibilityTab professional={professionalForm} setProfessional={setProfessionalForm} />
            default:
                break;
        }
    }
    return (
        <>
            {
                professionalForm ?
                    <>
                        <div className="service-header">
                            <p>{professionalForm.name}</p>

                        </div>
                        <div className="tabs">
                            <IconButton darkMode={tab == 0} title="Informações Pessoais" icon="a" onClickButton={() => { setTab(0) }} />
                            <IconButton darkMode={tab == 1} title="Alterar Serviços" icon="a" onClickButton={() => { setTab(1) }} />
                            <IconButton darkMode={tab == 2} title="Alterar Horários" icon="a" onClickButton={() => { setTab(2) }} />
                            <IconButton darkMode={tab == 3} title="Excluir Conta" icon="a" onClickButton={() => { setTab(3) }} />
                        </div>
                        {tabRender()}
                        <div onClick={async () => {
                            setProfessional(professionalForm, professionalId?.toString())
                        }}> Salvar</div>
                    </> :
                    <p>error</p>
            }


        </>
    )

}

export default ProfessionalForm