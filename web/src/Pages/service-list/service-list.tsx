import { useState, useEffect } from "react";
import { User } from "../../Classes/user";
import { Service } from "../../Classes/service";
import { ServiceButton } from "../../Components/buttons/item-button/service-button/service-button";

type ServiceListType = {
    user?: User
}
export function ServiceList({ user }: ServiceListType) {
    const [loading, setLoading] = useState(false);
    const [serviceList, setServiceList] = useState<Service[]>([]);

    useEffect(() => {
        setLoading(true);
        user?.getServiceList().then((sList: Service[]) => {
            setServiceList(sList)
            setLoading(false)

        })
    }, [])

    return (
        <div className="service-list">
            {
                serviceList.map((service: Service) => {
                    return (
                        <ServiceButton
                            state={'active'}
                            service={service}
                            allowExpand={false}
                            onClickButton={() => {
                                console.log(service)
                            }}
                        />
                    )
                })
            }
        </div>
    )
}