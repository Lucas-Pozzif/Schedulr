import { useState, useEffect } from "react";
import { getAllServices, getService, serviceType } from "../../../controllers/serviceController"
import { Link } from "react-router-dom";

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
                        return (
                            <div key={serviceId}>
                                <p>{serviceCache[serviceId].name}</p>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export { ServiceList }