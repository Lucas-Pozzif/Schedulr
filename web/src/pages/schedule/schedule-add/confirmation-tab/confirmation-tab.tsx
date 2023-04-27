import { scheduleTabType } from "../schedule-add";
import { ScheduleButton } from "../../../../components/buttons/schedule-button/schedule-button";

export function ConfirmationTab({ schedule, setSchedule, setTab }: scheduleTabType) {


    return (
        <>
            {
                schedule.selectedServices.map((selectedService) => {
                    if (selectedService.service != null && selectedService.professional != null) {
                        return (
                            <ScheduleButton selectedService={selectedService} onClickButton={() => { }} />
                        )
                    }
                })
            }
        </>
    )

}