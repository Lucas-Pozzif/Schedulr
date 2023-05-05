import { useState } from 'react'
import { ServiceTabType } from "../service-form";
import { ItemButton } from '../../../../components/buttons/item-button/item-button';
import { Line } from '../../../../components/line/line';
import { SmallButton } from '../../../../components/buttons/small-button/small-button';

import './style.css'

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
            <div className='s-form-durtab-time-list'>
                {
                    hours.map((hour, index) => {
                        return (
                            <ItemButton
                                state={durationList[index] ? 'selected' : 'active'}
                                title={hour}
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
                        )
                    })
                }
            </div>
        </div>
    )
} 