import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProfessionals } from "../../../controllers/professionalController";

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
                        return (
                            <div key={professionalId}>
                                <p>{professionalCache[professionalId].name}</p>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default ProfessionalList