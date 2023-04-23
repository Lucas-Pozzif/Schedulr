import { scheduleType } from "../../pages/schedule/schedule-add/schedule-add"
import { InviteButton } from "../buttons/invite-button/invite-button"
import { ReturnButton } from "../buttons/return-button/return-button"

import './tab-header.css'

type tabHeaderType = {
    scheduleForm: scheduleType
    tab: number,
    setTab: (tab: number) => void,
}

function scheduleFormValidator(tab: number, scheduleForm: scheduleType): boolean {
    switch (tab) {
        case 0:
            return (scheduleForm.selectedDate !== undefined)

        default:
            return false
    }
}

export function TabHeader({ tab, setTab, scheduleForm }: tabHeaderType) {
    const titles = [
        "Escolha o melhor dia para você!",
        "Escolha os serviços que interessam.",
        "Escolha os profissionais para fazer seus serviços com.",
        "Escolha o melhor horário para cada serviço.",
        "Verifique os serviços que você agendou"
    ]
    const subtitles = [
        "Estaremos à disposição!",
        "Selecione e continue.",
        "Atendimento é nossa prioridade!",
        "Se possível evite sobrepor horários",
        "Tudo certo por aqui?"
    ]


    return (
        <div className="tab-header">
            <ReturnButton onClickButton={() => { return tab <= 0 ? setTab(tab - 1) : setTab(0) }} />
            <div className="th-title-box">
                <p className="th-title">{titles[tab]}</p>
                <div className="th-bottom">
                    <p className="th-subtitle">{subtitles[tab]}</p>
                    <InviteButton title="Continuar" onClickButton={() => { return tab < 5 ? setTab(tab + 1) : setTab(5) }} />
                </div>
            </div>
        </div>
    )

}