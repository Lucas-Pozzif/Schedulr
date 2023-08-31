import { useState, useEffect } from "react"
import { User } from "../../Classes/user"
import { Service } from "../../Classes/service"
import { useNavigate, useParams } from "react-router-dom"
import { ReturnButton } from "../../Components/buttons/return-button/return-button"
import { VerticalIconButton } from "../../Components/buttons/vertical-icon-button/vertical-icon-button"
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen"
import { Input } from "../../Components/input/input"
import { ErrorScreen } from "../../Components/error/error-screen/error-screen"
import { VerticalLine } from "../../Components/line/vertical-line"
import { SmallButton } from "../../Components/buttons/small-button/small-button"
import { ItemButton } from "../../Components/buttons/item-button/item-button"
import { Header } from "../../Components/header/header"

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
            const updatedService = new Service()
            updatedService.getService(serviceId).then(() => setServiceForm(updatedService))
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
                        <div className="sf-info-bottom flex-div">
                            <div className="sfib-left">
                                {
                                    serviceForm.getSubServices()?.length > 0 ?
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
                                            value={serviceForm.getValue()}
                                            onValueChange={(e) => {
                                                serviceForm.setValue(e.target.value);
                                                const updatedService = new Service();
                                                updatedService.fillFromService(serviceForm);
                                                setServiceForm(updatedService);
                                            }}
                                        />
                                }
                            </div>
                            <VerticalLine />
                            <div className="sfib-right">
                                <SmallButton
                                    state={serviceForm.getInicial() ? 'selected' : 'active'}
                                    title="A partir de"
                                    onClickButton={() => {
                                        serviceForm.setInicial(!serviceForm.getInicial())
                                        console.log(serviceForm)
                                        const updatedService = new Service()
                                        updatedService.fillFromService(serviceForm)
                                        setServiceForm(updatedService)
                                    }}
                                />
                                <SmallButton
                                    state={serviceForm.getInicial() ? 'selected' : 'active'}
                                    title="Adicionar Subserviço"
                                    onClickButton={() => {
                                        serviceForm.addSubService()
                                    }}
                                />
                                <SmallButton
                                    state={serviceForm.getInicial() ? 'selected' : 'active'}
                                    title="Excluir Subserviço"
                                    onClickButton={() => {
                                        serviceForm.removeSubService(sService)
                                    }}
                                />

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
                const timespan: string[] = []

                for (let hour = 0; hour < 24; hour++) {
                    timespan.push(`${hour}:00`)
                    timespan.push(`${hour}:10`)
                    timespan.push(`${hour}:20`)
                    timespan.push(`${hour}:30`)
                    timespan.push(`${hour}:40`)
                    timespan.push(`${hour}:50`)

                }
                return (
                    <div className="sf-tab sf-duration">
                        {
                            timespan.map((period, index) => {
                                if (index == 0) return null
                                return (
                                    <ItemButton
                                        state={serviceForm.getDuration()[index] ? 'selected' : 'active'}
                                        title={period}
                                        detailText={serviceForm.getDuration()[index] ? 'Selecionado' : 'Selecionar'}
                                        onClickButton={
                                            () => {
                                                var duration = serviceForm.getDuration(); //boolean[]
                                                if (duration.length <= index) duration = duration.concat(Array(index - duration.length).fill(false), true);
                                                else {
                                                    duration[index] = !duration[index]
                                                    while (!duration[duration.length - 1]) duration.pop()
                                                }
                                                const updatedService = new Service()
                                                updatedService.fillFromService(serviceForm)
                                                updatedService.setDuration(duration)
                                                setServiceForm(updatedService)
                                            }
                                        }
                                    />
                                )
                            })
                        }
                    </div>

                )
            case 3:
                return (
                    <div className="sf-tab sf-delete">
                        <Header
                            title="Tem certeza que deseja excluir esse serviço?"
                            subtitle="não irá remover os agendamentos que já foram feitos com ele."
                            buttonTitle="Excluir"
                            onClickButton={async () => {
                                await serviceForm.deleteService()
                            }} />

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