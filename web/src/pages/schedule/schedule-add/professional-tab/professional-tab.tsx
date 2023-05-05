import { useState, useEffect } from 'react'
import { getAllProfessionals } from '../../../../controllers/professionalController';
import { scheduleTabType, scheduleType, selectedServiceType } from '../schedule-add';

import './style.css'
import { getAllOccupations } from '../../../../controllers/occupationController';
import { ProfessionalButton } from '../../../../components/buttons/image-button/professional-button/professional-button';
import { ReturnButton } from '../../../../components/buttons/return-button/return-button';
import { ScheduleButton } from '../../../../components/buttons/item-button/schedule-button/schedule-button';

const professionalCache = require('../../../../cache/professionalCache.json')
const serviceCache = require('../../../../cache/serviceCache.json')

type serviceListType = {
    services: selectedServiceType[],
    selectedService: selectedServiceType,
    setSelectedService: (service: selectedServiceType) => void
    setSelectedProfessional: (professionalId: string | null) => void
}
type professionalListType = {
    selectedProfessional: string | null
    setSelectedProfessional: (professionalId: string | null) => void,
    selectedServices: selectedServiceType[],
    selectedService: selectedServiceType,
    setSelectedService: (service: selectedServiceType) => void
    schedule: scheduleType,
    setSchedule: (schedule: scheduleType) => void
}

function ServiceList({ services, selectedService, setSelectedService, setSelectedProfessional }: serviceListType) {
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
                                setSelectedProfessional(professionalId == null ? null : professionalId.toString())

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
function ProfessionalList({ selectedProfessional, setSelectedProfessional, selectedServices, selectedService, setSelectedService, schedule, setSchedule }: professionalListType) {
    const [professionalIds, setProfessionalIds] = useState<string[] | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOccupations()
        getAllProfessionals().then(() => {
            setProfessionalIds(Object.keys(professionalCache));
            setLoading(false);
        });
    }, []);

    return (
        <div className='pt-professional-list'>
            {
                loading ?
                    <p>loading...</p> :
                    professionalIds!.map((professionalId: string) => {
                        const selectedServiceIndex = selectedServices.indexOf(selectedServices.find(service => service.service === selectedService.service) || selectedService)
                        const serviceId = selectedService.service

                        const isValid = () => professionalCache[professionalId].services.includes(serviceId)
                        return isValid() ?
                            <ProfessionalButton
                                state={selectedService.professional == parseInt(professionalId) ? 'selected' : 'active'}
                                professional={professionalCache[professionalId]}
                                detailText='Continuar'
                                onClickButton={() => {
                                    setSelectedService({
                                        ...selectedService,
                                        professional: parseInt(professionalId)
                                    })
                                    selectedServices[selectedServiceIndex].professional = parseInt(professionalId)
                                    setSchedule({
                                        ...schedule,
                                        selectedServices: selectedServices
                                    })
                                }}
                            /> :
                            null
                    })
            }
        </div>)
}

export function ProfessionalTab({ schedule, setSchedule, selectedService, setSelectedService, setTab }: scheduleTabType) {
    const selectedServices = schedule.selectedServices

    if (selectedService === undefined) {
        setSelectedService(selectedServices[0])
    }
    const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null)

    console.log(schedule.selectedServices)

    //const [completed, setCompleted] = useState(true)
    if (selectedService === undefined) return <p>error</p>
    return (
        <div className='professional-tab'>
            <div className='flex-div'>
                <ReturnButton onClickButton={() => setTab(1)} />
                <div className='sched-add-prof-tab-sched-block'>
                    <ScheduleButton state='active' selectedService={selectedService} detailText='Continuar' onClickButton={() => setTab(3)} />
                    <ServiceList
                        services={selectedServices}
                        selectedService={selectedService}
                        setSelectedService={setSelectedService}
                        setSelectedProfessional={setSelectedProfessional}
                    />
                </div>
            </div>
            <ProfessionalList
                selectedProfessional={selectedProfessional}
                setSelectedProfessional={setSelectedProfessional}
                selectedServices={selectedServices}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                schedule={schedule}
                setSchedule={setSchedule}
            />
        </div>
    )
}