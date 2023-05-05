import { useNavigate } from "react-router-dom";
import { Line } from "../../../../components/line/line";
import { scheduleTabType } from "../schedule-add";
import { SubmitButton } from "../../../../components/buttons/submit-button/submit-button";
import { ScheduleButton } from "../../../../components/buttons/item-button/schedule-button/schedule-button";
import { Header } from "../../../../components/header/header";

import './confirmed-tab.css'
import { useState } from "react";

const designCache = require('../../../../cache/designCache.json')

export function ConfirmedTab({ schedule, setSchedule }: scheduleTabType) {
    const [finish, setFinish] = useState<any>('selected')
    const navigate = useNavigate()
    const date = schedule.selectedDate
    const selectedServices = schedule.selectedServices

    setTimeout(() => {
        if (finish === 'selected') setFinish('active')
    }, 500);

    const logo = designCache[0].lightLogo

    return (
        <>
            <div className="confirmed-tab">
                <img className="confirm-logo" src={logo} />
                <div className="ct-text-box">
                    <Line />
                    <Header
                        title="Parabéns! Seu agendamento foi confirmado."
                        subtitle="Você pode verificar seus agendamentos na sua agenda."
                    />
                    <Line />
                </div>
                <div className="ct-list">
                    {
                        selectedServices.map((selectedService) => {
                            if (selectedService.service === null || selectedService.professional === null) return
                            return <ScheduleButton
                                state="active"
                                selectedService={selectedService}
                                detailText={schedule.selectedDate}
                                onClickButton={() => { }}
                            />
                        })
                    }
                </div>
            </div>
            <SubmitButton
                state={finish}
                title="Concluir"
                onClickButton={() => {
                    navigate('/')
                }}
            />
        </>
    )
}
