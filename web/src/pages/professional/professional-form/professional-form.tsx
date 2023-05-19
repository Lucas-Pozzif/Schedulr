import { useState } from "react"
import { InformationTab } from "./information-tab/information-tab"
import { ServiceTab } from "./service-tab/service-tab"
import { DisponibilityTab } from "./disponibility-tab/disponibility-tab"
import { professionalType, setProfessional } from "../../../controllers/professionalController"
import { VerticalIconButton } from "../../../components/buttons/vertical-icon-button/vertical-icon-button"
import { ReturnButton } from "../../../components/buttons/return-button/return-button"
import { ProfessionalButton } from "../../../components/buttons/image-button/professional-button/professional-button"
import { useNavigate } from "react-router-dom"
import { DeleteTab } from "./delete-tab/delete-tab"
import { uploadDataUrl } from "../../../controllers/imageController"
import { LoadingScreen } from "../../../components/loading/loading-screen/loading-screen"

import './style.css'
const designCache = require("../../../cache/designCache.json")

let professionalCache = require('../../../cache/professionalCache.json')

export type professionalTabType = {
    professional: professionalType,
    setProfessional: (professional: professionalType) => void
    professionalId?: number
}

type professionalFormType = {
    professionalId?: number
}

function ProfessionalForm({ professionalId }: professionalFormType) {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0)
    const [professionalForm, setProfessionalForm] = useState<professionalType>(
        professionalId === undefined ?
            {
                name: 'Novo Profissional',
                email: null,
                photo: designCache[0].icons.account.selected,
                occupations: [],
                services: [],
                disponibility: {
                    0: Array(144).fill(false),
                    1: Array(144).fill(false),
                    2: Array(144).fill(false),
                    3: Array(144).fill(false),
                    4: Array(144).fill(false),
                    5: Array(144).fill(false),
                    6: Array(144).fill(false)
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
                return <DeleteTab professional={professionalForm} setProfessional={setProfessionalForm} professionalId={professionalId} />
        }
    }
    return !loading ?
        <div className="p-form">
            <div className="flex-div p-form-header">
                <ReturnButton onClickButton={() => navigate(-1)} />
                <ProfessionalButton
                    state="active"
                    professional={professionalForm}
                    detailText="Salvar"
                    onClickDetailButton={async () => {
                        setLoading(true)
                        const photo = professionalForm.photo.startsWith("http")
                            ? professionalForm.photo
                            : await uploadDataUrl(professionalForm.photo, "professionals", professionalId);
                        await setProfessional({ ...professionalForm, photo: photo }, professionalId?.toString());
                        navigate('/professional');
                    }}
                />
            </div>
            <div className="p-form-tab-list flex-div">
                <VerticalIconButton state={tab == 0 ? 'selected' : 'active'} title="Informações Pessoais" icon={designCache[0].icons.idCard[tab == 0 ? "active" : "selected"]} onClickButton={() => { setTab(0) }} />
                <VerticalIconButton state={tab == 1 ? 'selected' : 'active'} title="Alterar Serviços" icon={designCache[0].icons.service[tab == 1 ? "active" : "selected"]} onClickButton={() => { setTab(1) }} />
                <VerticalIconButton state={tab == 2 ? 'selected' : 'active'} title="Alterar Horários" icon={designCache[0].icons.time[tab == 2 ? "active" : "selected"]} onClickButton={() => { setTab(2) }} />
                <VerticalIconButton state={tab == 3 ? 'selected' : 'active'} title="Excluir Conta" icon={designCache[0].icons.delete[tab == 3 ? "active" : "selected"]} onClickButton={() => { setTab(3) }} />
            </div>
            {tabRender()}
        </div> :
        <LoadingScreen />
}

export default ProfessionalForm