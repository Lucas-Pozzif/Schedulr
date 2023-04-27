import { useNavigate } from "react-router-dom";
import { ScheduleButton } from "../../../../components/buttons/schedule-button/schedule-button";
import { SubmitButton } from "../../../../components/buttons/submit-button/submit-button";
import { Line } from "../../../../components/line/line";
import { scheduleTabType } from "../schedule-add";

import './confirmed-tab.css'

const designCache = require('../../../../cache/designCache.json')

export function ConfirmedTab({ schedule, setSchedule }: scheduleTabType) {
    const navigate = useNavigate()
    const date = schedule.selectedDate
    const selectedServices = schedule.selectedServices

    const logo = designCache[0].lightLogo

    return (
        <>
            <div className="confirmed-tab">
                <img className="confirm-logo" src={logo} />
                <div className="ct-text-box">
                    <Line />
                    <p className="confirmed-tab-title title">Parabéns seu serviço foi confirmado!</p>
                    <p className="confirmed-tab-subtitle subtitle">Fique atento às notificações</p>

                    <Line />
                </div>
                <div className="ct-list">
                    {
                        selectedServices.map((selectedService) => {
                            return <ScheduleButton
                                selectedService={selectedService}
                                onClickButton={() => { }}
                                rightButtonText={date}
                            />
                        })
                    }
                </div>
            </div>
            <SubmitButton title="Concluir" onClickButton={() => {
                navigate('/')
            }} hide={false} />
        </>
    )
}
