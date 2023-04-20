import { useState } from 'react'
import { professionalTabType } from "../professional-form";
import { professionalType } from '../../../../controllers/professionalController';
import { LargeButton } from '../../../../components/buttons/large-button/large-button';
import StateTab from '../../../../components/tabs/state-tab/state-tab';
import { TabButton } from '../../../../components/buttons/tab-button/tab-button';

type timeListRenderType = {
    professional: professionalType,
    setProfessional: (professional: professionalType) => void,
    weekDay: number
}

type weekTabType = {
    weekDay: number,
    setWeekDay: (week: number) => void
}

function WeekTab({ weekDay, setWeekDay }: weekTabType) {

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

    return (
        <div className="stateTab">
            {weekDays.map((dayName) => (
                <TabButton
                    key={dayName}
                    title={dayName}
                    onClickButton={() => setWeekDay(weekDays.indexOf(dayName))}
                />
            ))}
        </div>

    )

}

function TimeListRender({ professional, setProfessional, weekDay }: timeListRenderType) {
    const disponibilityList = professional.disponibility[weekDay as keyof typeof professional.disponibility]

    const hours: string[] = []
    for (let hour = 0; hour < 24; hour++) {
        hours.push(`${hour}:00`)
        hours.push(`${hour}:10`)
        hours.push(`${hour}:20`)
        hours.push(`${hour}:30`)
        hours.push(`${hour}:40`)
        hours.push(`${hour}:50`)
    }

    return (
        <>
            {
                hours.map((hour) => {
                    const index = hours.indexOf(hour)
                    return (
                        <LargeButton
                            darkMode={disponibilityList[index]}
                            title={hour}
                            onClickButton={
                                () => {
                                    const updateDisponibility = professional.disponibility;
                                    const updateDayDisponibility = [...professional.disponibility[weekDay as keyof typeof professional.disponibility]]

                                    updateDayDisponibility[index] = !updateDayDisponibility[index]
                                    updateDisponibility[weekDay as keyof typeof professional.disponibility] = updateDayDisponibility

                                    setProfessional({
                                        ...professional,
                                        disponibility: updateDisponibility
                                    });
                                }
                            }
                        />
                    )
                })
            }
        </>
    )

}

export function DisponibilityTab({ professional, setProfessional }: professionalTabType) {
    const [weekDay, setWeekDay] = useState(0)

    return (
        <>
            <WeekTab weekDay={weekDay} setWeekDay={setWeekDay} />
            <TimeListRender professional={professional} setProfessional={setProfessional} weekDay={weekDay} />
        </>
    )
}