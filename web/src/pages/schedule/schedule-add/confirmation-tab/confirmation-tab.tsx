import { ItemButton } from "../../../../components/buttons/item-button/item-button";
import { ScheduleButton } from "../../../../components/buttons/item-button/schedule-button/schedule-button";
import { Header } from "../../../../components/header/header";
import { addSchedule } from "../../../../functions/add-schedule/add-schedule";
import { scheduleTabType } from "../schedule-add";

import './style.css'

export function ConfirmationTab({ schedule, setSchedule, setTab }: scheduleTabType) {

    return (
        <div className="schedadd-confirmation-tab">
            <Header
                title="Verifique os serviços que você agendou."
                subtitle="Tudo certo por aqui?"
                buttonTitle="Confirmar"
                onClickReturn={() => setTab(3)}
                onClickButton={async () => {
                    await addSchedule(schedule)
                    setTab(5)
                }}
            />
            <div className="schedadd-confirmation-tab-service-list">
                {
                    schedule.selectedServices.map((selectedService) => {
                        if (selectedService.service != null && selectedService.professional != null) {
                            return (
                                <ScheduleButton state="active" selectedService={selectedService} detailText={schedule.selectedDate} onClickButton={() => setTab(1)} />
                            )
                        }
                    })
                }
            </div>
        </div>
    )

}