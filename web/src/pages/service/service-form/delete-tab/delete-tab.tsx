import { TabButton } from "../../../../components/buttons/tab-button/tab-button";
import { ServiceTabType } from "../service-form";

export function DeleteTab({ service, setService }: ServiceTabType) {
    return (
        <>
            <p>Você tem certeza que deseja remover esse serviço</p>
            <p>Isso não irá remover os agendamentos que já foram feitos com ele</p>
            <TabButton title="Excluir" onClickButton={() => {

            }} />
        </>
    )
}