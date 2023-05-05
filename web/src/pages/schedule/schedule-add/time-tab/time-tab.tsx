import { useState, useEffect } from 'react'
import { scheduleTabType, scheduleType, selectedServiceType } from "../schedule-add";
import { getSchedule } from '../../../../controllers/scheduleController';
import { ItemButton } from '../../../../components/buttons/item-button/item-button';
import { arrayIndexToTime } from '../../../../functions/array-index-to-time/array-index-to-time';
import { ReturnButton } from '../../../../components/buttons/return-button/return-button';
import { ScheduleButton } from '../../../../components/buttons/item-button/schedule-button/schedule-button';

const serviceCache = require('../../../../cache/serviceCache.json')
const scheduleCache = require('../../../../cache/scheduleCache.json')

type serviceListType = {
    services: selectedServiceType[],
    selectedService: selectedServiceType,
    setSelectedService: (service: selectedServiceType) => void
}

type timeListType = {
    services: selectedServiceType[],
    selectedService: selectedServiceType,
    setSelectedService: (selectedService: selectedServiceType) => void
    schedule: scheduleType,
    setSchedule: (schedule: scheduleType) => void
}

function ServiceList({ services, selectedService, setSelectedService }: serviceListType) {
    return (
        <div className='pt-service-list'>
            {
                services.map(service => {
                    const serviceId = service.service
                    const professionalId = service.professional

                    const isSelected = () => professionalId !== null ? 'selected' : ''

                    if (serviceId === null || selectedService.service == serviceId) return
                    return (
                        <p
                            className={`pt-service-item button button-text ${isSelected()}`}
                            onClick={() => {
                                setSelectedService(service)

                            }}
                        >
                            {serviceCache[serviceId].name}
                        </p>
                    )
                })
            }
        </div>
    )
}

function TimeList({ services, selectedService, setSelectedService, schedule, setSchedule }: timeListType) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        services.map(async (selectedService: selectedServiceType) => {
            setLoading(true);
            const professionalId = selectedService.professional

            if (professionalId == null) return
            await getSchedule(professionalId.toString())
            setLoading(false);
        });
    }, []);

    const hours: string[] = [];
    const selectedServiceIndex = services.indexOf(services.find(service => service.service === selectedService.service) || selectedService)
    for (let hour = 0; hour < 24; hour++) {
        hours.push(`${hour}:00`);
        hours.push(`${hour}:10`);
        hours.push(`${hour}:20`);
        hours.push(`${hour}:30`);
        hours.push(`${hour}:40`);
        hours.push(`${hour}:50`);
    }

    return (
        <div className='service-tab'>
            {
                loading ?
                    <p>loading</p> :
                    hours.map((hour) => {
                        const hourIndex = hours.indexOf(hour);

                        const isValid = () => {
                            const professionalId = selectedService.professional
                            const serviceId = selectedService.service
                            const selectedState = selectedService.state
                            const date = schedule.selectedDate;

                            const emptyScheduleDay = {
                                takenAt: null,
                                state: null,
                                client: null,
                                service: null
                            }

                            if (professionalId === null || serviceId === null) return false
                            const profSchedule = scheduleCache[professionalId]
                            const selectedDate = profSchedule?.[date] ?
                                profSchedule[date] :
                                Array(144).fill(emptyScheduleDay)

                            //if the service have states, then it will use the state time, it will use the normal duration otherwise
                            const duration = serviceCache[serviceId].haveStates ?
                                serviceCache[serviceId].stateDurations[selectedState] :
                                serviceCache[serviceId].duration
                            const reducedDuration = duration.slice(0, duration.lastIndexOf(true) + 1);


                            for (let i = 0; i < reducedDuration.length; i++) {
                                if (selectedDate[hourIndex + i]?.takenAt !== null) return false
                            }

                            //const sameProfessionalServices = schedule.selectedServices.filter(service => (service.professional == professionalId && service.service !== serviceId))

                            return true
                        }

                        return isValid() ?
                            <ItemButton
                                state={selectedService.startTime == hourIndex ? 'selected' : 'active'}
                                title={hour}
                                detailText={schedule.selectedDate}
                                onClickButton={() => {
                                    setSelectedService({
                                        ...selectedService,
                                        startTime: hourIndex
                                    })
                                    services[selectedServiceIndex].startTime = hourIndex
                                    setSchedule({
                                        ...schedule,
                                        selectedServices: services
                                    })

                                }}
                            /> :
                            null
                    })
            }
        </div>
    )
}

export function TimeTab({ schedule, setSchedule, selectedService, setSelectedService, setTab }: scheduleTabType) {
    const selectedServices = schedule.selectedServices;
    if (selectedService === undefined) {
        setSelectedService(selectedServices[0])
    }

    if (selectedService === undefined) return <p>error</p>
    return (
        <div>
            <div className='flex-div'>
                <ReturnButton onClickButton={() => setTab(2)} />
                <div className='sched-add-prof-tab-sched-block'>
                    <ScheduleButton state='active' selectedService={selectedService} detailText='Continuar' onClickButton={() => setTab(4)} />
                    <ServiceList
                        services={selectedServices}
                        selectedService={selectedService}
                        setSelectedService={setSelectedService}
                    />
                </div>
            </div>
            <TimeList
                services={selectedServices}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                schedule={schedule}
                setSchedule={setSchedule}
            />
        </div>
    )
}
