import { useState } from 'react'
import { ServiceTabType } from "../service-form";
import { ItemButton } from '../../../../components/buttons/item-button/item-button';
import { Line } from '../../../../components/line/line';
import { SmallButton } from '../../../../components/buttons/small-button/small-button';

import './style.css'
import { DetailButton2 } from '../../../../components/buttons/detail-button-2/detail-button-2';
import { Header } from '../../../../components/header/header';
import { arrayIndexToTime } from '../../../../functions/array-index-to-time/array-index-to-time';

export function DurationTab({ service, setService }: ServiceTabType) {
    const [state, setState] = useState(0)
    const hours: string[] = []
    const durationList = service.haveStates ? service.stateDurations[state as keyof typeof service.stateDurations] : service.duration

    for (let hour = 0; hour < 24; hour++) {
        hours.push(`${hour}:00`)
        hours.push(`${hour}:10`)
        hours.push(`${hour}:20`)
        hours.push(`${hour}:30`)
        hours.push(`${hour}:40`)
        hours.push(`${hour}:50`)
    }

    return (
        <div className='s-form-durtab'>
            {
                service.haveStates ?
                    <div className='s-form-state-block'>
                        <Line />
                        <div className="s-form-state-tab flex-div">
                            {service.stateNames.map((stateName, index) => (
                                <DetailButton2
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
            <Line />
            <Header
                title='Selecione o tempo que seu serviço leva'
                subtitle='Nos espaços não selecionados, outros clientes podem agendar serviços.'
            />
            <div className='s-form-durtab-time-list'>
                {
                    hours.map((hour, index) => {
                        return <ItemButton
                            state={durationList[index] ? 'selected' : 'active'}
                            title={arrayIndexToTime(index + 1)}
                            detailText={durationList[index] ? 'Selecionado' : 'Selecionar'}
                            onClickButton={
                                () => {
                                    const updateDuration = [...service.duration];
                                    const updateStateDuration = [...service.stateDurations[state as keyof typeof service.stateDurations]]
                                    if (service.haveStates) {
                                        updateStateDuration[index] = !updateStateDuration[index];

                                        const updateStateDurations = service.stateDurations
                                        updateStateDurations[state as keyof typeof service.stateDurations] = updateStateDuration

                                        setService({
                                            ...service,
                                            stateDurations: updateStateDurations
                                        });
                                    } else {
                                        updateDuration[index] = !updateDuration[index];

                                        setService({
                                            ...service,
                                            duration: updateDuration
                                        });
                                    }
                                }
                            }
                        />

                    })
                }
            </div>
        </div>
    )
} 