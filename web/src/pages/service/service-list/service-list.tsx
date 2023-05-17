import { useState, useEffect } from "react";
import { getAllServices, getService, serviceType } from "../../../controllers/serviceController"
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getAdmins } from "../../../controllers/configController";
import { auth } from "../../../firebase/firebase";
import { Header } from "../../../components/header/header";
import { ServiceButton } from "../../../components/buttons/item-button/service-button/service-button";
import { Input } from "../../../components/input/input";

import './style.css'

const serviceCache = require('../../../cache/serviceCache.json')

function ServiceList() {
    const [loading, setLoading] = useState(true);
    const [serviceIds, setServiceIds] = useState<string[] | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [searchBar, setSearchBar] = useState('')

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
            <Header
                title="Que tal adicionar um novo serviço?"
                subtitle="Inovar sempre atrai novos clientes!"
                buttonTitle="Entrar em contato"
                onClickButton={() => { navigate('/service/add') }}
                onClickReturn={() => { navigate(-1) }}
            />
            <div className="service-list-block">
                <Input placeholder="Pesquisar" onValueChange={(e) => { setSearchBar(e.target.value.toLowerCase()) }} />
                <div className="service-list">
                    {
                        loading ?
                            <p>loading...</p> :
                            serviceIds!.map((serviceId: string) => {
                                const service = serviceCache[serviceId]
                                if (!service.name.toLowerCase().includes(searchBar)) return null
                                return (
                                    <ServiceButton
                                        state='active'
                                        service={service}
                                        allowExpand={true}
                                        onClickButton={() => {
                                            navigate(`/service/edit/${serviceId}`)
                                        }}
                                    />
                                )
                            })
                    }
                </div>
            </div>
        </div>
    )
}

export { ServiceList }