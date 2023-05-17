import { useNavigate } from "react-router-dom";
import { ProfessionalButton } from "../../../../components/buttons/image-button/professional-button/professional-button";
import { ServiceButton } from "../../../../components/buttons/item-button/service-button/service-button";
import { Header } from "../../../../components/header/header";
import { deleteProfessional } from "../../../../controllers/professionalController";
import { deleteService } from "../../../../controllers/serviceController";
import { professionalTabType } from "../professional-form";

import './style.css'

export function DeleteTab({ professional, professionalId }: professionalTabType) {
    const navigate = useNavigate()
    return (
        <div className="p-form-deltab">
            <Header
                title="Tem certeza que deseja excluir esse profissional?"
                subtitle="não irá remover os agendamentos que já foram feitos com ele."
                buttonTitle="Excluir"
                onClickButton={async () => {
                    if (professionalId !== undefined) await deleteProfessional(professionalId);
                    navigate('/professional')
                }} />
            <ProfessionalButton state="active" professional={professional} detailText="Cancelar" />
        </div>
    )
}