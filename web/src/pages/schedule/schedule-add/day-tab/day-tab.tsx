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
        <>
            {dates.map((date) => {
                const dateValue = date.toLocaleDateString('en-US')
                const displayDate = date.toLocaleDateString("pt-BR", { month: "long", day: "numeric" })
                return (
                    <LargeButton
                        darkMode={schedule.selectedDate == dateValue}
                        title={displayDate}
                        onClickButton={
                            () => {
                                setSchedule({
                                    ...schedule,
                                    selectedDate: dateValue
                                });
                            }
                        }
                    />
                )
            })}
        </>
    );
}