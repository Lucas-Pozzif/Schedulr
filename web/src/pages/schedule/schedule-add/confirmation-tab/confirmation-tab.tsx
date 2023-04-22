import { useNavigate } from "react-router-dom";
import { getSchedule, setSchedule as updateSchedule, scheduleDayType } from "../../../../controllers/scheduleController";
import { scheduleTabType } from "../schedule-add";
import { setClient } from "../../../../controllers/clientController";

const serviceCache = require('../../../../cache/serviceCache.json')
const professionalCache = require('../../../../cache/professionalCache.json')
const scheduleCache = require('../../../../cache/scheduleCache.json')
const clientCache = require('../../../../cache/clientCache.json')


export function ConfirmationTab({ schedule, setSchedule, setTab }: scheduleTabType) {
    const scheduleDayUnit: scheduleDayType = {
        takenAt: null,
        service: null,
        state: null,
        client: null
    }
    const scheduleDay = Array(144).fill(scheduleDayUnit)

    return (
        <>
            <p>Você confirma seu agendamento?</p>
            <button
                onClick={async () => {
                    schedule.selectedServices.forEach(async (selectedService) => {
                        const serviceId = selectedService.service;
                        const professionalId = selectedService.professional
                        const selectedState = selectedService.state
                        const startTime = selectedService.startTime
                        const clientId = schedule.clientId
                        const date: string = schedule.selectedDate

                        let selectedDaySchedule: scheduleDayType[]

                        if (serviceId != null && professionalId != null && startTime != null) {
                            await getSchedule(selectedService.professional!.toString())
                            const selectedSchedule = scheduleCache[professionalId]

                            if (selectedSchedule?.[date] == undefined) selectedDaySchedule = scheduleDay
                            else selectedDaySchedule = selectedSchedule[date]

                            const duration = serviceCache[serviceId].haveStates ?
                                serviceCache[serviceId].stateDurations[selectedState] :
                                serviceCache[serviceId].duration
                            const lastTrueIndex = duration.lastIndexOf(true);

                            const trueDuration = duration.slice(0, lastTrueIndex + 1);

                            for (let i = 0; i < trueDuration.length; i++) {
                                if (trueDuration[i]) {
                                    selectedDaySchedule[startTime + i].takenAt = new Date().getTime()
                                    selectedDaySchedule[startTime + i].service = serviceId
                                    selectedDaySchedule[startTime + i].state = selectedState
                                    selectedDaySchedule[startTime + i].client = clientId
                                }
                            }
                            selectedSchedule[date] = selectedDaySchedule
                            const client = clientCache[clientId]
                            let clientSchedule = client.schedule

                            if (!clientSchedule[date]) clientSchedule[date] = {
                                [startTime]: [{
                                    service: serviceId,
                                    professional: professionalId
                                }]
                            }
                            else if (clientSchedule[date][startTime] == undefined) clientSchedule[date][startTime] = [{
                                service: serviceId,
                                professional: professionalId
                            }]
                            else clientSchedule[date][startTime].push({
                                service: serviceId,
                                professional: professionalId
                            })

                            setClient({
                                ...client,
                                schedule: clientSchedule
                            }, clientId)
                            updateSchedule(selectedSchedule, professionalId.toString())
                        }
                    })
                    setTab(5)

                }}
            >Confirmar</button>
            {
                schedule.selectedServices.map((selectedService) => {
                    if (selectedService.service != null && selectedService.professional != null) {
                        return (<p>{serviceCache[selectedService.service].name} com {professionalCache[selectedService.professional].name}</p>)
                    }
                })
            }
        </>
    )

}