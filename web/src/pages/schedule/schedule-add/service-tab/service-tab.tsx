import { useState, useEffect } from "react";
import { scheduleTabType, selectedServiceType } from "../schedule-add";
import { getAllServices } from "../../../../controllers/serviceController";

import './style.css'
import { ServiceButton } from "../../../../components/buttons/item-button/service-button/service-button";
import { Header } from "../../../../components/header/header";

const serviceCache = require('../../../../cache/serviceCache.json')

export function ServiceTab({ schedule, setSchedule, setTab }: scheduleTabType) {
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
    function expandedSelectedList(serviceId: string): [
        'active' | 'selected' | 'inactive',
        'active' | 'selected' | 'inactive',
        'active' | 'selected' | 'inactive',
        'active' | 'selected' | 'inactive'
    ] {
        let selectedServices = [...schedule.selectedServices]
        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))

        return [
            filteredService[0]?.state === 0 ? 'selected' : 'active',
            filteredService[0]?.state === 1 ? 'selected' : 'active',
            filteredService[0]?.state === 2 ? 'selected' : 'active',
            filteredService[0]?.state === 3 ? 'selected' : 'active',
        ]

    }

    return (
        <div className="service-tab">
            <Header
                title="Escolha os serviços que interessam"
                subtitle="Selecione e continue"
                buttonTitle="Escolher Serviços"

                onClickReturn={() => setTab(0)}
                onClickButton={() => setTab(2)}
            />
            {
                loading ?
                    <p>loading...</p> :
                    serviceIds!.map((serviceId: string) => {
                        let selectedServices = [...schedule.selectedServices]
                        const service = serviceCache[serviceId]
                        const filteredService = selectedServices.filter((selectedService) => selectedService.service === parseInt(serviceId))

                        return (
                            <ServiceButton
                                state={filteredService.length > 0 ? 'selected' : 'active'}
                                expandedState={expandedSelectedList(serviceId)}
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