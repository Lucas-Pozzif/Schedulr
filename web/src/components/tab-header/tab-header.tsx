import { useNavigate } from "react-router-dom"
import { scheduleType, selectedServiceType } from "../../pages/schedule/schedule-add/schedule-add"
import { InviteButton } from "../buttons/invite-button/invite-button"
import { ReturnButton } from "../buttons/return-button/return-button"

import './tab-header.css'
import { ScheduleButton } from "../buttons/schedule-button/schedule-button"

type tabHeaderType = {
    scheduleForm: scheduleType
    tab: number,
    setTab: (tab: number) => void,
    selectedService?: selectedServiceType
}
const placeHolderService: selectedServiceType = {
    service: null,
    state: 0,
    professional: null,
    startTime: null
}

function scheduleFormValidator(tab: number, scheduleForm: scheduleType): boolean {
    switch (tab) {
        case 0:
            return (scheduleForm.selectedDate !== undefined)

        default:
            return false
    }
}

function headerButtonRender(tab: number, setTab: (tab: number) => void, scheduleForm: scheduleType, selectedService: selectedServiceType = placeHolderService) {
    const titles = [
        "Escolha o melhor dia para você!",
        "Escolha os serviços que interessam.",
        "",
        "",
        "Verifique os serviços que você agendou"
    ]
    const subtitles = [
        "Estaremos à disposição!",
        "Selecione e continue.",
        "",
        "",
        "Tudo certo por aqui?"
    ]
    switch (tab) {
        case 0:
        case 1:
        case 4:
            return (
                <div className="th-title-box">
                    <p className="th-title">{titles[tab]}</p>
                    <div className="th-bottom">
                        <p className="th-subtitle">{subtitles[tab]}</p>
                        <InviteButton title="Continuar" onClickButton={() => { return tab < 5 ? setTab(tab + 1) : setTab(5) }} />
                    </div>
                </div>
            )
        case 2:
        case 3:
            return <ScheduleButton selectedService={selectedService} onClickButton={() => { setTab(tab + 1) }} rightButtonText="Continuar" />
    }
}

export function TabHeader({ tab, setTab, scheduleForm, selectedService }: tabHeaderType) {
    const navigate = useNavigate()
    console.log(scheduleForm)
    const titles = [
        "Escolha o melhor dia para você!",
        "Escolha os serviços que interessam.",
        "",
        "",
        "Verifique os serviços que você agendou"
    ]
    const subtitles = [
        "Estaremos à disposição!",
        "Selecione e continue.",
        "",
        "",
        "Tudo certo por aqui?"
    ]


    return (
        <div className="tab-header">
            <ReturnButton onClickButton={() => { return tab <= 0 ? navigate(-1) : setTab(tab - 1) }} />
            {
                headerButtonRender(tab, setTab, scheduleForm, selectedService)
            }
        </div>
    )

}