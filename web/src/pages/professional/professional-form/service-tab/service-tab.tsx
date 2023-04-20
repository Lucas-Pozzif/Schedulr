import { useState, useEffect } from "react";
import { professionalTabType } from "../professional-form";
import { getAllServices } from "../../../../controllers/serviceController";
import updateProfessional from "../../../../functions/updaters/update-professional";

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
                        return (
                            <div onClick={() => {
                                let services = [...professional.services]

                                services.includes(serviceId) ?
                                    services = services.filter(i => i !== serviceId) :
                                    services.push(serviceId)

                                updateProfessional(professional, setProfessional, 'services', services)
                            }} key={serviceId}>
                                <p>{serviceCache[serviceId].name} {professional.services.includes(serviceId) ? '-Selected' : null}</p>
                            </div>
                        )
                    })
            }
        </div>
    )
}