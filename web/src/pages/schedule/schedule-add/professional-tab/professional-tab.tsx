import { useState, useEffect } from 'react'
import { getAllProfessionals } from '../../../../controllers/professionalController';
import { scheduleTabType, scheduleType, selectedServiceType } from '../schedule-add';
import { LargeButton } from '../../../../components/buttons/large-button/large-button';
import { TabButton } from '../../../../components/buttons/tab-button/tab-button';

import './professional-tab.css'
import { ProfessionalButton } from '../../../../components/buttons/professional-button/professional-button';
import { getAllOccupations } from '../../../../controllers/occupationController';

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
function ProfessionalList({ selectedProfessional, setSelectedProfessional, selectedServices, selectedService, schedule, setSchedule }: professionalListType) {
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
                        const isSelected = () => professionalId === selectedProfessional
                        return (
                            <ProfessionalButton
                                selected={isSelected()}
                                professional={professionalCache[professionalId]}
                                rightButtonTitle='Continuar'
                                onClickButton={() => {
                                    setSelectedProfessional(professionalId)
                                    let newselectedServices = [...schedule.selectedServices]
                                    const index = selectedServices.indexOf(selectedService)

                                    selectedService.professional = parseInt(professionalId)
                                    newselectedServices[index] = selectedService
                                    setSchedule({
                                        ...schedule,
                                        selectedServices: newselectedServices
                                    })
                                }}
                            />
                        )
                    })
            }
        </div>)
}

export function ProfessionalTab({ schedule, setSchedule, setTab }: scheduleTabType) {
    const selectedServices = schedule.selectedServices

    const [selectedService, setSelectedService] = useState(selectedServices[0])
    const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null)

    //const [completed, setCompleted] = useState(true)

    return (
        <div className='professional-tab'>
            <ServiceList
                services={selectedServices}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                setSelectedProfessional={setSelectedProfessional}
            />
            <ProfessionalList
                selectedProfessional={selectedProfessional}
                setSelectedProfessional={setSelectedProfessional}
                selectedServices={selectedServices}
                selectedService={selectedService}
                schedule={schedule}
                setSchedule={setSchedule}
            />
        </div>
    )
}