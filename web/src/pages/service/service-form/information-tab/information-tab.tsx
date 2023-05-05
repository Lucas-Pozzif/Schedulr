import { useState } from "react"
import { ServiceTabType } from "../service-form"
import { Input } from "../../../../components/input/input";
import updateService from "../../../../functions/updaters/update-service";
import { Line } from "../../../../components/line/line";
import { VerticalLine } from "../../../../components/line/vertical-line";
import { SmallButton } from "../../../../components/buttons/small-button/small-button";

import './style.css'

export function InformationTab({ service, setService }: ServiceTabType) {
    const [state, setState] = useState(0)
    const newNames = [...service.stateNames];
    const newValues = [...service.stateValues];

    return (
        <div className="s-form-infotab">
            {
                service.haveStates ?
                    <div className="s-form-state-block">
                        <Line />
                        <div className="s-form-state-tab flex-div">
                            {service.stateNames.map((stateName, index) => (
                                <SmallButton
                                    state={index == state ? "selected" : 'active'}
                                    key={index}
                                    title={stateName}
                                    onClickButton={() => setState(index)}
                                />
                            ))}
                        </div>
                    </div> :
                    null
            }
            <Input
                label="Alterar nome do serviço"
                value={service.name}
                onValueChange={(e) => updateService(service, setService, 'name', e.target.value)}
                placeholder="Digite o nome do serviço"
            />
            <div className="flex-div s-form-infotab-bottom">
                <div className="infotab-left-block">
                    {
                        service.haveStates ?
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
                            :
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
                    }
                </div>
                <VerticalLine />
                <div className="infotab-right-block">
                    <SmallButton
                        state={service.haveStates ? 'selected' : 'active'}
                        title="Diferentes Tamanhos"
                        onClickButton={() => updateService(service, setService, 'haveStates', !service.haveStates)}
                    />
                    <SmallButton
                        state={service.inicial ? 'selected' : 'active'}
                        title="A partir de"
                        onClickButton={() => updateService(service, setService, 'inicial', !service.inicial)}
                    />
                </div>
            </div>
        </div>
    )
}