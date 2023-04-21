import { scheduleTabType } from "../schedule-add";

const serviceCache = require('../../../../cache/serviceCache.json')
const professionalCache = require('../../../../cache/professionalCache.json')
const scheduleCache = require('../../../../cache/scheduleCache.json')

export function ConfirmedTab({ schedule, setSchedule }: scheduleTabType) {
    const date = schedule.selectedDate
    const selectedServices = schedule.selectedServices

    return (
        <>
            <p>Parabéns seu serviço foi confirmado!</p>
            <p>{date}</p>

            {
                selectedServices.map((selectedService) => {
                    const professionalId = selectedService.professional
                    const serviceId = selectedService.service
                    const startTime = selectedService.startTime

                    if (professionalId == null || serviceId == null) return

                    return (
                        <div>
                            <p>{professionalCache[professionalId].name}</p>
                            <p>{serviceCache[serviceId].name}</p>
                        </div>
                    )
                })
            }


        </>

    )
}
