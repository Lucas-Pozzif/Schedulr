import { useState } from 'react'
import { professionalTabType } from "../professional-form";
import { professionalType } from '../../../../controllers/professionalController';
import { SmallButton } from '../../../../components/buttons/small-button/small-button';
import { ItemButton } from '../../../../components/buttons/item-button/item-button';

import './style.css'
import { Line } from '../../../../components/line/line';
import { DetailButton } from '../../../../components/buttons/detail-button/detail-button';
import { DetailButton2 } from '../../../../components/buttons/detail-button-2/detail-button-2';
import { Header } from '../../../../components/header/header';

export function DisponibilityTab({ professional, setProfessional }: professionalTabType) {
    const [displayMorning, setDisplayMorning] = useState(false)
    const [displayNight, setDisplayNight] = useState(false)
    const [weekDay, setWeekDay] = useState<number>(0)
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

    const findMostCommonValueInRange = (array: boolean[], startIndex: number, endIndex: number) => {
        const counts = new Map();
        let mostCommonValue = null;
        let maxCount = 0;

        for (let i = startIndex; i <= endIndex; i++) {
            const value = array[i];
            const count = (counts.get(value) || 0) + 1;
            counts.set(value, count);

            if (count > maxCount) {
                maxCount = count;
                mostCommonValue = value;
            }
        }

        return mostCommonValue;
    };
    const updateValuesInRange = (startIndex: number, endIndex: number, newValue: boolean) => {
        const updateDisponibility = professional.disponibility;
        const updateDayDisponibility = [...professional.disponibility[weekDay as keyof typeof professional.disponibility]]
        for (let i = startIndex; i <= endIndex; i++) {
            updateDayDisponibility[i] = newValue
        }

        updateDisponibility[weekDay as keyof typeof professional.disponibility] = updateDayDisponibility

        setProfessional({
            ...professional,
            disponibility: updateDisponibility
        });
    };

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
            <Line />
            <div className='flex-div p-form-dispotab-time-handler'>
                <SmallButton
                    state={!displayMorning ? "active" : "selected"}
                    title={"Exibir antes das 6h"}
                    onClickButton={() => {
                        setDisplayMorning(!displayMorning)
                    }}
                />

                <SmallButton
                    state={!displayNight ? "active" : "selected"}
                    title={"Exibir depois das 18h"}
                    onClickButton={() => {
                        setDisplayNight(!displayNight)
                    }}
                />
            </div>
            <div className='p-form-dispotab-time-list'>
                {
                    hours.map((hour) => {
                        const index = hours.indexOf(hour)
                        if ((index > 108 && !displayNight) || (index < 36 && !displayMorning) || index % 3 !== 0) {
                            return null; // Return null to not render anything if conditions are not met
                        }

                        return <ItemButton
                            state={disponibilityList[index] ? 'selected' : 'active'}
                            title={ hour}
                            detailText={disponibilityList[index] ? 'Selecionado' : 'Selecionar'}
                            onClickButton={() => { updateValuesInRange(index, index + 2, !disponibilityList[index]); }}
                        />
                    })
                }
            </div>
        </div>
    )
}