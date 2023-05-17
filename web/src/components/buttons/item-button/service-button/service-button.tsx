import { useState } from "react";
import { serviceType } from "../../../../controllers/serviceController";
import { ItemButton } from "../item-button";

import './style.css'

type serviceButtonType = {
    state: 'active' | 'inactive' | 'selected',
    service: serviceType,
    expandedState?: [
        'active' | 'inactive' | 'selected',
        'active' | 'inactive' | 'selected',
        'active' | 'inactive' | 'selected',
        'active' | 'inactive' | 'selected'
    ],
    allowExpand?: boolean,
    onClickButton?: () => void,
    onClickExpanded?: [() => void, () => void, () => void, () => void]
}

export function ServiceButton(
    {
        state,
        service,
        expandedState,
        allowExpand,
        onClickButton = () => { },
        onClickExpanded
    }: serviceButtonType
) {
    const [expanded, setExpanded] = useState(false)

    const detailText = service.haveStates ?
        allowExpand ?
            expanded ?
                'Ocultar' :
                'Expandir' :
            'Inexpansível' :
        `R$ ${service.value}`

    const durationCalculator = (duration: boolean[]) => {
        const lastTrueIndex = duration.lastIndexOf(true);
        const trueDuration = duration.slice(0, lastTrueIndex + 1);
        return `${10 * (trueDuration.length)} min`
    }

    return (
        <div className="service-button">
            <ItemButton
                state={state}
                title={service.name}
                //subtitle={ }
                detailText={detailText}
                highlightText={service.inicial && !service.haveStates ? 'A partir de' : undefined}
                detailSubtitleText={service.haveStates ? undefined : durationCalculator(service.duration)}
                onClickButton={onClickButton}
                onClickDetailButton={() => { if(allowExpand) setExpanded(!expanded) }}
            />
            {
                expanded ?
                    <div className={`service-button-expansion button`}>
                        {
                            service.stateNames.map((stateName) => {
                                const index = service.stateNames.indexOf(stateName)
                                const expandedDetailText = `R$ ${service.stateValues[index]}`

                                if (index !== 0 && index !== 1 && index !== 2 && index !== 3) return null
                                return (
                                    <ItemButton
                                        state={expandedState?.[index] || 'active'}
                                        title={stateName}
                                        //subtitle={ }
                                        detailText={expandedDetailText}
                                        highlightText={service.inicial ? 'A partir de' : undefined}
                                        detailSubtitleText={durationCalculator(service.stateDurations[index])}
                                        onClickButton={onClickExpanded?.[index]}
                                    />
                                )
                            })
                        }
                    </div> :
                    null
            }
        </div>
    )
}