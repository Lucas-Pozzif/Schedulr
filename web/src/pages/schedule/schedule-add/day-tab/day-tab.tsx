import { DateButton } from "../../../../components/buttons/date-button/date-button";
import { dateArrayGenerator } from "../../../../functions/date-time/date-array-generator";
import { scheduleTabType } from "../schedule-add";

import './day-tab.css'

export function DayTab({ schedule, setSchedule }: scheduleTabType) {
    const dates = dateArrayGenerator(30)

    return (
        <div className="day-tab">
            {
                dates.map((date) => {
                    const dateValue = date.toLocaleDateString('en-US')
                    return (
                        <DateButton
                            selected={dateValue == schedule.selectedDate}
                            date={date}
                            onClickButton={() => setSchedule({ ...schedule, selectedDate: dateValue })}
                        />
                    )
                })
            }
        </div>
    );
}