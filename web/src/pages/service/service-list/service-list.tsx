import { useState, useEffect } from "react";
import { getAllServices, getService, serviceType } from "../../../controllers/serviceController"
import { Link, useNavigate } from "react-router-dom";
import { ServiceButton } from "../../../components/buttons/service-button/service-button";
import { ServiceHeader } from "../../../components/headers/service-header/service-header";
import { onAuthStateChanged } from "firebase/auth";
import { getAdmins } from "../../../controllers/configController";
import { auth } from "../../../firebase/firebase";

const serviceCache = require('../../../cache/serviceCache.json')

function ServiceList() {
    const [loading, setLoading] = useState(true);
    const [serviceIds, setServiceIds] = useState<string[] | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        getAllServices().then(() => {
            setServiceIds(Object.keys(serviceCache));
            onAuthStateChanged(auth, async (user) => {
                getAdmins().then((adms) => {
                    if (adms && user?.email) {
                        if (adms.emails.includes(user.email)) setIsAdmin(true)
                    }
                })
            })
            setLoading(false);
        });
    }, []);

    return (
        <div className="service-tab">
            <ServiceHeader />
            {
                loading ?
                    <p>loading...</p> :
                    serviceIds!.map((serviceId: string) => {
                        const service = serviceCache[serviceId]
                        return (
                            <ServiceButton
                                selected={false}
                                service={service}
                                onClickButton={() => {
                                    if (isAdmin) {
                                        navigate('/service/edit/' + serviceId)
                                    }
                                }}
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