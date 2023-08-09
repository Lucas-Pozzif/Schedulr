import { useState } from 'react'
import { professionalTabType } from "../professional-form";
import { professionalType } from '../../../../controllers/professionalController';
import { SmallButton } from '../../../../components/buttons/small-button/small-button';
import { ItemButton } from '../../../../components/buttons/item-button/item-button';

import './style.css'

export function DisponibilityTab({ professional, setProfessional }: professionalTabType) {
    const [weekDay, setWeekDay] = useState(0)
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
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
        <div className='p-form-dispotab'>
            <div className="flex-div p-form-dispotab-week-list">
                {weekDays.map((dayName) => (
                    <SmallButton
                        state={weekDays.indexOf(dayName) === weekDay ? 'selected' : 'active'}
                        key={dayName}
                        title={dayName}
                        onClickButton={() => setWeekDay(weekDays.indexOf(dayName))}
                    />
                ))}
            </div>
            <div className='p-form-dispotab-time-list'>
                {
                    hours.map((hour) => {
                        const index = hours.indexOf(hour)
                        return (
                            <ItemButton
                                state={disponibilityList[index] ? 'selected' : 'active'}
                                title={hour}
                                detailText={disponibilityList[index] ? 'Selecionado' : 'Selecionar'}
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
            </div>
        </div>
    )
}