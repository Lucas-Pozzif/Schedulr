import { useState, Dispatch, SetStateAction, useEffect } from "react"
import { serviceType } from "../../../controllers/serviceController"
import { TabButton } from "../../../components/buttons/tab-button/tab-button"
import { Input } from "../../../components/input/input"

type informationTabType = {
    service: serviceType,
    setService: (service: serviceType) => void
}

type stateTabType = {
    service: serviceType,
    setState: Dispatch<SetStateAction<number>>
}
type stateInputsType = {
    service: serviceType,
    setService: (service: serviceType) => void,
    state: number
}
function updateService(
    service: serviceType,
    setService: (service: serviceType) => void,
    attribute:
        'name' |
        'stateNames' |
        'stateValues' |
        'haveStates' |
        'photo' |
        'inicial' |
        'value' |
        'duration' |
        'currentPromotion' |
        'promotedUntil',
    newValue: any
) {
    const serviceAttributes = {
        name: 'name',
        stateNames: 'stateNames',
        stateValues: 'stateValues',
        haveStates: 'haveStates',
        photo: 'photo',
        inicial: 'inicial',
        value: 'value',
        duration: 'duration',
        currentPromotion: 'promotion.currentPromotion',
        promotedUntil: 'promotion.promotedUntil'
    }
    setService({
        ...service,
        [serviceAttributes[attribute]]: newValue
    })
}

function StateTab({ service, setState }: stateTabType) {
    return service.haveStates ? (
        <div className="stateTab">
            {service.stateNames.map((stateName, index) => (
                <TabButton
                    key={index}
                    title={stateName}
                    onClickButton={() => setState(index)}
                />
            ))}
        </div>
    ) : null;
}
function StateInputsRender({
    service,
    setService,
    state,
}: stateInputsType) {
    const newNames = [...service.stateNames];
    const newValues = [...service.stateValues];

    return (
        <>
            {service.haveStates ? (
                <>
                    <Input
                        label="Digite o nome do estado"
                        placeholder="Alterar nome do estado"
                        value={newNames[state]}
                        onValueChange={(e) => {
                            newNames[state] = e.target.value;
                            setService({
                                ...service,
                                stateNames: newNames,
                            });
                        }}
                    />
                    <Input
                        label="Digite o valor do serviço nesse estado"
                        placeholder="Alterar valor do estado"
                        value={newValues[state].toString()}
                        onValueChange={(e) => {
                            newValues[state] = parseInt(e.target.value);
                            setService({
                                ...service,
                                stateValues: newValues,
                            });
                        }}
                    />
                </>
            ) : (
                <Input
                    label="Digite o valor do serviço"
                    placeholder="Alterar valor do serviço"
                    value={service.value.toString()}
                    onValueChange={(e) =>
                        setService({
                            ...service,
                            value: parseInt(e.target.value),
                        })
                    }
                />
            )}
        </>
    );
}
export function InformationTab({ service, setService }: informationTabType) {
    const [state, setState] = useState(0)

    return (
        <div>
            <StateTab service={service} setState={setState} />
            <Input
                label="Alterar nome do serviço"
                value={service.name}
                onValueChange={(e) => updateService(service, setService, 'name', e.target.value)}
                placeholder="Digite o nome do serviço"
            />
            <StateInputsRender service={service} setService={setService} state={state} />

            <div>
                <TabButton darkMode={service.haveStates} title="Diferentes Tamanhos" onClickButton={() => updateService(service, setService, 'haveStates', !service.haveStates)} />
                <TabButton darkMode={service.inicial} title="A partir de" onClickButton={() => updateService(service, setService, 'inicial', !service.inicial)} />
            </div>
        </div>
    )
}