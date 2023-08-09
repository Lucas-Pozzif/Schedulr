import { ServiceButton } from "../../../../components/buttons/item-button/service-button/service-button";
import { Header } from "../../../../components/header/header";
import { deleteService } from "../../../../controllers/serviceController";
import { ServiceTabType } from "../service-form";

import './style.css'

export function DeleteTab({ service, setService }: ServiceTabType) {
    return (
        <div className="s-form-deltab">
            <Header
                title="Tem certeza que deseja excluir esse serviço?"
                subtitle="não irá remover os agendamentos que já foram feitos com ele."
                buttonTitle="Excluir"
                onClickButton={async () => {
                    //await deleteService('0')
                }} />
            <ServiceButton state="active" service={service} allowExpand={false} />
        </div>
    )
}