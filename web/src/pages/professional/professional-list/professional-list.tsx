import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProfessionals } from "../../../controllers/professionalController";
import { Header } from "../../../components/header/header";
import { ProfessionalButton } from "../../../components/buttons/image-button/professional-button/professional-button";

import './style.css'
import { Input } from "../../../components/input/input";
import { LoadingScreen } from "../../../components/loading/loading-screen/loading-screen";

const professionalCache = require('../../../cache/professionalCache.json')

function ProfessionalList() {
    const [loading, setLoading] = useState(true);
    const [professionalIds, setProfessionalIds] = useState<string[] | null>(null)
    const [searchBar, setSearchBar] = useState('')

    useEffect(() => {
        getAllProfessionals().then(() => {
            setProfessionalIds(Object.keys(professionalCache));
            setLoading(false);
        });
    }, []);

    const navigate = useNavigate()

    return (
        <div className="professional-list-page">
            <Header
                title="Chegou alguém novo no time?"
                subtitle="Todos precisam estar presentes"
                buttonTitle="Novo profissional"
                onClickButton={() => { navigate('/professional/add') }}
                onClickReturn={() => { navigate('/') }}
            />
            <div className="professional-list-block">
                <Input placeholder="Pesquisar" onValueChange={(e) => { setSearchBar(e.target.value.toLowerCase()) }} />
                <div className="professional-list">
                    {
                        loading ?
                            <LoadingScreen /> :
                            professionalIds!.map((professionalId: string) => {
                                const professional = professionalCache[professionalId]
                                if (!professional.name.toLowerCase().includes(searchBar)) return null
                                return (
                                    <ProfessionalButton
                                        state='active'
                                        professional={professional}
                                        detailText="Ver serviços"
                                        onClickButton={() => { navigate(`/professional/edit/${professionalId}`) }}
                                    />
                                )
                            })
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfessionalList