import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProfessionals } from "../../../controllers/professionalController";
import { Header } from "../../../components/header/header";
import { ProfessionalButton } from "../../../components/buttons/image-button/professional-button/professional-button";

const professionalCache = require('../../../cache/professionalCache.json')

function ProfessionalList() {
    const [loading, setLoading] = useState(true);
    const [professionalIds, setProfessionalIds] = useState<string[] | null>(null)

    useEffect(() => {
        getAllProfessionals().then(() => {
            setProfessionalIds(Object.keys(professionalCache));
            setLoading(false);
        });
    }, []);

    const navigate = useNavigate()

    return (
        <div>
            <Header
                title="Não sabe exatamente quem escolher?"
                subtitle="Deixa isso com a gente!"
                buttonTitle="Sem preferência"
                onClickButton={() => { navigate('/schedule') }}
                onClickReturn={() => { navigate(-1) }}
            />
            {
                loading ?
                    <p>loading...</p> :
                    professionalIds!.map((professionalId: string) => {
                        const professional = professionalCache[professionalId]
                        console.log(professional.name)
                        return (
                            <ProfessionalButton
                                state='active'
                                professional={professional}
                                detailText="Ver serviços"
                                onClickButton={() => { }}
                            />
                        )
                    })
            }
        </div>
    )
}

export default ProfessionalList