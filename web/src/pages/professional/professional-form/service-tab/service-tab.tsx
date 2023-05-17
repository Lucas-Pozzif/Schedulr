import { useState, useEffect } from "react";
import { professionalTabType } from "../professional-form";
import { getAllServices } from "../../../../controllers/serviceController";
import updateProfessional from "../../../../functions/updaters/update-professional";
import { ServiceButton } from "../../../../components/buttons/item-button/service-button/service-button";

import './style.css'
import { ItemButton } from "../../../../components/buttons/item-button/item-button";
import ServiceForm from "../../../service/service-form/service-form";
import { Header } from "../../../../components/header/header";
import { Line } from "../../../../components/line/line";

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
        <div className="p-form-servtab">
            <Header
                title="Não encontrou seu serviço?"
                subtitle="Você pode salvar para editar depois de criar o serviço"
            />
            <Line />
            {
                loading ?
                    <p>loading...</p> :
                    serviceIds!.map((serviceId: string) => {
                        const service = serviceCache[serviceId]
                        return (
                            <ServiceButton
                                state={professional.services.includes(serviceId) ? 'selected' : 'active'}
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