import React, { useEffect, useState } from "react"
import { DayTab } from "./day-tab/day-tab"
import { ServiceTab } from "./service-tab/service-tab"
import { ProfessionalTab } from "./professional-tab/professional-tab"
import { TimeTab } from "./time-tab/time-tab"
import { ConfirmationTab } from "./confirmation-tab/confirmation-tab"
import { Link, useNavigate } from "react-router-dom"
import StateTab from "../../../components/tabs/state-tab/state-tab"
import { ConfirmedTab } from "./confirmed-tab/confirmed-tab"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../firebase/firebase"
import { getClient } from "../../../controllers/clientController"

const clientCache = require('../../../cache/clientCache.json')

export type scheduleType = {
    clientId: number
    selectedDate: string,
    startedAt: number,
    selectedServices: selectedServiceType[]
}

export type selectedServiceType = {
    service: number | null,
    state: number,
    professional: number | null,
    startTime: number | null
}

export type scheduleTabType = {
    schedule: scheduleType,
    setSchedule: (schedule: scheduleType) => void,
    setTab: (tab: number) => void
}

function ScheduleAdd() {

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return navigate('/login');

            await getClient(user.uid)
            if (!clientCache[user.uid]) return navigate('/login');

        });
    }, [navigate]);

    const [tab, setTab] = useState(0)
    const [scheduleForm, setScheduleForm] = useState<scheduleType>({
        clientId: 0,
        selectedDate: new Date().toLocaleDateString('en-US'),
        startedAt: new Date().getTime(),
        selectedServices: []
    })


    function tabRender() {
        switch (tab) {
            case 0:
                return (
                    <>
                        <button onClick={() => { setTab(1) }}>Avancar</button>
                        <DayTab schedule={scheduleForm} setSchedule={setScheduleForm} setTab={setTab} />
                    </>
                )
            case 1:
                return (
                    <>
                        <button onClick={() => { setTab(0) }}>Retornar</button>
                        <button onClick={() => { setTab(2) }}>Avancar</button>
                        <ServiceTab schedule={scheduleForm} setSchedule={setScheduleForm} setTab={setTab} />
                    </>
                )
            case 2:
                return (
                    <>
                        <button onClick={() => { setTab(1) }}>Retornar</button>
                        <button onClick={() => { setTab(3) }}>Avancar</button>
                        <ProfessionalTab schedule={scheduleForm} setSchedule={setScheduleForm} setTab={setTab} />
                    </>
                )
            case 3:
                return (
                    <>
                        <button onClick={() => { setTab(2) }}>Retornar</button>
                        <button onClick={() => { setTab(4) }}>Avancar</button>
                        <TimeTab schedule={scheduleForm} setSchedule={setScheduleForm} setTab={setTab} />
                    </>
                )
            case 4:
                return (
                    <>
                        <ConfirmationTab schedule={scheduleForm} setSchedule={setScheduleForm} setTab={setTab} />
                    </>
                )
            case 5:
                return (
                    <>
                        <ConfirmedTab schedule={scheduleForm} setSchedule={setScheduleForm} setTab={setTab} />
                    </>
                )
            default:
                break;
        }
    }

    return (
        <>
            {tabRender()}
        </>

    )
}
export default ScheduleAdd