import { useState } from 'react'
import { ServiceTabType } from "../service-form";
import { serviceType } from '../../../../controllers/serviceController';
import { LargeButton } from '../../../../components/buttons/large-button/large-button';
import StateTab from '../../../../components/tabs/state-tab/state-tab';

type timeListRenderType = {
    service: serviceType,
    setService: (service: serviceType) => void,
    state: number
}

function TimeListRender({ service, setService, state }: timeListRenderType) {
    const hours: string[] = []

    for (let hour = 0; hour < 24; hour++) {
        hours.push(`${hour}:00`)
        hours.push(`${hour}:10`)
        hours.push(`${hour}:20`)
        hours.push(`${hour}:30`)
        hours.push(`${hour}:40`)
        hours.push(`${hour}:50`)
    }

    const durationList = service.haveStates ? service.stateDurations[state as keyof typeof service.stateDurations] : service.duration

    return (
        <>
            {
                hours.map((hour) => {
                    const index = hours.indexOf(hour)
                    return (
                        <LargeButton
                            darkMode={durationList[index]}
                            title={hour}
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
        </>
    )

}

export function DurationTab({ service, setService }: ServiceTabType) {
    const [state, setState] = useState(0)

    return (

        <div>
            <StateTab service={service} setState={setState} />
            <TimeListRender service={service} setService={setService} state={state} />
        </div>
    )
} 