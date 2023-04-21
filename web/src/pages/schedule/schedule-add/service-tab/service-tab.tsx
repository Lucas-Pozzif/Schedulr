import { useState, useEffect } from "react";
import { scheduleTabType, selectedServiceType } from "../schedule-add";
import { getAllServices } from "../../../../controllers/serviceController";
import { LargeButton } from "../../../../components/buttons/large-button/large-button";

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
                        let selectedServices = [...schedule.selectedServices]
                        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))
                        const newSelectedService: selectedServiceType = {
                            service: parseInt(serviceId),
                            state: 0,
                            professional: null,
                            startTime: null
                        }
                        return (
                            <LargeButton
                                darkMode={filteredService.length > 0}
                                title={serviceCache[serviceId].name}
                                onClickButton={
                                    () => {
                                        filteredService.length <= 0 ?
                                            selectedServices.push(newSelectedService) :
                                            selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
                                        setSchedule({
                                            ...schedule,
                                            selectedServices: selectedServices
                                        });
                                    }
                                }
                            />
                        )
                    })
            }
        </div>
    )
}