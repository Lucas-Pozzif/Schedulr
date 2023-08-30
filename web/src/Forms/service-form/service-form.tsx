import { useState, useEffect } from "react"
import { User } from "../../Classes/user"
import { Service } from "../../Classes/service"
import { useNavigate, useParams } from "react-router-dom"
import { ReturnButton } from "../../Components/buttons/return-button/return-button"
import { VerticalIconButton } from "../../Components/buttons/vertical-icon-button/vertical-icon-button"
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen"
import { Input } from "../../Components/input/input"
import { ErrorScreen } from "../../Components/error/error-screen/error-screen"

type ServiceFormType = {
    user?: User
    service?: Service
}

export function ServiceForm({ user, service = new Service() }: ServiceFormType) {
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0)
    const [sService, setSService] = useState(0)
    const [serviceForm, setServiceForm] = useState(service);

    const { serviceId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        if (serviceId) {
            service.getService(serviceId).then(() => {
                setServiceForm(service)
            })
        }
        setLoading(false)
    }, []);

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className="sf-tab sf-info">
                        <Input
                            label="Alterar nome do serviço"
                            value={serviceForm.getName()}
                            onValueChange={(e) => {
                                serviceForm.setName(e.target.value);
                                const updatedService = new Service();
                                updatedService.fillFromService(serviceForm);
                                setServiceForm(updatedService);
                            }}
                            placeholder="Digite o nome do serviço"
                        />
                        <div className="sf-info-bottom">
                            <div className="sfib-left">
                                {
                                    service.getInicial() ?
                                        <>
                                            <Input
                                                label="Digite o nome do estado"
                                                placeholder="Alterar nome do estado"
                                                value={service.getSubServices()[sService].getName()}
                                                onValueChange={(e) => {
                                                    serviceForm.getSubServices()[sService].setName(e.target.value);
                                                    const updatedService = new Service();
                                                    updatedService.fillFromService(serviceForm);
                                                    setServiceForm(updatedService);
                                                }}
                                            />
                                            <Input
                                                label="Digite o valor do serviço nesse estado"
                                                placeholder="Alterar valor do estado"
                                                value={service.getSubServices()[sService].getValue()}
                                                onValueChange={(e) => {
                                                    serviceForm.getSubServices()[sService].setValue(e.target.value);
                                                    const updatedService = new Service();
                                                    updatedService.fillFromService(serviceForm);
                                                    setServiceForm(updatedService);
                                                }}
                                            />
                                        </>
                                        :
                                        <Input
                                            label="Digite o valor do serviço"
                                            placeholder="Alterar valor do serviço"
                                            value={service.getValue()}
                                            onValueChange={(e) => {
                                                service.setValue(e.target.value);
                                                const updatedService = new Service();
                                                updatedService.fillFromService(serviceForm);
                                                setServiceForm(updatedService);
                                            }}
                                        />

                                }
                            </div>
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="sf-tab sf-prof">

                    </div>

                )
            case 2:
                return (
                    <div className="sf-tab sf-duration">

                    </div>

                )
            case 3:
                return (
                    <div className="sf-tab sf-delete">

                    </div>

                )
            default:
                return <ErrorScreen />;
        }

    }

    return loading ?
        <LoadingScreen /> :
        (
            <div className="service-form">
                <div className="sf-header flex-div ">
                    <ReturnButton onClickButton={() => { navigate(-1) }} />
                    <div className="sf-button">

                    </div>
                </div>
                <div className="sf-tab-list flex-div">
                    <VerticalIconButton state={tab == 0 ? "selected" : 'active'} title="Informações Individuais" icon="a" onClickButton={() => { setTab(0) }} />
                    <VerticalIconButton state={tab == 1 ? "inactive" : 'inactive'} title="Alterar Profissionais" icon="a" onClickButton={() => { setTab(1) }} />
                    <VerticalIconButton state={tab == 2 ? "selected" : 'active'} title="Tempo de Duração" icon="a" onClickButton={() => { setTab(2) }} />
                    <VerticalIconButton state={tab == 3 ? "selected" : 'active'} title="Excluir Serviço" icon="a" onClickButton={() => { setTab(3) }} />
                </div>
                {tabHandler()}
                <div className="sf-save-button">Save</div>
            </div>
        )
}