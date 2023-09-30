import { arrayIndexToTime } from "../../../../functions/array-index-to-time/array-index-to-time";
import { timeToArrayIndex } from "../../../../functions/time-to-array-index/time-to-array-index";
import { selectedServiceType } from "../../../../pages/schedule/schedule-add/schedule-add";
import { scheduleType } from "../../../../pages/schedule/schedule-add/schedule-add";
import { ItemButton } from "../item-button";

const serviceCache = require('../../../../cache/serviceCache.json');
const professionalCache = require('../../../../cache/professionalCache.json');

type scheduleButtonType = {
    state: 'active' | 'selected' | 'inactive',
    selectedService: selectedServiceType,
    detailText: string
    onClickButton: () => void
}

export function ScheduleButton({ state, selectedService, detailText, onClickButton }: scheduleButtonType) {
    const title = selectedService.service === null ?
        'Sem Serviço' :
        selectedService.startTime !== null ?
            `${serviceCache[selectedService.service].name} - ${arrayIndexToTime(selectedService.startTime)}` :
            serviceCache[selectedService.service].name
    const durationCalculator = (duration: boolean[]) => {
        const lastTrueIndex = duration.lastIndexOf(true);
        const trueDuration = duration.slice(0, lastTrueIndex + 1);
        return `${10 * (trueDuration.length)} min`
    }

    return (
        <ItemButton
            state={state}
            title={title}
            subtitle={selectedService.professional === null ? 'Sem Preferência' : professionalCache[selectedService.professional].name}
            detailText={detailText}
            detailSubtitleText={durationCalculator(
                selectedService.service === null ? undefined :
                    serviceCache[selectedService.service].haveStates ?
                        serviceCache[selectedService.service].stateDurations[selectedService.state] :
                        serviceCache[selectedService.service].duration
            )}
            onClickButton={onClickButton}
        />


    )
}