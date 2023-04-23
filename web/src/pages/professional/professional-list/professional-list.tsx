import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProfessionals } from "../../../controllers/professionalController";
import { ProfessionalButton } from "../../../components/buttons/professional-button/professional-button";

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

    return (
        <div>
            <div className="service-list-header">
                <Link to='/service/add'>Add</Link>
            </div>
            {
                loading ?
                    <p>loading...</p> :
                    professionalIds!.map((professionalId: string) => {
                        const professional = professionalCache[professionalId]
                        return (
                            <ProfessionalButton
                                selected={false}
                                professional={professional}
                                rightButtonTitle="Ver serviços"
                                onClickButton={() => { }}
                            />
                        )
                    })
            }
        </div>
    )
}

export default ProfessionalList