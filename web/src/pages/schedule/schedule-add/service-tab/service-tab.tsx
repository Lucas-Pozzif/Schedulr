import { useState, useEffect } from "react";
import { scheduleTabType, selectedServiceType } from "../schedule-add";
import { getAllServices } from "../../../../controllers/serviceController";
import { LargeButton } from "../../../../components/buttons/large-button/large-button";
import { ServiceButton } from "../../../../components/buttons/service-button/service-button";

const serviceCache = require('../../../../cache/serviceCache.json')

export function ServiceTab({ schedule, setSchedule }: scheduleTabType) {
    const [loading, setLoading] = useState(true);
    const [serviceIds, setServiceIds] = useState<string[] | null>(null)

    useEffect(() => {
        getAllServices().then(() => {
            setServiceIds(Object.keys(serviceCache));
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {
                loading ?
                    <p>loading...</p> :
                    serviceIds!.map((serviceId: string) => {
                        const service = serviceCache[serviceId]
                        let selectedServices = [...schedule.selectedServices]
                        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))
                        const newSelectedService: selectedServiceType = {
                            service: parseInt(serviceId),
                            state: 0,
                            professional: null,
                            startTime: null
                        }
                        return (
                            <ServiceButton
                                darkmode={filteredService.length > 0}
                                expandedDarkMode={[
                                    filteredService[0]?.state === 0,
                                    filteredService[0]?.state === 1,
                                    filteredService[0]?.state === 2,
                                    filteredService[0]?.state === 3,
                                ]}
                                service={service}
                                onClickButton={() => {
                                    if (service.haveStates) return
                                    filteredService.length <= 0 ?
                                        selectedServices.push(newSelectedService) :
                                        selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
                                    setSchedule({
                                        ...schedule,
                                        selectedServices: selectedServices
                                    });
                                }}
                                onClickExpanded={[
                                    () => {
                                        newSelectedService.state = 0
                                        filteredService.length <= 0 ?
                                            selectedServices.push(newSelectedService) :
                                            selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
                                        setSchedule({
                                            ...schedule,
                                            selectedServices: selectedServices
                                        });
                                    },
                                    () => {
                                        newSelectedService.state = 1
                                        filteredService.length <= 0 ?
                                            selectedServices.push(newSelectedService) :
                                            selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
                                        setSchedule({
                                            ...schedule,
                                            selectedServices: selectedServices
                                        });
                                    },
                                    () => {
                                        newSelectedService.state = 2
                                        filteredService.length <= 0 ?
                                            selectedServices.push(newSelectedService) :
                                            selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
                                        setSchedule({
                                            ...schedule,
                                            selectedServices: selectedServices
                                        });
                                    },
                                    () => {
                                        newSelectedService.state = 3
                                        filteredService.length <= 0 ?
                                            selectedServices.push(newSelectedService) :
                                            selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
                                        setSchedule({
                                            ...schedule,
                                            selectedServices: selectedServices
                                        });
                                    },
                                ]}

                            />
                        )
                    })
            }
        </div>
    )
}