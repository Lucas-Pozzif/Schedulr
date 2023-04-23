import { DateButton } from "../../../../components/buttons/date-button/date-button";
import { LargeButton } from "../../../../components/buttons/large-button/large-button";
import { scheduleTabType } from "../schedule-add";

export function DayTab({ schedule, setSchedule }: scheduleTabType) {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        dates.push(date);
    }

    return (
        <div className="day-tab">
            
            <div className="dt-day-list">
                {
                    dates.map((date) => {
                        const dateValue = date.toLocaleDateString('en-US')
                        return (
                            <DateButton
                                date={date}
                                onClickButton={() => setSchedule({ ...schedule, selectedDate: dateValue })}
                            />
                        )
                    })
                }

            </div>
        </div>
    );
}