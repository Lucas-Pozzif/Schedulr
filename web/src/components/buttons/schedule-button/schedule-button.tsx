import { arrayIndexToTime } from "../../../functions/array-index-to-time/array-index-to-time"
import { durationArrayToString } from "../../../functions/duration-array-to-string/duration-array-to-string"
import { isSelected } from "../../../functions/is-selected/is-selected"
import { selectedServiceType } from "../../../pages/schedule/schedule-add/schedule-add"

const serviceCache = require('../../../cache/serviceCache.json')
const professionalCache = require('../../../cache/professionalCache.json')

type scheduleButtonType = {
    rightButtonText?: string,
    selectedService: selectedServiceType,
    onClickButton: () => void,
}

export function ScheduleButton({ selectedService, onClickButton, rightButtonText = 'Editar' }: scheduleButtonType) {
    const service = selectedService.service !== null ?
        serviceCache[selectedService.service].name :
        "Não Selecionado"
    const startTime = selectedService.startTime !== null ?
    ` - ${arrayIndexToTime(selectedService.startTime)}`:
        ""
    const professional = selectedService.professional !== null ?
        professionalCache[selectedService.professional].name :
        "Não Selecionado"
    const haveStates = selectedService.service !== null ?
        serviceCache[selectedService.service].haveStates :
        false
    const duration = selectedService.service !== null ?
        durationArrayToString(
            haveStates ?
                serviceCache[selectedService.service].stateDurations[selectedService.state] :
                serviceCache[selectedService.service].duration
        ) :
        ''

    return (
        <div className={`professional-button button`} onClick={onClickButton}>
            <div className="pb-left-block">
                <div className={`pb-title-block`}>
                    <p className={`pb-title button-text`}>{service}{startTime}</p>
                    <p className={`pb-subtitle button button-text ${isSelected(true)}`}>{professional}</p>
                </div>

            </div>
            <div className="sb-right-button-block">
                <div className="sb-right-button" >
                    <p className={`sb-right-button-side-text button-text `}></p>
                    <p className={`sb-right-button-title button button-text ${isSelected(true)}`}>{rightButtonText}</p>
                </div>
                <p className={`sb-right-button-subtitle button-text `}>{duration}</p>
            </div>
        </div >
    )
}