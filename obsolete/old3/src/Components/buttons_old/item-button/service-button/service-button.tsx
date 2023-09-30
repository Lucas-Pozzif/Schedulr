import { useState } from "react";
import { ItemButton } from "../item-button";

import './style.css'
import { Service } from "../../../../Classes/service";

type serviceButtonType = {
    state: 'active' | 'inactive' | 'selected',
    service: Service,
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

    const detailText = service.getSubServices().length > 0 ?
        allowExpand ?
            expanded ?
                'Ocultar' :
                'Expandir' :
            'Inexpansível' :
        `R$ ${service.getValue()}`

    const durationCalculator = (duration: boolean[]) => {
        return `${10 * (duration.length)} min`
    }

    return (
        <div>
            <ItemButton
                state={state}
                title={service.getName()}
                //subtitle={ }
                detailText={detailText}
                highlightText={service.getInicial() && !(service.getSubServices().length > 0) ? 'A partir de' : undefined}
                detailSubtitleText={service.getSubServices().length > 0 ? undefined : durationCalculator(service.getDuration())}
                onClickButton={onClickButton}
            />
            {
                /*
                expanded ?
                    <div className={`service-button-expansion button`}>
                        {
                            service.getSubServices().map((sService, index) => {
                                return (
                                    <ItemButton
                                        state={'active'}
                                        title={sService.getName}
                                        //subtitle={ }
                                        detailText={`R$ ${sService.getValue()}`}
                                        highlightText={service.getInicial() ? 'A partir de' : undefined}
                                        detailSubtitleText={durationCalculator(service.stateDurations[index])}
                                        onClickButton={onClickExpanded?.[index]}
                                    />
                                )
                            })
                        }
                    </div> :
                    null
                    */
            }
        </div>
    )
}