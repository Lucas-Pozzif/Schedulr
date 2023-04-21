import { useState, useEffect } from "react";
import { getAllServices, getService, serviceType } from "../../../controllers/serviceController"
import { Link } from "react-router-dom";
import { ServiceButton } from "../../../components/buttons/service-button/service-button";

const serviceCache = require('../../../cache/serviceCache.json')

function ServiceList() {
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
            <div className="service-list-header">
                <Link to='/service/add'>Add</Link>
            </div>
            {
                loading ?
                    <p>loading...</p> :
                    serviceIds!.map((serviceId: string) => {
                        const service = serviceCache[serviceId]
                        return (
                            <ServiceButton
                                darkmode={false}
                                service={service}
                                onClickButton={() => { console.log('clickedButton') }}
                                onClickExpanded={[
                                    () => { console.log('clickedButton1') },
                                    () => { console.log('clickedButton2') },
                                    () => { console.log('clickedButton3') },
                                    () => { console.log('clickedButton4') }
                                ]}
                            />
                        )
                    })
            }
        </div>
    )
}

export { ServiceList }