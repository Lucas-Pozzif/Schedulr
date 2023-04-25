import { useState } from "react";
import { serviceType } from "../../../controllers/serviceController"

import './service-button.css'
import { isSelected } from "../../../functions/is-selected/is-selected";

type serviceButtonType = {
    selected?: boolean,
    expandedselected?: [boolean, boolean, boolean, boolean],
    allowExpand?: boolean,
    service: serviceType,
    onClickButton: () => void,
    onClickExpanded?: [() => void, () => void, () => void, () => void]
}

export function ServiceButton(
    {
        selected = false,
        expandedselected,
        allowExpand = true,
        service,
        onClickButton,
        onClickExpanded
    }: serviceButtonType
) {
    const [expanded, setExpanded] = useState(false)

    const duration = service.duration
    const stateDurationList = service.stateDurations
    const title = service.name
    const subtitle = service.name
    const rightButtonTitle = isExpansible()
    const rightButtonSubtitle = durationCalc()
    const rightButtonSideText = inicialText()
    const expandedTitle = [...service.stateNames]
    const expandedRightButtonTitle = [...service.stateValues]
    const expandedRightButtonSideText = inicialText(true)
    const expandedRightButtonSubtitle = durationCalc(true)

    function isExpansible() {
        return service.haveStates ?
            allowExpand ?
                expanded ?
                    'Ocultar' :
                    'Expandir' :
                'Inexpansível' :
            `R$ ${service.value}`

    }
    function durationCalc(expanded: boolean = false) {
        const lastTrueIndex = duration.lastIndexOf(true);
        const trueDuration = duration.slice(0, lastTrueIndex + 1);
        const stateTrueDurationArray = []

        for (let i = 0; i < 4; i++) {
            const stateDuration = stateDurationList[i as keyof typeof service.stateDurations]
            const lastTrueIndex = stateDuration.lastIndexOf(true);
            stateTrueDurationArray.push(stateDuration.slice(0, lastTrueIndex + 1));
        }

        return expanded ?
            stateTrueDurationArray.map((stateTrueDuration) => {
                return (`${10 * (stateTrueDuration.length)} min`)
            }) :
            service.haveStates ?
                null :
                `${10 * (trueDuration.length)} min`

    }
    function inicialText(expanded: boolean = false) {
        return service.inicial ?
            service.haveStates && !expanded ?
                null :
                'A partir de' :
            null
    }
    function clickHandler() {
        if (service.haveStates && allowExpand) {
            setExpanded(!expanded);
        }
    }

    return (
        <div>
            <div className={`service-button button ${isSelected(selected)}`} onClick={onClickButton}>
                <div className={`sb-title-block`}>
                    <p className={`sb-title button-text ${isSelected(selected)}`}>{title}</p>
                    <p className={`sb-subtitle button button-text ${isSelected(!selected)}`}>{subtitle}</p>
                </div>
                <div className="sb-right-button-block">
                    <div className="sb-right-button" >
                        <p className={`sb-right-button-side-text button-text ${isSelected(selected)}`}>{rightButtonSideText}</p>
                        <p className={`sb-right-button-title button button-text ${isSelected(!selected)}`} onClick={clickHandler}>{rightButtonTitle}</p>
                    </div>
                    <p className={`sb-right-button-subtitle ${isSelected(selected)}`}>{rightButtonSubtitle}</p>
                </div>
            </div >
            {
                expanded ?
                    <div className={`sb-expansion button`}>
                        {
                            expandedTitle.map((expandedTitleItem) => {
                                const index = expandedTitle.indexOf(expandedTitleItem)

                                return (
                                    <div className={`sb-expanded-button ${isSelected(expandedselected![index])}`} onClick={() => { if (onClickExpanded) onClickExpanded[index]() }}>
                                        <p className={`sb-title button-text ${isSelected(expandedselected![index])}`}>{expandedTitle[index]}</p>
                                        <div className="sb-right-button-block">
                                            <div className="sb-right-button" >
                                                <p className={`sb-right-button-side-text button-text ${isSelected(expandedselected![index])}`}>{expandedRightButtonSideText}</p>
                                                <p className={`sb-right-button-title button button-text ${isSelected(!expandedselected![index])}`}>R$ {expandedRightButtonTitle[index]}</p>
                                            </div>
                                            <p className={`sb-right-button-subtitle button-text ${isSelected(expandedselected![index])}`}>{expandedRightButtonSubtitle![index]}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div> :
                    null
            }
        </div>
    )

}