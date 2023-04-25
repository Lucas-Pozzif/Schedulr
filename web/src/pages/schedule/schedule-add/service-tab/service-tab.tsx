import { useState, useEffect } from "react";
import { scheduleTabType, selectedServiceType } from "../schedule-add";
import { getAllServices } from "../../../../controllers/serviceController";
import { ServiceButton } from "../../../../components/buttons/service-button/service-button";

import './service-tab.css'

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

    function onClickExpandedHandler(serviceId: string) {
        var functions: [() => void, () => void, () => void, () => void] = [() => { }, () => { }, () => { }, () => { }]

        var selectedServices = [...schedule.selectedServices]
        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))
        const newSelectedService: selectedServiceType = {
            service: parseInt(serviceId),
            state: 0,
            professional: null,
            startTime: null
        }

        for (let i = 0; i < 4; i++) {
            functions[i] = (() => {
                newSelectedService.state = i
                filteredService.length <= 0 ?
                    selectedServices.push(newSelectedService) :
                    selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
                setSchedule({
                    ...schedule,
                    selectedServices: selectedServices
                });
            })
        }
        return functions
    }
    function onClickHandler(serviceId: string) {
        const service = serviceCache[serviceId]
        let selectedServices = [...schedule.selectedServices]
        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))
        const newSelectedService: selectedServiceType = {
            service: parseInt(serviceId),
            state: 0,
            professional: null,
            startTime: null
        }

        if (service.haveStates) return
        filteredService.length <= 0 ?
            selectedServices.push(newSelectedService) :
            selectedServices = selectedServices.filter((selectedService) => selectedService.service !== parseInt(serviceId))
        setSchedule({
            ...schedule,
            selectedServices: selectedServices
        });

    }
    function expandedSelectedList(serviceId: string): [boolean, boolean, boolean, boolean] {
        let selectedServices = [...schedule.selectedServices]
        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))

        return [
            filteredService[0]?.state === 0,
            filteredService[0]?.state === 1,
            filteredService[0]?.state === 2,
            filteredService[0]?.state === 3,
        ]

    }

    return (
        <div className="service-tab">
            {
                loading ?
                    <p>loading...</p> :
                    serviceIds!.map((serviceId: string) => {
                        let selectedServices = [...schedule.selectedServices]
                        const service = serviceCache[serviceId]
                        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))

                        return (
                            <ServiceButton
                                selected={filteredService.length > 0}
                                expandedselected={expandedSelectedList(serviceId)}
                                service={service}
                                onClickButton={() => { onClickHandler(serviceId) }}
                                onClickExpanded={onClickExpandedHandler(serviceId)}
                            />
                        )
                    })
            }
        </div>
    )
}