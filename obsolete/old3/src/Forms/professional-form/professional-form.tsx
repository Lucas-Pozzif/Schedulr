import { useEffect, useState } from "react";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../Classes/user";
import { Professional } from "../../Classes/professional";

type ProfessionalFormType = {
    user?: User
    professional?: Professional
}

export function ProfessionalForm({ user, professional = new Professional() }: ProfessionalFormType) {

    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0)
    const [professionalForm, setProfessionalForm] = useState(professional);

    const { serviceId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        if (serviceId) {
            const updatedService = new Professional()
            updatedService.getProfessional(serviceId).then(() => setProfessionalForm(updatedService))
        }
        setLoading(false)
    }, []);

    return loading ?
        <LoadingScreen /> :
        (
            <div className="professional-form">

            </div>
        )
}