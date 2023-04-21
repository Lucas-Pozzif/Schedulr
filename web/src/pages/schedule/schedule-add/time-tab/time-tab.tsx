import { useState,useEffect } from 'react'
import { LargeButton } from "../../../../components/buttons/large-button/large-button";
import { TabButton } from "../../../../components/buttons/tab-button/tab-button";
import { scheduleTabType, selectedServiceType } from "../schedule-add";
import { getSchedule, scheduleDayType } from '../../../../controllers/scheduleController';

const serviceCache = require('../../../../cache/serviceCache.json')
const scheduleCache = require('../../../../cache/scheduleCache.json')


export function TimeTab({ schedule, setSchedule }: scheduleTabType) {
    let selectedServices = [...schedule.selectedServices]
    let selectedService: selectedServiceType = selectedServices[0];

    const [loading, setLoading] = useState(true);
    const [needsHour, setNeedsHour] = useState(true);
    const [professionalIds, setProfessionalIds] = useState<string[] | null>(null)

    const clientId = schedule.clientId;
    const date: string = schedule.selectedDate;

    const emptyScheduleDay: scheduleDayType = {
        takenAt: null,
        client: null,
        service: null
    }

    selectedServices.map(async (selectedService: selectedServiceType) => {
        const professionalId = selectedService.professional

        if (professionalId == null) return
        await getSchedule(professionalId.toString())
        setLoading(false);
    });


    function ServiceListRender() {
        return (
            <>
                {
                    selectedServices.map((selectedService: selectedServiceType) => {
                        const serviceId = selectedService.service
                        const startTime = selectedService.startTime
                        const professionalId = selectedService.professional
                        const selectedServiceIndex = selectedServices.indexOf(selectedService)

                        if (serviceId == null || professionalId == null) return
                        if (!startTime && !needsHour) setNeedsHour(true)

                        return (
                            <>
                                <TabButton
                                    key={serviceId}
                                    darkMode={selectedService.service == serviceId}
                                    title={serviceCache[serviceId].name}
                                    onClickButton={async () => {
                                        await getSchedule(professionalId!.toString())
                                        selectedService = selectedServices[selectedServiceIndex]
                                    }}
                                />
                            </>
                        )

                    })
                }
            </>
        )
    }
    function HourListRender() {
        const hours: string[] = [];
        const selectedServiceIndex = selectedServices.indexOf(selectedService)

        for (let hour = 0; hour < 24; hour++) {
            hours.push(`${hour}:00`);
            hours.push(`${hour}:10`);
            hours.push(`${hour}:20`);
            hours.push(`${hour}:30`);
            hours.push(`${hour}:40`);
            hours.push(`${hour}:50`);
        }
        return (
            <>
                {
                    loading ?
                        <p>loading</p> :
                        hours.map((hour) => {
                            const hourIndex = hours.indexOf(hour);

                            const professionalId = selectedService.professional
                            const serviceId = selectedService.service
                            const startTime = selectedService.startTime

                            if (professionalId == null || serviceId == null) return
                            const profSchedule = scheduleCache[professionalId]

                            let selectedSchedule: scheduleDayType[]
                            profSchedule?.[date] ?
                                selectedSchedule = profSchedule[date] :
                                selectedSchedule = Array(144).fill(emptyScheduleDay)
                            const duration = serviceCache[serviceId].duration
                            const lastTrueIndex = duration.lastIndexOf(true);

                            const trueDuration = duration.slice(0, lastTrueIndex + 1);

                            let valid = true

                            for (let i = 0; i < trueDuration.length; i++) {

                                if (selectedSchedule[hourIndex + i]?.takenAt !== null) valid = false
                            }
                            if (!valid) return


                            return (
                                <LargeButton
                                    key={hour}
                                    darkMode={selectedService.startTime == hourIndex}
                                    title={hour}
                                    onClickButton={
                                        () => {
                                            if (!selectedService) return
                                            selectedService.startTime = hourIndex
                                            selectedServices[selectedServiceIndex] = selectedService
                                            setSchedule({
                                                ...schedule,
                                                selectedServices: selectedServices
                                            })
                                        }
                                    }
                                />
                            )
                        })
                }
            </>
        )
    }

    return (
        <>
            <ServiceListRender />
            <HourListRender />
        </>
    )
}
