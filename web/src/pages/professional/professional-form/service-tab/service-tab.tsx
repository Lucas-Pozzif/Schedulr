import { useState, useEffect } from "react";
import { professionalTabType } from "../professional-form";
import { getAllServices } from "../../../../controllers/serviceController";
import updateProfessional from "../../../../functions/updaters/update-professional";
import { ServiceButton } from "../../../../components/buttons/service-button/service-button";

const serviceCache = require('../../../../cache/serviceCache.json')

export function ServiceTab({ professional, setProfessional }: professionalTabType) {
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
                        return (
                            <ServiceButton
                                selected={professional.services.includes(serviceId)}
                                allowExpand={false}
                                service={service}
                                onClickButton={() => {
                                    let services = [...professional.services]

                                    services.includes(serviceId) ?
                                        services = services.filter(i => i !== serviceId) :
                                        services.push(serviceId)

                                    updateProfessional(professional, setProfessional, 'services', services)
                                }}
                            />)
                    })
            }
        </div>
    )
}