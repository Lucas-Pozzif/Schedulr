import { useState, useEffect } from 'react'
import { getAllProfessionals } from '../../../../controllers/professionalController';
import { scheduleTabType } from '../schedule-add';
import { LargeButton } from '../../../../components/buttons/large-button/large-button';
import { TabButton } from '../../../../components/buttons/tab-button/tab-button';

const professionalCache = require('../../../../cache/professionalCache.json')
const serviceCache = require('../../../../cache/serviceCache.json')

export function ProfessionalTab({ schedule, setSchedule }: scheduleTabType) {
    const selectedServices = schedule.selectedServices

    const [loading, setLoading] = useState(true);
    const [professionalIds, setProfessionalIds] = useState<string[] | null>(null)
    const [serviceId, setServiceId] = useState<number>(0)
    const [needsProfessional, setNeedsProfessional] = useState(true)

    useEffect(() => {
        getAllProfessionals().then(() => {
            setProfessionalIds(Object.keys(professionalCache));
            setLoading(false);
        });
    }, []);

    return (
        <>
            <p>{needsProfessional ? 'needs' : 'freetogo'}</p>
            {
                selectedServices.map((selectedService) => {
                    const service = selectedService.service
                    const professional = selectedService.professional
                    if (!professional && !needsProfessional) setNeedsProfessional(true)

                    if (service !== null) {
                        return (
                            <>
                                <TabButton
                                    key={service}
                                    darkMode={service == serviceId}
                                    title={serviceCache[service].name}
                                    onClickButton={() => {
                                        setServiceId(service)
                                    }}
                                />
                            </>
                        )
                    }
                })
            }
            <div>{
                loading ?
                    <p>loading...</p> :
                    professionalIds!.map((professionalId: string) => {
                        let newselectedServices = [...schedule.selectedServices]
                        let selectedService = selectedServices.filter((selectedService) => selectedService.service == serviceId)[0]

                        const index = selectedServices.indexOf(selectedService)

                        return (
                            <LargeButton
                                darkMode={parseInt(professionalId) === selectedService?.professional}
                                title={professionalCache[professionalId].name}
                                onClickButton={() => {
                                    if (!selectedService) return

                                    selectedService.professional = parseInt(professionalId)
                                    newselectedServices[index] = selectedService

                                    setNeedsProfessional(false)
                                    setSchedule({
                                        ...schedule,
                                        selectedServices: newselectedServices
                                    })
                                }}
                            />
                        )
                    })
            }
            </div>
        </>
    )
}